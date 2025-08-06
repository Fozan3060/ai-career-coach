'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type React from 'react'

import { Input } from '@/components/ui/input'
import { Loader2, Sparkles } from 'lucide-react'
import { useImperativeHandle, useState, forwardRef } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { LimitModal } from '@/components/ui/limit-modal'

export type RoadmapDialogueRef = {
  open: () => void
}

export const RoadmapDialogue = forwardRef<RoadmapDialogueRef>((_, ref) => {
  const [open, setOpen] = useState(false)
  const [userInput, setUserInput] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)
  const [limitModalOpen, setLimitModalOpen] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true)
  }))

  const checkUsageAndGenerate = async () => {
    if (isGenerating) return // Prevent double click
    setIsGenerating(true)
    if (!user?.primaryEmailAddress?.emailAddress) {
      setIsGenerating(false)
      return
    }

    try {
      const response = await axios.post<{ canUse: boolean }>(
        '/api/check-usage',
        {
          userEmail: user.primaryEmailAddress.emailAddress,
          agentType: 'roadmap-generator'
        }
      )

      if (response.data.canUse) {
        await generateRoadMap()
      } else {
        setLimitModalOpen(true)
        setIsGenerating(false)
      }
    } catch (error) {
      // If error, allow generation as fallback
      await generateRoadMap()
    }
  }

  const generateRoadMap = async () => {
    if (isGenerating) return // Prevent double click
    setError(null)
    const roadmapid = crypto.randomUUID()
    try {
      await axios.post('/api/ai-roadmap-agent', {
        roadmapId: roadmapid,
        userInput: userInput
      })
      // Success, redirect
      router.push('/ai-tools/ai-roadmap-generator/' + roadmapid)
      setOpen(false)
    } catch (e: any) {
      if (e.response?.status === 403) {
        setError(
          "You've reached the usage limit for roadmap generation. Please upgrade to Premium for unlimited access."
        )
        setTimeout(() => {
          setOpen(false)
          router.push('/billing')
        }, 2000)
      } else {
        setError('Failed to generate roadmap. Please try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='bg-gray-900 text-white rounded-2xl shadow-xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl flex gap-2 items-center'>
              <Sparkles className='text-purple-400' />
              AI Roadmap Generator
            </DialogTitle>
            <DialogDescription className='text-base'>
              Enter Position/Skills to Generate Roadmap.
            </DialogDescription>
          </DialogHeader>
          <div className=' space-y-6 '>
            <Input
              onChange={e => setUserInput(e.target.value)}
              placeholder='e.g Full Stack Developer'
            />
            {error && <p className='text-sm text-red-400'>{error}</p>}
            <Button
              onClick={checkUsageAndGenerate}
              disabled={isGenerating || !userInput || !!error}
              className='
                w-full h-12 text-lg font-semibold rounded-xl
                bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
                text-white shadow-lg hover:shadow-purple-500/25
                transition-all duration-300 transform hover:scale-[1.01]
                flex items-center justify-center gap-2
              '
            >
              {isGenerating ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className='w-5 h-5' /> Generate Roadmap
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <LimitModal
        open={limitModalOpen}
        onOpenChange={setLimitModalOpen}
        featureName='Roadmap Generator'
      />
    </>
  )
})

RoadmapDialogue.displayName = 'RoadmapDialogue'

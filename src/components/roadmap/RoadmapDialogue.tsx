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
import { FileUp, Loader2, Sparkles } from 'lucide-react'
import { useImperativeHandle, useState, forwardRef } from 'react'
import { v7 } from 'uuid'
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
  const [error, setError] = useState<string | null>(null)
  const [limitModalOpen, setLimitModalOpen] = useState(false)
  const roadmapid = v7()
  const router = useRouter()
  const { user } = useUser()

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true)
  }))

  const checkUsageAndGenerate = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return

    try {
      const response = await axios.post<{ canUse: boolean }>('/api/check-usage', {
        userEmail: user.primaryEmailAddress.emailAddress,
        agentType: 'roadmap-generator'
      })
      
      console.log(`Roadmap generation check:`, response.data)
      
      if (response.data.canUse) {
        // User can generate roadmap
        await generateRoadMap()
      } else {
        // Show limit modal
        setLimitModalOpen(true)
      }
    } catch (error) {
      console.error('Error checking usage:', error)
      // If error, allow generation as fallback
      await generateRoadMap()
    }
  }

  const generateRoadMap = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      const roadmapResult = await axios.post('/api/ai-roadmap-agent', {
        roadmapId: roadmapid,
        userInput: userInput
      })
      console.log(roadmapResult)
    } catch (e: any) {
      console.error('RoadMap generator failed', e)
      if (e.response?.status === 403) {
        setError("You've reached the usage limit for roadmap generation. Please upgrade to Premium for unlimited access.")
        setTimeout(() => {
          setOpen(false)
          router.push('/billing')
        }, 2000)
      } else {
        setError('Failed to generate roadmap. Please try again.')
      }
    } finally {
      if (!error) {
        router.push('/ai-tools/ai-roadmap-generator/' + roadmapid)
        setIsGenerating(false)
        setOpen(false)
      } else {
        setIsGenerating(false)
      }
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
            {error && <p className="text-sm text-red-400">{error}</p>}
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
        featureName="Roadmap Generator"
      />
    </>
  )
})

RoadmapDialogue.displayName = 'RoadmapDialogue'

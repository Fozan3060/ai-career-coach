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

export type RoadmapDialogueRef = {
  open: () => void
}

export const RoadmapDialogue = forwardRef<RoadmapDialogueRef>((_, ref) => {
  const [open, setOpen] = useState(false)
  const [userInput, setUserInput] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const roadmapid = v7()
  const router = useRouter()

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true)
  }))

  const generateRoadMap = async () => {
    try {
      setIsGenerating(true)
      const roadmapResult = await axios.post('/api/ai-roadmap-agent', {
        roadmapId: roadmapid,
        userInput: userInput
      })
      console.log(roadmapResult)
    } catch (e) {
      console.error('RoadMap generator failed', e)
      setError('Failed to analyze resume. Please try again.')
    } finally {
      router.push('/ai-tools/ai-roadmap-generator/' + roadmapid)
      setIsGenerating(false)
      setOpen(false)
    }
  }

  return (
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
          <Button
            onClick={generateRoadMap}
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
  )
})

RoadmapDialogue.displayName = 'RoadmapDialogue'

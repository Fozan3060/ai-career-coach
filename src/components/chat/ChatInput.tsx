'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput ({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }
  // 
  return (
    <div className='p-3 sticky w-full bottom-0   backdrop-blur-sm'>
      <form onSubmit={handleSubmit} className='flex gap-3 max-w-4xl mx-auto'>
        <div className='flex-1 relative'>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Type here'
            className='w-full bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 !focus:border-purple-500 !focus:ring-purple-500/20 pr-16 h-10 md:h-12 rounded-4xl text-sm md:text-base'
            disabled={isLoading}
          />
          <Button
            type='submit'
            disabled={!input.trim() || isLoading}
            className='absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 md:h-8 md:w-8 bg-gradient-to-r  from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-300 hover:scale-105'
          >
            <Send className='w-3 h-3 md:w-4 md:h-4 text-black' />
          </Button>
        </div>
      </form>
    </div>
  )
}

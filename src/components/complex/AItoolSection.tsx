'use client'

import { FileText, Map, MessageCircle, PenTool } from 'lucide-react'
import { useRouter } from "next/navigation"
import React from 'react'
import { v7 } from 'uuid'
import { AIToolCard } from '../compound/AIToolsCard'
import axios from 'axios'

const AItoolSection = () => {
  const router = useRouter()
  const chatid = v7()

  const onClickChatAgent = async () => {
    const result = await axios.post('/api/history', {
      recordId: chatid,
      content: ['Dummy']
    })
    console.log(chatid)
    router.push('/ai-tools/ai-chat/' + chatid)
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto'>
      <AIToolCard
        title='AI Career Q&A Chat'
        description='Ask career questions'
        icon={<MessageCircle className='w-8 h-8 text-white' />}
        color='purple'
        onClickLabel='Ask Now'
        onClick={onClickChatAgent}
      />
      <AIToolCard
        title='AI Resume Analyzer'
        description='Improve your resume'
        icon={<FileText className='w-8 h-8 text-white' />}
        color='blue'
        onClickLabel='Analyze Now'
      />
      <AIToolCard
        title='Career Roadmap Generator'
        description='Build your roadmap'
        icon={<Map className='w-8 h-8 text-white' />}
        color='green'
        onClickLabel='Generate Now'
      />
      <AIToolCard
        title='Cover Letter Generator'
        description='Write a cover letter'
        icon={<PenTool className='w-8 h-8 text-white' />}
        color='orange'
        onClickLabel='Create Now'
      />
    </div>
  )
}

export default AItoolSection

'use client'

import { FileText, Map, MessageCircle, PenTool } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import { v7 } from 'uuid'
import { AIToolCard } from '../compound/AIToolsCard'
import axios from 'axios'
import { ResumeDialogue, ResumeDialogueRef } from '../resume/ResumeDialogue'

const AItoolSection = () => {
  const router = useRouter()
  const resumeModalRef = useRef<ResumeDialogueRef>(null)

  const onClickChatAgent = async () => {
    const chatid = v7()
    await axios.post('/api/history', {
      recordId: chatid,
      content: ['Dummy'],
      aiAgentType: 'AIChatBot'
    })
    router.push('/ai-tools/ai-chat/' + chatid)
  }

  const tools: {
    title: string
    description: string
    icon: React.ReactNode
    color: 'purple' | 'blue' | 'green' | 'orange'
    onClickLabel: string
    onClick?: () => void
  }[] = [
    {
      title: 'AI Career Q&A Chat',
      description: 'Ask career questions',
      icon: <MessageCircle className='w-8 h-8 text-white' />,
      color: 'purple',
      onClickLabel: 'Ask Now',
      onClick: onClickChatAgent
    },
    {
      title: 'AI Resume Analyzer',
      description: 'Improve your resume',
      icon: <FileText className='w-8 h-8 text-white' />,
      color: 'blue',
      onClickLabel: 'Analyze Now',
      onClick: () => resumeModalRef.current?.open()
    },
    {
      title: 'Career Roadmap Generator',
      description: 'Build your roadmap',
      icon: <Map className='w-8 h-8 text-white' />,
      color: 'green',
      onClickLabel: 'Generate Now',
      onClick: () => {} 
    },
    {
      title: 'Cover Letter Generator',
      description: 'Write a cover letter',
      icon: <PenTool className='w-8 h-8 text-white' />,
      color: 'orange',
      onClickLabel: 'Create Now',
      onClick: () => {} 
    }
  ]

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl sm:mx-auto mx-5 '>
        {tools.map(tool => (
          <AIToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            color={tool.color}
            onClickLabel={tool.onClickLabel}
            onClick={tool.onClick}
          />
        ))}
      </div>

      <ResumeDialogue ref={resumeModalRef} />
    </>
  )
}

export default AItoolSection

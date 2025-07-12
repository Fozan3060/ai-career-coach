'use client'

import { FileText, Map, MessageCircle, PenTool } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import { v7 } from 'uuid'
import { AIToolCard } from '../compound/AIToolsCard'
import axios from 'axios'
import { ResumeDialogue, ResumeDialogueRef } from '../resume/ResumeDialogue'
import { useUser } from '@clerk/nextjs'
import { RoadmapDialogue, RoadmapDialogueRef } from '../roadmap/RoadmapDialogue'

const AItoolSection = () => {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const resumeModalRef = useRef<ResumeDialogueRef>(null)
  const roadmapModalRef = useRef<RoadmapDialogueRef>(null)

  const onClickChatAgent = async () => {
    if (!isLoaded) return

    if (!isSignedIn) {
      return router.push('/dashboard')
    }
    const chatid = v7()
    await axios.post('/api/history', {
      recordId: chatid,
      content: ['Dummy'],
      aiAgentType: 'ai-chat'
    })
    router.push('/ai-tools/ai-chat/' + chatid)
  }
  const onClickRoadmapAgent = async () => {
    if (!isLoaded) return

    if (!isSignedIn) {
      return router.push('/dashboard')
    }
    roadmapModalRef.current?.open()
  }
  const onClickResumeAgent = async () => {
    if (!isLoaded) return

    if (!isSignedIn) {
      return router.push('/dashboard')
    }
    resumeModalRef.current?.open()
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
      onClick: onClickResumeAgent
    },
    {
      title: 'Career Roadmap Generator',
      description: 'Build your roadmap',
      icon: <Map className='w-8 h-8 text-white' />,
      color: 'green',
      onClickLabel: 'Generate Now',
      onClick: onClickRoadmapAgent
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
      <RoadmapDialogue ref={roadmapModalRef} />
    </>
  )
}

export default AItoolSection

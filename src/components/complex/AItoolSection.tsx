'use client'

import { FileText, Map, MessageCircle, PenTool } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { v7 } from 'uuid'
import { AIToolCard } from '../compound/AIToolsCard'
import axios from 'axios'
import { ResumeDialogue, ResumeDialogueRef } from '../resume/ResumeDialogue'
import { useUser } from '@clerk/nextjs'
import { RoadmapDialogue, RoadmapDialogueRef } from '../roadmap/RoadmapDialogue'
import { LimitModal } from '@/components/ui/limit-modal'

const AItoolSection = () => {
  const router = useRouter()
  const { isSignedIn, isLoaded, user } = useUser()
  const resumeModalRef = useRef<ResumeDialogueRef>(null)
  const roadmapModalRef = useRef<RoadmapDialogueRef>(null)
  const [limitModalOpen, setLimitModalOpen] = useState(false)
  const [limitFeatureName, setLimitFeatureName] = useState('')
  
  // Loading states for each tool
  const [loadingStates, setLoadingStates] = useState({
    chat: false,
    resume: false,
    roadmap: false,
    coverLetter: false
  })

  const setLoading = (tool: keyof typeof loadingStates, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [tool]: loading }))
  }

  const checkUsageAndProceed = async (agentType: string, featureName: string, onSuccess: () => void) => {
    if (!user?.primaryEmailAddress?.emailAddress) return

    try {
      const response = await axios.post<{ canUse: boolean }>('/api/check-usage', {
        userEmail: user.primaryEmailAddress.emailAddress,
        agentType
      })
      
      console.log(`Plan check for ${featureName}:`, response.data)
      
      if (response.data.canUse) {
        onSuccess()
      } else {
        setLimitFeatureName(featureName)
        setLimitModalOpen(true)
      }
    } catch (error) {
      console.error('Error checking usage:', error)
      // If error, allow usage as fallback
      onSuccess()
    }
  }

  const onClickChatAgent = async () => {
    if (!isLoaded) return
    if (loadingStates.chat) return // Prevent double click

    if (!isSignedIn) {
      return router.push('/dashboard')
    }
    
    setLoading('chat', true)
    try {
      const chatid = v7()
      await axios.post('/api/history', {
        recordId: chatid,
        content: ['Dummy'],
        aiAgentType: 'ai-chat'
      })
      router.push('/ai-tools/ai-chat/' + chatid)
    } catch (error) {
      console.error('Error creating chat:', error)
      setLoading('chat', false)
    }
  }

  const onClickRoadmapAgent = async () => {
    if (!isLoaded) return
    if (loadingStates.roadmap) return // Prevent double click

    if (!isSignedIn) {
      return router.push('/dashboard')
    }

    setLoading('roadmap', true)
    try {
      // Just open the modal - usage will be checked when user actually generates roadmap
      roadmapModalRef.current?.open()
    } finally {
      setLoading('roadmap', false)
    }
  }

  const onClickResumeAgent = async () => {
    if (!isLoaded) return
    if (loadingStates.resume) return // Prevent double click

    if (!isSignedIn) {
      return router.push('/dashboard')
    }

    setLoading('resume', true)
    try {
      // Just open the modal - usage will be checked when user actually analyzes resume
      resumeModalRef.current?.open()
    } finally {
      setLoading('resume', false)
    }
  }

  const onClickCoverLetterGenerator = async () => {
    if (!isLoaded) return
    if (loadingStates.coverLetter) return // Prevent double click

    if (!isSignedIn) {
      return router.push('/dashboard')
    }

    setLoading('coverLetter', true)
    try {
      await checkUsageAndProceed('cover-letter-generator', 'Cover Letter Generator', async () => {
        const letterid = v7()
        await axios.post('/api/history', {
          recordId: letterid,
          content: ['Dummy'],
          aiAgentType: 'ai-cover-letter-generator'
        })
        router.push('/ai-tools/ai-cover-letter-generator/' + letterid)
      })
    } catch (error) {
      console.error('Error creating cover letter:', error)
      setLoading('coverLetter', false)
    }
  }

  const tools: {
    title: string
    description: string
    icon: React.ReactNode
    color: 'purple' | 'blue' | 'green' | 'orange'
    onClickLabel: string
    onClick?: () => void
    isLoading: boolean
  }[] = [
    {
      title: 'AI Career Q&A Chat',
      description: 'Ask career questions',
      icon: <MessageCircle className='w-8 h-8 text-white' />,
      color: 'purple',
      onClickLabel: 'Ask Now',
      onClick: onClickChatAgent,
      isLoading: loadingStates.chat
    },
    {
      title: 'AI Resume Analyzer',
      description: 'Improve your resume',
      icon: <FileText className='w-8 h-8 text-white' />,
      color: 'blue',
      onClickLabel: 'Analyze Now',
      onClick: onClickResumeAgent,
      isLoading: loadingStates.resume
    },
    {
      title: 'Career Roadmap Generator',
      description: 'Build your roadmap',
      icon: <Map className='w-8 h-8 text-white' />,
      color: 'green',
      onClickLabel: 'Generate Now',
      onClick: onClickRoadmapAgent,
      isLoading: loadingStates.roadmap
    },
    {
      title: 'Cover Letter Generator',
      description: 'Write a cover letter',
      icon: <PenTool className='w-8 h-8 text-white' />,
      color: 'orange',
      onClickLabel: 'Create Now',
      onClick: onClickCoverLetterGenerator,
      isLoading: loadingStates.coverLetter
    }
  ]

  return (
    <section className='py-20 bg-gray-900/50 mt-24'>
      <div className='container mx-auto '>
        <div className='text-center mb-16'>
          <h2 className='text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
            Available AI Tools
          </h2>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
            Start Building and Shape Your Career with these exclusive AI Tools
          </p>
        </div>
      </div>
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
            isLoading={tool.isLoading}
          />
        ))}
      </div>

      <ResumeDialogue ref={resumeModalRef} />
      <RoadmapDialogue ref={roadmapModalRef} />
      <LimitModal 
        open={limitModalOpen} 
        onOpenChange={setLimitModalOpen}
        featureName={limitFeatureName}
      />
    </section>
  )
}

export default AItoolSection

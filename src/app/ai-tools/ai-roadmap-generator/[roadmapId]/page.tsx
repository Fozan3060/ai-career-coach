'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import type { RoadmapRecord, RoadmapData } from '@/types/roadmap'
import { Loader2, RefreshCw, Sparkles, Clock, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RoadmapCanvas from '@/components/roadmap/RoadmapCanvas'
import {
  RoadmapDialogue,
  RoadmapDialogueRef
} from '@/components/roadmap/RoadmapDialogue'
import { useUser } from '@clerk/nextjs'
import { LimitModal } from '@/components/ui/limit-modal'

const AiRoadmapPage = () => {
  const { roadmapId } = useParams()
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limitModalOpen, setLimitModalOpen] = useState(false)
  const roadmapModalRef = useRef<RoadmapDialogueRef>(null)
  const { user } = useUser()

  const checkUsageAndOpenModal = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return

    try {
      const response = await axios.post<{ canUse: boolean }>('/api/check-usage', {
        userEmail: user.primaryEmailAddress.emailAddress,
        agentType: 'roadmap-generator'
      })
      
      console.log(`Create another roadmap check:`, response.data)
      
      if (response.data.canUse) {
        // User can create another roadmap
        roadmapModalRef.current?.open()
      } else {
        // Show limit modal
        setLimitModalOpen(true)
      }
    } catch (error) {
      console.error('Error checking usage:', error)
      // If error, allow usage as fallback
      roadmapModalRef.current?.open()
    }
  }

  const GetRoadmapRecord = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await axios.get<RoadmapRecord>('/api/history', {
        params: { recordId: id }
      })
      console.log('Fetched roadmap record:', result.data.content)
      if (result.data && result.data.content) {
        setRoadmap(result.data.content)
        console.log(result.data.content)
      } else {
        setError('No roadmap data found for this ID.')
      }
    } catch (err) {
      console.error('Error fetching roadmap record:', err)
      setError('Failed to load roadmap. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (roadmapId && typeof roadmapId === 'string') {
      GetRoadmapRecord(roadmapId)
    } else {
      setIsLoading(false)
      setError('Invalid roadmap ID provided.')
    }
  }, [roadmapId])

  if (isLoading) {
    return (
      <div className='min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 text-purple-500 animate-spin mx-auto mb-4' />
          <p className='text-slate-400 text-lg'>Loading career roadmap...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center'>
        <div className='text-center p-8 bg-red-900/20 border border-red-700/50 rounded-xl shadow-lg'>
          <p className='text-red-400 text-xl mb-4'>{error}</p>
          <Button
            onClick={() =>
              roadmapId &&
              typeof roadmapId === 'string' &&
              GetRoadmapRecord(roadmapId)
            }
            className='bg-red-600 hover:bg-red-700 text-white'
          >
            <RefreshCw className='w-4 h-4 mr-2' /> Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className='min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center'>
        <div className='text-center p-8 bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg'>
          <p className='text-gray-400 text-xl mb-4'>
            No roadmap data available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='min-h-[calc(100vh-4rem)] bg-slate-950 text-white p-6 md:p-8 lg:p-10'>
        {/* Background elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute top-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/3 rounded-full blur-3xl animate-pulse delay-500'></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto'>
          <div className='flex sm:flex-row flex-col gap-y-5 items-center justify-between mb-8'>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent'>
              Career Roadmap
            </h1>
            <Button
              variant='outline'
              className='bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300'
              onClick={checkUsageAndOpenModal}
            >
              <RefreshCw className='w-4 h-4 mr-2' /> Create Another Roadmap
            </Button>
          </div>

          <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
            {/* Left Column: Roadmap Details */}
            <div className='xl:col-span-1 space-y-6'>
              <Card className='bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/50 backdrop-blur-sm shadow-lg shadow-purple-900/20 animate-slide-in'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-3xl font-bold text-white flex items-center gap-3'>
                    <Sparkles className='w-7 h-7 text-purple-400 animate-pulse' />
                    {roadmap.roadmapTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-4 border-t border-purple-800/50'>
                  <p className='text-gray-300 leading-relaxed mb-4'>
                    {roadmap.description}
                  </p>
                  <div className='flex items-center gap-2 text-gray-400 text-sm'>
                    <Clock className='w-4 h-4 text-blue-400' />
                    <span>Duration: {roadmap.duration}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Additional info/CTA can go here */}
              <Card className='bg-gray-800/50  border-gray-700 backdrop-blur-sm shadow-lg shadow-gray-900/10'>
                <CardHeader className='pb-0 '>
                  <CardTitle className='text-xl font-semibold text-white flex items-center gap-2'>
                    <BookOpen className='w-5 h-5  text-emerald-400' /> How to
                    Use This Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-0 text-gray-300 text-sm space-y-2'>
                  <p>
                    Click on each node to learn more about the topic. Follow the
                    arrows to progress through your learning journey.
                  </p>
                  <p>
                    This roadmap is a personalized guide. Feel free to explore
                    topics at your own pace and dive deeper into areas of
                    interest.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Roadmap Visualization */}
            <div className='xl:col-span-2'>
              <RoadmapCanvas
                initialEdges={roadmap.initialEdges}
                //@ts-expect-error - Type mismatch expected for roadmap nodes
                initialNodes={roadmap.initialNodes}
              />
            </div>
          </div>
        </div>
      </div>
      <RoadmapDialogue ref={roadmapModalRef} />
      <LimitModal 
        open={limitModalOpen} 
        onOpenChange={setLimitModalOpen}
        featureName="Roadmap Generator"
      />
    </>
  )
}

export default AiRoadmapPage

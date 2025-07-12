'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import type { HistoryRecord, HistoryApiResponse } from '@/types/history'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  MessageCircle,
  FileText,
  Map,
  Calendar,
  ExternalLink
} from 'lucide-react'

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'ai-roadmap-generator':
        return <Map className='w-6 h-6 text-blue-400' />
      case 'ai-resume-analyzer':
        return <FileText className='w-6 h-6 text-green-400' />
      case 'ai-chat':
        return <MessageCircle className='w-6 h-6 text-purple-400' />
      default:
        return <FileText className='w-6 h-6 text-gray-400' />
    }
  }

  const getAgentTitle = (
    agentType: string,
    content: any,
    metaData?: string
  ) => {
    switch (agentType) {
      case 'ai-roadmap-generator':
        return (
          content?.roadmapTitle ||
          `${metaData} Learning Roadmap` ||
          'Career Roadmap Generator'
        )
      case 'ai-resume-analyzer':
        return 'AI Resume Analyzer'
      case 'ai-chat':
        return content?.title
      default:
        return 'AI Tool Session'
    }
  }

  const getAgentDescription = (agentType: string, content: any) => {
    switch (agentType) {
      case 'ai-roadmap-generator':
        return (
          content?.description.slice(0, 150) + ' ...' ||
          'Generated career learning roadmap'
        )
      case 'ai-resume-analyzer':
        return 'Resume analysis and feedback'
      case 'ai-chat':
        return `Chat session with ${content?.messages?.length || 0} messages`
      default:
        return 'AI tool session'
    }
  }

  const goToHistory = (record: HistoryRecord) => {
    let path = ''
    switch (record.aiAgentType) {
      case 'ai-roadmap-generator':
        path = `/ai-tools/ai-roadmap/${record.recordId}`
        break
      case 'ai-resume-analyzer':
        path = `/ai-tools/ai-resume/${record.recordId}`
        break
      case 'ai-chat':
        path = `/ai-tools/${record.recordId}`
        break
      default:
        path = `/ai-tools`
    }
        router.push(`/ai-tools/${record.aiAgentType}/${record.recordId}`)

  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const getHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await axios.get<HistoryApiResponse>('/api/history')
      console.log('History API Response:', result.data)

      if (result.data && Array.isArray(result.data)) {
        // Sort by creation date, newest first
        const sortedHistory = result.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setHistory(sortedHistory)
      } else {
        setHistory([])
      }
    } catch (error) {
      console.error('Error fetching history:', error)
      setError('Failed to load history. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getHistory()
  }, [])

  if (loading) {
    return (
      <div className='min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-12 h-12 text-purple-500 animate-spin mx-auto mb-4' />
          <p className='text-slate-400 text-lg'>Loading your history...</p>
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
            onClick={getHistory}
            className='bg-red-600 hover:bg-red-700 text-white'
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-slate-950 text-white p-4 sm:p-6 md:p-8 lg:p-10'>
      {/* Background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000'></div>
      </div>

      <div className='relative z-10 max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2'>
            Previous History
          </h1>
          <p className='text-slate-400 text-base sm:text-lg'>
            What you previously worked on, you can find here
          </p>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className='text-center py-16'>
            <div className='w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Calendar className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-xl font-semibold text-gray-300 mb-2'>
              No History Yet
            </h3>
            <p className='text-gray-500 mb-6'>
              Start using our AI tools to see your history here.
            </p>
            <Button
              onClick={() => router.push('/ai-tools')}
              className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            >
              Explore AI Tools
            </Button>
          </div>
        ) : (
          <div className='space-y-4'>
            {history.map(record => (
              <Card
                key={record.id}
                className='bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group'
                onClick={() => goToHistory(record)}
              >
                <CardHeader className='pb-3'>
                  <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
                    {/* Main content area */}
                    <div className='flex items-start gap-3 sm:gap-4 flex-1 min-w-0'>
                      <div className='p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-600/50 transition-colors duration-300 flex-shrink-0'>
                        {getAgentIcon(record.aiAgentType)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <CardTitle className='text-lg sm:text-xl font-semibold text-white group-hover:text-purple-200 transition-colors duration-300 break-words'>
                          {getAgentTitle(
                            record.aiAgentType,
                            record.content,
                            record.metaData
                          )}
                        </CardTitle>
                        <CardDescription className='text-gray-400 mt-1 text-sm sm:text-base break-words'>
                          {getAgentDescription(
                            record.aiAgentType,
                            record.content
                          )}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Date area */}
                    <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0 self-start'>
                      <Calendar className='w-3 h-3 sm:w-4 sm:h-4' />
                      <span className='whitespace-nowrap'>
                        {formatDate(record.createdAt)}
                      </span>
                      <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage

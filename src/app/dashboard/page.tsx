'use client'
import { HeroSection } from '@/components/complex/Herosection'
import { AIToolCard } from '@/components/compound/AIToolsCard'
import { FileText, Map, MessageCircle, PenTool } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AICareerCoachLanding () {
  const router = useRouter()
  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <HeroSection />

      <section className='py-20 bg-gray-900/50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Available AI Tools
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
              Start Building and Shape Your Career with these exclusive AI Tools
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto'>
            <AIToolCard
              title='AI Career Q&A Chat'
              description='Ask career questions'
              icon={<MessageCircle className='w-8 h-8 text-white' />}
              color='purple'
              onClickLabel='Ask Now'
              onClick={() => router.push('/ai-tools/ai-chat')}
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
        </div>
      </section>
    </div>
  )
}

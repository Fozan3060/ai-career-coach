'use client'

import { PricingTable } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Sparkles, Zap, Crown, Shield } from 'lucide-react'

const BillingPage = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for pricing table
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/3 rounded-full blur-3xl animate-pulse delay-500'></div>
      </div>

      <div className='relative z-10 container mx-auto px-4 py-12'>
        {/* Header Section */}
        <div className='text-center mb-16'>
          {/* Badge */}
          <div className='inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6'>
            <Crown className='w-4 h-4 text-purple-400' />
            <span className='text-sm text-purple-300 font-medium'>
              Pricing Plans
            </span>
          </div>

          {/* Main Title */}
          <h1 className='text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent'>
            Choose Your Plan
          </h1>

          {/* Subtitle */}
          <p className='text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed'>
            Unlock the full potential of AI-powered career guidance. Select the
            plan that best fits your professional journey.
          </p>

          {/* Features Highlight */}
          <div className='flex flex-wrap justify-center gap-6 mb-12 text-sm text-slate-400'>
            <div className='flex items-center gap-2'>
              <Sparkles className='w-4 h-4 text-purple-400' />
              <span>AI-Powered Insights</span>
            </div>
            <div className='flex items-center gap-2'>
              <Zap className='w-4 h-4 text-blue-400' />
              <span>Instant Analysis</span>
            </div>
            <div className='flex items-center gap-2'>
              <Shield className='w-4 h-4 text-green-400' />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>

        {/* Pricing Table Container */}
        <div className='max-w-6xl mx-auto pricing_table'>
          {isLoading ? (
            <PricingTableSkeleton />
          ) : (
            <div className='pricing-table-container'>
              <PricingTable
                appearance={{
                  elements: {
                   pricingTableCardHeader:"bg-gradient-to-r from-slate-800 to-slate-700",
                   pricingTableCardBody:"bg-gradient-to-b from-slate-800 to-slate-900",           
                   pricingTableCardFooter:"bg-gradient-to-r from-slate-700 to-slate-800"    ,
                   pricingTableCardFooterNotice:"bg-gradient-to-r from-slate-700 to-slate-800"   ,
                
                  },
                  variables: {
                    colorPrimary: '#8b5cf6', // Purple
                    colorBackground: 'transparent',
                    colorText: '#f8fafc', // Lighter text
                    colorTextSecondary: '#e2e8f0',
                    colorSuccess: '#10b981', // Green
                    colorDanger: '#ef4444', // Red
                    colorWarning: '#f59e0b', // Orange
                    borderRadius: '12px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                  },
                 
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom CTA Section */}
        <div className='text-center mt-16'>
          <div className='bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 max-w-2xl mx-auto'>
            <h3 className='text-2xl font-bold text-white mb-4'>
              Need Help Choosing?
            </h3>
            <p className='text-slate-300 mb-6'>
              Our AI Career Coach can help you determine which plan is right for
              your career goals.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105'>
                Get Personalized Recommendation
              </button>
              <button className='px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-all duration-300'>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PricingTableSkeleton = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
      {[1, 2, 3].map(index => (
        <div
          key={index}
          className='bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm animate-pulse'
        >
          <div className='text-center mb-6'>
            <div className='h-6 bg-slate-700 rounded-lg mb-3 w-24 mx-auto'></div>
            <div className='h-4 bg-slate-700 rounded w-32 mx-auto mb-4'></div>
            <div className='h-12 bg-slate-700 rounded-lg w-20 mx-auto'></div>
          </div>

          <div className='space-y-3 mb-8'>
            {[1, 2, 3, 4, 5].map(feature => (
              <div key={feature} className='flex items-center gap-3'>
                <div className='w-5 h-5 bg-slate-700 rounded-full'></div>
                <div className='h-4 bg-slate-700 rounded flex-1'></div>
              </div>
            ))}
          </div>
          <div className='h-12 bg-gradient-to-r from-purple-600/50 to-blue-600/50 rounded-lg animate-pulse'></div>
        </div>
      ))}
    </div>
  )
}

export default BillingPage

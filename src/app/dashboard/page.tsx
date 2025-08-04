"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Target, Zap, Rocket } from "lucide-react"
import AItoolSection from "@/components/complex/AItoolSection"
import LandingHeader from "@/components/complex/LandingHeader"
import { StatsSection } from "@/components/marketing/StatsSection"


export default function AICareerCoachLanding() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-gray-900"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8 animate-slide-in">
            <Rocket className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Join Our AI Career Community</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent animate-slide-in delay-100">
            Land Your Dream Job with the{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Career Coach
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-in delay-200">
            Personalized job search, resume tips, mock interviews, and AI guidance for every career level.
          </p>

          {/* CTA Button */}
          <Link href="/ai-tools">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 animate-slide-in delay-300"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Coaching
            </Button>
          </Link>

          {/* Stats or features */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-gray-400 animate-slide-in delay-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>10,000+ Career Paths Analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>95% Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI-Powered Insights</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <StatsSection />
        </div>
      </section>
    </div>
  )
}

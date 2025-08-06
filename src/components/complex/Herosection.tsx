import { Button } from "@/components/ui/button"
import { Sparkles, Zap, TrendingUp, Target } from "lucide-react"
import { StatsSection } from "../marketing/StatsSection";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden h-screen py-24 overflow-scroll">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-gray-900"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">Powered by Advanced AI</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
          AI Career Coach Agent
        </h1>
        <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Smarter career decisions start here — get tailored advice, real-time market insights, and a roadmap built just for you with the power of AI.
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <Zap className="w-5 h-5 mr-2" />
          Let's Get Started
        </Button>

        <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-gray-400">
          <Feature icon={<TrendingUp className="w-4 h-4 text-green-400" />} text="10,000+ Career Paths Analyzed" />
          <Feature icon={<Target className="w-4 h-4 text-blue-400" />} text="95% Success Rate" />
          <Feature icon={<Sparkles className="w-4 h-4 text-purple-400" />} text="AI-Powered Insights" />
        </div>
      </div>
      <StatsSection/>
    </section>
  )
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex items-center gap-2">{icon}<span>{text}</span></div>
}

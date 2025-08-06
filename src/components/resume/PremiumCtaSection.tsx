import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function PremiumCtaSection() {
  return (
    <div className="bg-gradient-to-r from-blue-700/50 to-purple-700/50 border border-blue-600/50 rounded-2xl p-8 text-center shadow-xl shadow-blue-900/20 mt-12">
      <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
        Ready to refine your resume? <Sparkles className="w-7 h-7 text-yellow-300 animate-pulse" />
      </h3>
      <p className="text-blue-200 mb-6 text-lg">
        Make your application stand out with our premium insights and features.
      </p>
      <Button
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
      >
        Upgrade to Premium
      </Button>
    </div>
  )
}

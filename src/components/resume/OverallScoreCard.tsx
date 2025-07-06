import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface OverallScoreCardProps {
  score: number
  overallFeedback: string
  summaryComment: string
}

export function OverallScoreCard({ score, overallFeedback, summaryComment }: OverallScoreCardProps) {
  const scoreColor = score >= 80 ? "text-green-400" : score >= 60 ? "text-orange-400" : "text-red-400"

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/50 backdrop-blur-sm shadow-lg shadow-purple-900/20 animate-slide-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" /> Overall Score
          </CardTitle>
          <div className={`text-5xl font-extrabold ${scoreColor}`}>
            {score}
            <span className="text-3xl text-gray-400">/100</span>
          </div>
        </div>
        <CardDescription className="text-gray-300 text-lg mt-2">
          {overallFeedback}
          <span className={`ml-2 font-semibold ${score >= 80 ? "text-green-300" : "text-orange-300"}`}>
            {score >= 80 ? "Excellent!" : score >= 60 ? "Good!" : "Needs Work!"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 border-t border-purple-800/50">
        <p className="text-gray-400 leading-relaxed">{summaryComment}</p>
      </CardContent>
    </Card>
  )
}

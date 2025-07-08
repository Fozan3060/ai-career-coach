import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Lightbulb } from "lucide-react"

interface SectionAnalysisCardProps {
  title: string
  score: number
  comment: string
  tipsForImprovement: string[]
  whatsGood: string[]
  needsImprovement: string[]
}

export function SectionAnalysisCard({
  title,
  score,
  comment,
  tipsForImprovement,
  whatsGood,
  needsImprovement,
}: SectionAnalysisCardProps) {
  const scoreColor = score >= 80 ? "text-green-400" : score >= 60 ? "text-orange-400" : "text-red-400"
  const cardBorderColor =
    score >= 80 ? "border-green-700/50" : score >= 60 ? "border-orange-700/50" : "border-red-700/50"
  const cardBgColor =
    score >= 80
      ? "from-green-900/20 to-green-900/10"
      : score >= 60
        ? "from-orange-900/20 to-orange-900/10"
        : "from-red-900/20 to-red-900/10"

  return (
    <Card
      className={`bg-gradient-to-br ${cardBgColor} border ${cardBorderColor} backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
          <div className={`text-3xl font-bold ${scoreColor}`}>{score}%</div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 text-gray-300">
        <p className="mb-4 leading-relaxed">{comment}</p>

        {tipsForImprovement.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" /> Tips for Improvement
            </h4>
            <ul className="list-none space-y-2 text-sm">
              {tipsForImprovement.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">●</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {whatsGood.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> What's Good
            </h4>
            <ul className="list-none space-y-2 text-sm">
              {whatsGood.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {needsImprovement.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-red-300 mb-2 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Needs Improvement
            </h4>
            <ul className="list-none space-y-2 text-sm">
              {needsImprovement.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

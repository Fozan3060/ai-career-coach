import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

interface WhatsGoodNeedsImprovementSectionProps {
  whatsGood: string[]
  needsImprovement: string[]
}

export function WhatsGoodNeedsImprovementSection({
  whatsGood,
  needsImprovement,
}: WhatsGoodNeedsImprovementSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {whatsGood.length > 0 && (
        <Card className="bg-gradient-to-br from-green-900/20 to-green-900/10 border border-green-700/50 backdrop-blur-sm shadow-lg shadow-green-900/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" /> What's Good
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 text-gray-300">
            <ul className="list-none space-y-3 text-base">
              {whatsGood.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {needsImprovement.length > 0 && (
        <Card className="bg-gradient-to-br from-red-900/20 to-red-900/10 border border-red-700/50 backdrop-blur-sm shadow-lg shadow-red-900/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" /> Needs Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 text-gray-300">
            <ul className="list-none space-y-3 text-base">
              {needsImprovement.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

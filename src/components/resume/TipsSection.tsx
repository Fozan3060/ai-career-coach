import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

interface TipsSectionProps {
  tips: string[]
}

export function TipsSection({ tips }: TipsSectionProps) {
  if (tips.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/50 backdrop-blur-sm shadow-lg shadow-purple-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-400" /> General Tips for Improvement
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 text-gray-300">
        <ul className="list-none space-y-3 text-base">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0 mt-2"></span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

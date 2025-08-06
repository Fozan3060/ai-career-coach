"use client"

import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface SuggestionCardProps {
  suggestion: string
  onClick: (suggestion: string) => void
}

export function SuggestionCard({ suggestion, onClick }: SuggestionCardProps) {
  return (
    <Card
      className="p-4 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(suggestion)}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <p className="text-slate-200 group-hover:text-white transition-colors duration-300 text-sm md:text-base">
          {suggestion}
        </p>
      </div>
    </Card>
  )
}

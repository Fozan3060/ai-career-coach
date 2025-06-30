"use client"

import { Bot } from "lucide-react"
import { SuggestionCard } from "./SuggestionCard"


interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  "What skills do I need for a data analyst role?",
  "How do I switch careers to UX design?",
  "What are the highest paying tech jobs in 2024?",
  "How do I negotiate a better salary?",
]

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ask anything to AI career Agent</h2>
        <p className="text-slate-400 text-base md:text-lg">Get personalized career advice powered by AI</p>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard key={index} suggestion={suggestion} onClick={onSuggestionClick} />
        ))}
      </div>
    </div>
  )
}

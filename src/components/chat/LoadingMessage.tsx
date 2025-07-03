"use client"

import { Bot } from "lucide-react"

export function LoadingMessage() {
  return (
    <div className="flex gap-3 md:gap-4 justify-start">
      <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
      </div>
      <div className="bg-slate-800/70 border border-slate-700 rounded-2xl px-3 py-2 md:px-4 md:py-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )
}

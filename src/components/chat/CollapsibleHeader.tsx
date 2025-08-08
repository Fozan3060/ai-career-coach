"use client"

import { Button } from "@/components/ui/button"
import { Plus, ChevronUp } from "lucide-react"

interface CollapsibleHeaderProps {
  isCollapsed: boolean
  onToggle: () => void
  onNewChat: () => void
}

export function CollapsibleHeader({ isCollapsed, onToggle, onNewChat }: CollapsibleHeaderProps) {
  return (
    <div className="border-b z-10 sticky top-16 border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      {/* Always visible top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">AI Career Q/A Chat</h1>

          {/* Collapse/Expand Button */}
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300 hover:scale-110 group cursor-pointer"
            aria-label={isCollapsed ? "Expand header" : "Collapse header"}
          >
            <div className={`transition-transform duration-500 ease-in-out ${isCollapsed ? "rotate-180" : "rotate-0"}`}>
              <ChevronUp className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors duration-300" />
            </div>
          </button>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={onNewChat}
          className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-32 opacity-100"
        }`}
      >
        <div className="px-4 sm:px-6 pb-3">
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Smarter career decisions start here — get tailored advice, real-time market insights
          </p>
        </div>
      </div>
    </div>
  )
}

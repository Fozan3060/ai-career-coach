"use client"

import { Bot, User } from "lucide-react"
import { useState, useEffect } from "react"
import type { Message } from "@/types/chat"

interface ChatMessageProps {
  message: Message
  isLatest?: boolean
  onContentUpdate?: () => void // Callback to trigger scroll
}

export function ChatMessage({ message, isLatest = false, onContentUpdate }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Only apply typewriter effect to AI messages that are the latest
    if (message.role === "assistant" && isLatest) {
      setIsTyping(true)
      setDisplayedContent("")

      const content = message.content
      let currentIndex = 0

      const typeWriter = () => {
        if (currentIndex < content.length) {
          // Add character by character with some randomness for natural feel
          const charsToAdd = Math.random() > 0.7 ? 2 : 1 // Sometimes add 2 chars for speed variation
          const nextChars = content.slice(currentIndex, currentIndex + charsToAdd)

          setDisplayedContent((prev) => {
            const newContent = prev + nextChars
            // Trigger scroll update after state update
            setTimeout(() => {
              onContentUpdate?.()
            }, 0)
            return newContent
          })

          currentIndex += charsToAdd

          // Variable speed: faster for spaces, slower for punctuation
          const char = content[currentIndex - 1]
          let delay = 15 // Base delay

          if (char === " ")
            delay = 5 // Faster for spaces
          else if ([".", "!", "?", "\n"].includes(char))
            delay = 50 // Slower for punctuation
          else if ([",", ";", ":"].includes(char)) delay = 30 // Medium for commas

          setTimeout(typeWriter, delay)
        } else {
          setIsTyping(false)
          // Final scroll update when typing is complete
          setTimeout(() => {
            onContentUpdate?.()
          }, 0)
        }
      }

      // Start typing after a brief delay
      const startDelay = setTimeout(typeWriter, 100)

      return () => {
        clearTimeout(startDelay)
        setDisplayedContent(content)
        setIsTyping(false)
      }
    } else {
      // For user messages or non-latest AI messages, show immediately
      setDisplayedContent(message.content)
      setIsTyping(false)
    }
  }, [message.content, message.role, isLatest, onContentUpdate])

  return (
    <div className={`flex gap-3 md:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "assistant" && (
        <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
        </div>
      )}

      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
          message.role === "user"
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            : "bg-slate-800/70 text-slate-100 border border-slate-700"
        }`}
      >
        <div className="whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base">
          {displayedContent}
          {/* Blinking cursor effect while typing */}
          {isTyping && <span className="inline-block w-0.5 h-4 bg-purple-400 ml-1 animate-pulse"></span>}
        </div>

        {/* Only show timestamp when typing is complete or for user messages */}
        <div className={`transition-opacity duration-300 ${isTyping ? "opacity-0" : "opacity-100"}`}>
          <span className="text-xs opacity-70 mt-2 block">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {message.role === "user" && (
        <div className="w-7 h-7 md:w-8 md:h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-3 h-3 md:w-4 md:h-4 text-slate-300" />
        </div>
      )}
    </div>
  )
}

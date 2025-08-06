"use client"

import { useRef, useEffect, useCallback } from "react"
import { LoadingMessage } from "./LoadingMessage"
import type { Message } from "@/types/chat"
import { ChatMessage } from "./ChatMessages"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
  }, [])

  // Scroll when new messages are added
  useEffect(() => {
    scrollToBottom()
  }, [messages.length, scrollToBottom])

  // Handle content updates during typing (for real-time scroll)
  const handleContentUpdate = useCallback(() => {
    // Use requestAnimationFrame for smooth scrolling during typing
    requestAnimationFrame(() => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

        // Only auto-scroll if user is near the bottom (not if they scrolled up to read)
        if (isNearBottom) {
          containerRef.current.scrollTo({
            top: scrollHeight,
            behavior: "smooth",
          })
        }
      }
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 max-h-full chat-messages-container"
    >
      {messages.map((message, index) => {
        // Check if this is the latest AI message
        const isLatestAIMessage = message.role === "assistant" && index === messages.length - 1 && !isLoading

        return (
          <ChatMessage
            key={message.id}
            message={message}
            isLatest={isLatestAIMessage}
            onContentUpdate={handleContentUpdate}
          />
        )
      })}

      {isLoading && <LoadingMessage />}

      <div ref={messagesEndRef} />
    </div>
  )
}

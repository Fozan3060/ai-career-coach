"use client"

import { useRef } from "react"
import { LoadingMessage } from "./LoadingMessage"
import type { Message } from "@/types/chat"
import { ChatMessage } from "./ChatMessages"

interface ChatMessageContainerProps {
  messages: Message[]
  isLoading: boolean
  isLoadingFromHistory?: boolean // New prop to distinguish historical vs real-time messages
}

export function ChatMessageContainer({ messages, isLoading, isLoadingFromHistory = false }: ChatMessageContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 max-h-full chat-messages-container pb-8"
    >
      {messages.map((message, index) => {
        // Check if this is the latest AI message AND we're not loading from history
        const isLatestAIMessage = message.role === "assistant" && 
                                  index === messages.length - 1 && 
                                  !isLoading && 
                                  !isLoadingFromHistory

        return (
          <ChatMessage
            key={message.id}
            message={message}
            isLatest={isLatestAIMessage}
          />
        )
      })}

      {isLoading && <LoadingMessage />}

      <div ref={messagesEndRef} />
    </div>
  )
}

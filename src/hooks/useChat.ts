"use client"

import { useState } from "react"
import axios from "axios"
import type { Chat, Message } from "@/types/chat"

interface AiApiResponse {
        output?: {
          output?: { content?: string }[]
        }
      }

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    }

    let targetChatId = currentChatId

    // If no current chat, create one
    if (!currentChatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
        messages: [userMessage],
        createdAt: new Date(),
      }
      setChats((prev) => [newChat, ...prev])
      setCurrentChatId(newChat.id)
      targetChatId = newChat.id
    } else {
      // Add to existing chat
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                title:
                  chat.messages.length === 0 ? content.slice(0, 50) + (content.length > 50 ? "..." : "") : chat.title,
              }
            : chat,
        ),
      )
    }

    setIsLoading(true)
    setError(null)

    try {
      // Make API call with actual user input
      const result = await axios.post<AiApiResponse>("/api/ai-career-chat", {
        userInput: content.trim(),
      })

      console.log("AI Response:", result.data)

      // Extract the AI response from the nested structure
      const aiResponseContent = result.data?.output?.output?.[0]?.content || "Sorry, I couldn't generate a response."

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        role: "assistant",
        timestamp: new Date(),
      }

      // Add AI response to the chat
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === targetChatId || chat.id === prev[0]?.id
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
              }
            : chat,
        ),
      )
    } catch (error) {
      console.error("Error calling AI API:", error)
      setError("Failed to get AI response. Please try again.")

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === targetChatId || chat.id === prev[0]?.id
            ? {
                ...chat,
                messages: [...chat.messages, errorMessage],
              }
            : chat,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    chats,
    currentChat,
    isLoading,
    error,
    createNewChat,
    sendMessage,
    clearError,
  }
}

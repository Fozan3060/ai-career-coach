"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Plus, Bot, User, Sparkles } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const AIChat = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

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

    setInput("")
    setIsLoading(true)

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        role: "assistant",
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId || chat.id === prev[0]?.id
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
              }
            : chat,
        ),
      )
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    // Simple response generator (replace with actual AI API)
    const responses = [
      "Great question! For a data analyst role, you'll need strong skills in SQL, Python or R, data visualization tools like Tableau or Power BI, and statistical analysis. I'd also recommend learning Excel advanced functions and understanding business intelligence concepts.",
      "Switching to UX design is definitely possible! Start by building a portfolio with personal projects, learn design tools like Figma or Sketch, understand user research methods, and consider taking online courses. Many successful UX designers come from different backgrounds.",
      "That's an excellent career question! Let me provide you with some tailored advice based on current market trends and industry insights...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const suggestions = [
    "What skills do I need for a data analyst role?",
    "How do I switch careers to UX design?",
    "What are the highest paying tech jobs in 2024?",
    "How do I negotiate a better salary?",
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">AI Career Q/A Chat</h1>
          <p className="text-slate-400">
            Smarter career decisions start here — get tailored advice, real-time market insights
          </p>
        </div>
        <Button
          onClick={createNewChat}
          className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        {!currentChat || currentChat.messages.length === 0 ? (
          // Welcome Screen
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Ask anything to AI career Agent</h2>
              <p className="text-slate-400 text-lg">Get personalized career advice powered by AI</p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
              {suggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className="p-4 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-slate-200 group-hover:text-white transition-colors duration-300">{suggestion}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Messages
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-slate-800/70 text-slate-100 border border-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800/70 border border-slate-700 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here"
              className="w-full bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 pr-12 h-12 rounded-xl"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AIChat

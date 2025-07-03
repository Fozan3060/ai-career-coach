import { Chat, Message } from '@/types/chat'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'

type GetChatHistoryResponse = {
  id: number
  recordId: string
  content: Chat
  userEmail?: string
  createdAt?: string | null
}
interface AiApiResponse {
  output?: {
    output?: { content?: string }[]
  }
}
export function useChat () {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { chatid } = useParams() as { chatid?: string }
  const currentChat = chats.find(chat => chat.id === currentChatId) || null

  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentChatId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title:
                chat.messages.length === 0
                  ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
                  : chat.title
            }
          : chat
      )
    )

    setIsLoading(true)
    setError(null)

    try {
      const result = await axios.post<AiApiResponse>('/api/ai-career-chat', {
        userInput: content.trim()
      })
      const aiResponseContent =
        result.data?.output?.output?.[0]?.content ||
        "Sorry, I couldn't generate a response."

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        role: 'assistant',
        timestamp: new Date()
      }

      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      )
    } catch (err) {
      setError('AI service failed.')

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      }

      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const updateMessageList = async () => {
    if (!currentChat || !currentChatId) return
    await axios.put('/api/history', {
      content: currentChat,
      recordId: currentChatId
    })
  }

  const getMessageList = async () => {
    if (!chatid) return

    try {
      const result = await axios.get<GetChatHistoryResponse>('/api/history', {
        params: { recordId: chatid }
      })

      const record = result.data

      if (record?.content) {
        const chatFromDb: Chat = {
          id: record.content.id,
          title: record.content.title,
          messages: record.content.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          createdAt: new Date(record.content.createdAt)
        }

        setChats([chatFromDb])
        setCurrentChatId(chatFromDb.id)
      }
    } catch (err) {
      console.error('Failed to fetch chat:', err)
    }
  }

  const clearError = () => setError(null)

  return {
    chats,
    currentChat,
    isLoading,
    error,
    createNewChat: () => {},
    sendMessage,
    clearError,
    updateMessageList,
    getMessageList
  }
}

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
  const [isLoadingAllChats, setisLoadingAllChats] = useState(true)
  const { chatid } = useParams() as { chatid: string }
  const currentChat = chats.find(chat => chat.id === currentChatId) || null

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    }

    let targetChatId = currentChatId

    if (!currentChatId) {
      setisLoadingAllChats(false)
      const newChatId = chatid
      const newChat: Chat = {
        id: newChatId,
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        messages: [userMessage],
        createdAt: new Date()
      }
      setChats(prev => [newChat, ...prev])
      setCurrentChatId(newChat.id)
      targetChatId = newChat.id

      if (!chatid) {
        window.history.pushState({}, '', `/ai-tools/${newChatId}`)
      }
    } else {
      // Add to existing chat
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
    }

    setIsLoading(true)
    setError(null)

    try {
      // Make API call with actual user input
      const result = await axios.post<AiApiResponse>('/api/ai-career-chat', {
        userInput: content.trim()
      })

      console.log('AI Response:', result.data)

      // Extract the AI response from the nested structure
      const aiResponseContent =
        result.data?.output?.output?.[0]?.content ||
        "Sorry, I couldn't generate a response."

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        role: 'assistant',
        timestamp: new Date()
      }

      // Add AI response to the chat
      let updatedChat: Chat | undefined

      setChats(prev => {
        const newChats = prev.map(chat => {
          if (chat.id === targetChatId || chat.id === prev[0]?.id) {
            updatedChat = {
              ...chat,
              messages: [...chat.messages, aiMessage]
            }
            return updatedChat
          }
          return chat
        })
        return newChats
      })
      setisLoadingAllChats(false)

      // Save to database after updating state
    } catch (error) {
      console.error('Error calling AI API:', error)
      setError('Failed to get AI response. Please try again.')

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date()
      }

      let updatedChat: Chat | undefined

      setChats(prev => {
        const newChats = prev.map(chat => {
          if (chat.id === targetChatId || chat.id === prev[0]?.id) {
            updatedChat = {
              ...chat,
              messages: [...chat.messages, errorMessage]
            }
            return updatedChat
          }
          return chat
        })
        return newChats
      })
    } finally {
      setIsLoading(false)
      setisLoadingAllChats(false)
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
          messages: record.content.messages?.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          createdAt: new Date(record.content.createdAt)
        }

        setChats([chatFromDb])
        setCurrentChatId(chatFromDb.id)
        setisLoadingAllChats(false)
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
    getMessageList,
    isLoadingAllChats
  }
}

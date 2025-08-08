'use client'
import { useEffect, useState } from 'react'
import { CollapsibleHeader } from '@/components/chat/CollapsibleHeader'
import { ErrorBanner } from '@/components/chat/ErrorBanner'
import { WelcomeScreen } from '@/components/chat/WelcomeScreen'
import { ChatInput } from '@/components/chat/ChatInput'
import { useChat } from '@/hooks/useChat'
import { ChatMessageContainer } from '@/components/chat/ChatMessage'
import { useParams } from 'next/navigation'
import { ChatPageSkeleton } from '@/components/chat/ChatPageSkeleton'

const AIChat = () => {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  
  const {
    currentChat,
    isLoading,
    error,
    createNewChat,
    sendMessage,
    clearError,
    updateMessageList,
    getMessageList,
    isLoadingAllChats
  } = useChat()
  const { chatid } = useParams()
  
  const toggleHeader = () => {
    setIsHeaderCollapsed(!isHeaderCollapsed)
  }
  
  console.log(currentChat)
  
  const handleSendMessage = async (content: string) => {
    await sendMessage(content)
  }

  useEffect(() => {
    if (currentChat) {
      updateMessageList()
      console.log(currentChat.id, 'current chat id ')
      console.log('running useffect')
    }
  }, [currentChat, updateMessageList])

  useEffect(() => {
    if (chatid) {
      setIsLoadingHistory(true)
      getMessageList().finally(() => {
        // Add a small delay to ensure typewriter doesn't trigger during initial load
        setTimeout(() => {
          setIsLoadingHistory(false)
        }, 500)
      })
    }
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  if (isLoadingAllChats) {
    return <ChatPageSkeleton />
  }
  
  return (
    <div className='flex flex-col bg-slate-950 min-h-[calc(100vh-4rem)]'>
      {/* Collapsible Header */}
      <CollapsibleHeader
        isCollapsed={isHeaderCollapsed}
        onToggle={toggleHeader}
        onNewChat={createNewChat}
      />

      {/* Error Banner */}
      <ErrorBanner error={error} onDismiss={clearError} />

      {/* Chat Area */}
      <div className='flex-1 flex flex-col overflow-hidden min-h-0'>
        {!currentChat || currentChat.messages === undefined ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <ChatMessageContainer 
            messages={currentChat.messages} 
            isLoading={isLoading} 
            isLoadingFromHistory={isLoadingHistory}
          />
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}

export default AIChat

'use client'
import { useEffect, useState } from 'react'
import { CollapsibleHeader } from '@/components/chat/CollapsibleHeader'
import { ErrorBanner } from '@/components/chat/ErrorBanner'
import { WelcomeScreen } from '@/components/chat/WelcomeScreen'
import { ChatInput } from '@/components/chat/ChatInput'
import { useChat } from '@/hooks/useChat'
import { ChatMessages } from '@/components/chat/ChatMessage'
import { useParams } from 'next/navigation'
const AIChat = () => {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const {
    currentChat,
    isLoading,
    error,
    createNewChat,
    sendMessage,
    clearError,
    updateMessageList,
    getMessageList,
   } = useChat()
  const { chatid } = useParams()
  const toggleHeader = () => {
    setIsHeaderCollapsed(!isHeaderCollapsed)
  }

  const handleSendMessage = async (content: string) => {
    await sendMessage(content)
  }

  useEffect(() => {
    if (currentChat) {
      updateMessageList()
      console.log(currentChat.id, 'current chat id ')
      console.log('running useffect')
    }
  }, [currentChat])

  useEffect(() => {
    chatid && getMessageList()
  }, [chatid])

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  console.log(chatid)
  return (
    <div className='flex flex-col h-[calc(100vh-4rem)] bg-slate-950'>
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
        {!currentChat || currentChat.messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <ChatMessages messages={currentChat.messages} isLoading={isLoading} />
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}

export default AIChat

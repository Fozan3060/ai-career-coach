'use client'
import { useState } from 'react'
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
    clearError
  } = useChat()
  console.log(currentChat)
  const toggleHeader = () => {
    setIsHeaderCollapsed(!isHeaderCollapsed)
  }

  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const updateMessageList = async () => {
    const result = await axios.put('/api/history', {
        content: "Messages",
        recordId: chatid
    });
    console.log(result);
}

  const {chatid} = useParams()
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

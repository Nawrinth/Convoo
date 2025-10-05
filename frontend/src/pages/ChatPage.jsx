import ChatContainer from '@/components/ChatContainer'
import ProfileModal from '@/components/modals/ProfileModal'
import NavBar from '@/components/NavBar'
import NoChatSelected from '@/components/NoChatSelected'
import Sidebar from '@/components/Sidebar'
import { useChatStore } from '@/store/useChatStore'
import React from 'react'

const ChatPage = () => {
  const { selectedUser } = useChatStore()

  return (
    <div className="h-full w-full flex">
      {/* Sidebar */}
      <div
        className={`h-full border-r 
          ${selectedUser ? "hidden md:flex" : "flex"} 
          w-full md:w-100`}
      >
        <Sidebar />
      </div>

      {/* Chat area */}
      <div
        className={`h-full flex-1 
          ${selectedUser ? "flex" : "hidden md:flex"}`}
      >
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  )
}

export default ChatPage

import ChatContainer from '@/components/ChatContainer'
import ProfileModal from '@/components/modals/ProfileModal'
import NavBar from '@/components/NavBar'
import NoChatSelected from '@/components/NoChatSelected'
import Sidebar from '@/components/Sidebar'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'
import React from 'react'

const ChatPage = () => {
  const { selectedUser } = useChatStore()
  const {showProfileModal , setShowProfileModal} = useAuthStore();

  return (
    <div className="h-full w-full z-0 flex">
      {showProfileModal && <ProfileModal setIsOpenProfile={setShowProfileModal} />}
      <div className="flex h-full w-full">
        {/* Sidebar takes fixed width */}
        <Sidebar/>
        {selectedUser?<ChatContainer/>:<NoChatSelected/>}
        
      </div>
    </div>
  )
}

export default ChatPage

import { useChatStore } from '@/store/useChatStore';
import { Leaf } from 'lucide-react'
import React, { use, useEffect } from 'react'
import HeaderChat from './HeaderChat';
import MessageSkeleton from './skeleton/MessageSkeleton';
import MessageInput from './MessageInput';

const ChatContainer = () => {
  const {selectedUser , messages , isMessagesLoading , getMessages} = useChatStore();

  
  useEffect(()=>{
    getMessages(selectedUser._id);
  },[selectedUser._id , getMessages])
  
  useEffect(() => {
    console.log("Messages updated:", messages);},[messages]);
    
    if (isMessagesLoading) {
  return (
      <div className={`overflow-hidden flex h-full md:max-w-[calc(100vw-350px)] flex-col w-full  text-gray-500 ${selectedUser?"":"hidden"} `}>

    {/* Header */}
    <HeaderChat />

    {/* Empty message area */}
      <div className="flex-1 overflow-y-auto p-4 sapce-y-4">
        {/* Messages will go here later */}
        <MessageSkeleton/>

      </div>

    {/* Input at bottom */}
    <div className="p-3 px-6">
      <MessageInput />
    </div>
  </div>

  )
}
  return (
  <div className="overflow-hidden flex h-full md:max-w-[calc(100vw-350px)] flex-col w-full  text-gray-500">

    {/* Header */}
    <HeaderChat />

    {/* Empty message area */}
      <div className="flex-1 overflow-y-auto p-4 sapce-y-4">
        {/* Messages will go here later */}

      </div>

    {/* Input at bottom */}
    <div className="p-3 px-6">
      <MessageInput />
    </div>
  </div>
)};


export default ChatContainer
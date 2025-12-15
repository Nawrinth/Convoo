import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatStore } from '@/store/useChatStore';
import avatarImg from '../assets/avatar.jpg';
import { ChevronLeft, X } from 'lucide-react';

const HeaderChat = () => {
    const {selectedUser , onlineUsers , setSelectedUser} = useChatStore();
    const user = selectedUser;
  return (
    <div className='h-[60px] w-full border-b-1 border-gray-300 dark:border-gray-800 flex items-center '>
        <div className='flex w-full items-center  px-4 py-3 gap-4'>
            <button onClick={()=>{setSelectedUser(null)}} className='md:hidden p-2 rounded-full hover:bg-foreground/5'>
                <ChevronLeft  className='size-5'/>
            </button>
            <div className='flex  justify-between gap-4'>
                <div className={"size-10 rounded-full"}>
                     <img className='size-10 rounded-full object-cover' src={user?.profilePic || avatarImg} alt="User avatar" />
                        
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className='font-semibold  text-black/70 dark:text-white/40 tracking-tighter'>{user.fullName}</h2>
                    <p className='text-xs text-black/40 dark:text-gray-400 font-semibold'>{onlineUsers.includes(user._id) ? "Online" : "Offline"}</p>

                </div>
            </div>
            

        </div>
        
    </div>
  )
}

export default HeaderChat
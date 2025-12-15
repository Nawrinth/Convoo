import { Search, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import SidebarSkeleton from './skeleton/SidebarSkeleton';
import { useChatStore } from '@/store/useChatStore';
import avatarImg from '../assets/avatar.jpg';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Sidebar = () => {
  const {friends , getFriends, isUsersLoading , selectedUser ,  setSelectedUser , onlineUsers , isChangesMade , setIsChangesMade} = useChatStore();

  useEffect(() => {
    const fetchUsers = async () => {  
      await getFriends();
    };
    fetchUsers();
    setIsChangesMade(false);
    
  }, [isChangesMade]);
  useEffect(() =>{console.log(friends)} , [friends])


  return (
    <div
  className={`flex-col w-full flex h-full md:w-100 border-r ${selectedUser ? "hidden md:flex" : "flex"} `}
>
      {/* Search Bar  */}
      <div className='space-y-4   py-6 rounded-xl  px-3 '>
          <h1>All Messages</h1>
          <div className='w-full flex py-3 bg-sidebar text-sm rounded-lg px-4 items-center gap-4'>
              <Search className='size-5'/>
              <input placeholder='Search by their mail' className='border-0 outline-0 w-full ' />
              
          </div>


      </div>
      
          <div className='w-full h-full rounded-xl flex flex-col gap-1 px-2 ovreflow-y-auto'>
            {friends.map((user , index) =>(
              <button key={user._id} onClick={()=>{setSelectedUser(user)}} className={` hover:bg-foreground/3  rounded-lg flex gap-4 py-2 px-3 w-full ${selectedUser?._id === user?._id ? "dark:bg-foreground/10 bg-foreground/10 ":""}`}>
                  <div className='relative'>
                    <div className='size-12 rounded-full flex items-center justify-center'>
                      <img src={user?.profilePic || avatarImg} alt="" className='size-10 rounded-full object-cover' />
                    </div>
                    {
                        onlineUsers.includes(user._id) &&
                        <div className='absolute bg-green-500 h-3 w-3 rounded-full bottom-0 right-0'></div>
                    }

                  </div>
                  <div className='flex flex-col items-start justify-between '>
                    <p className='text font-medium tracking-wide'>{user.fullName}</p>
                    <div className='text-xs opacity-60'>{onlineUsers.includes(user._id)?"Online":"Offline"}</div>
                  </div>

              </button>
            )) }

            <div className='flex flex-col items-center justify-center mt-10'>
              <div className='w-[60%] border'></div>
              <p className='text-xs opacity-50 mt-2'>No more users</p>
            </div>

          </div>
      
    </div>
  )
}

export default Sidebar

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { Hourglass, Search, UserCheck, UserPlus , } from "lucide-react";
import avatarImg from "../assets/avatar.jpg";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";

const SearchUser = () => {
  const { showSearchUser , authUser} = useAuthStore();
  const { users, getUsers, isUsersLoading , friends , pending , getPendingUserId , addConnection } = useChatStore();
  const [search, setSearch] = useState("");

  // * Get pending connections on component mount
  useEffect(()=>{
    if (!authUser) return; 
    const fetchPendingConnections = async () => {
      await getPendingUserId();
    }
    fetchPendingConnections();


  } , [getPendingUserId])

  // * Debugging: Log pending connections whenever they change
  useEffect(() => {
    console.log("Pending connections  :",pending.length);
    console.log(pending);
  },[pending])

  // * Fetch users when search changes with debounce  
  useEffect(() => {
    if (!search.trim()) return; // don't fetch if empty

    const debounce = setTimeout(() => {
      getUsers(search); // call Zustand getUsers with search query
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, getUsers]);

  // * Create connection handler
  const handleAddConnection = async (toUserId) => {
    await addConnection(toUserId);
  };

  return (
    <AnimatePresence>
      {showSearchUser && (
        <motion.div
          key="search-user"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.2 }}
          className="absolute h-full w-full md:w-100 bg-background z-200 border-r gap-6 py-10 flex flex-col"
        >
          {/* Search Bar */}
          <div className="flex items-center gap-4 bg-sidebar p-2 rounded-lg mx-4">
            <Search size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm w-full outline-0"
              placeholder="Search ..."
            />
          </div>

          <div className="w-full border"></div>

          {/* Scrollable Users List */}
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto px-4">
            {!search.trim() ? (
              <div className="flex items-center justify-center h-full text-sm opacity-50">
                Start typing to find users
              </div>
            ) : isUsersLoading ? (
              <div className="flex items-center justify-center h-full text-sm opacity-60">
                <SidebarSkeleton/>
              </div>
            ) : Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-foreground/5 justify-between "
                >
                  <div className="flex items-center gap-4">

                    <div className="relative">
                      <img
                        src={user.profilePic || avatarImg}
                        alt=""
                        className="size-12 rounded-full object-cover"
                        />
                    </div>
                    <div className="h-full flex flex-col justify-evenly">
                      <p className="text-[15px] font-medium">{user.fullName}</p>
                      <p className="text-xs opacity-70">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">

                    {(!friends.some(friend => friend._id === user._id) && !pending.some(p => p.toString() === user._id.toString())) && (
                      <button onClick={() => {handleAddConnection(user._id)}} className="p-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/80 hover:scale-103">
                        <UserPlus size={16} />
                      </button>
                    )}

                    {(friends.some(friend => friend._id === user._id)) && <button className="p-2  text-white rounded-lg  bg-green-600 hover:scale-103">
                        <UserCheck size={16} />
                    </button>}
                    {(pending.some(userId => userId === user._id)) && <button className="p-2  text-white rounded-lg  bg-yellow-400/60 hover:scale-103">
                        <Hourglass size={16} />
                    </button>}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-sm opacity-60">
                No users found
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchUser;

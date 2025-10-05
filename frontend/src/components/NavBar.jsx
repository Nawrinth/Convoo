import React, { use, useState } from "react";
import { ToggleThemeMode } from "./ToggleThemeMode";
import { useAuthStore } from "@/store/useAuthStore";
import { Leaf, LogOutIcon, Settings,  MessageSquareText, Users, Bell,  } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import ProfileModal from "./modals/ProfileModal";
import { motion } from "motion/react"
import { useChatStore } from "@/store/useChatStore";
import NotificationModal from "./modals/NotificationModal";

const NavBar = () => {
  const { logout, authUser , toggleShowProfileModal , toggleShowSearchUser } = useAuthStore();
  const {setAllToEmpty , toggleShowNotificationsModal , anyNotifications} = useChatStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Chat", path: "/chat", icon: <MessageSquareText size={22} /> },,
  ];

  const logoutAction = async () => {
    setAllToEmpty();
    logout();
    setIsOpen(false); // close menu on logout
  };

  return (
    <nav className="flex flex-col px-2 min-w-16  py-8 backdrop-blur-xl justify-between items-center h-screen  overflow-y-auto border-r z-300 ">
      {/* Left logo */}
      <div>
        <Link to={"/"} className="flex gap-3 items-center hover:scale-104 transition-all duration-150">
          <div className="p-3 dark:bg-primary/60 bg-primary/90 rounded-xl">
            <Leaf className="size-5 text-white" />
          </div>
        </Link>
        <div className="mt-14 w-full flex flex-col items-center gap-2">
          {navItems.map((item,index)=>
            <NavLink key={item.name} to={item.path} className={({isActive}) => `p-3 rounded-lg  ${isActive?"bg-foreground/10":"hover:bg-foreground/3 "}`}>{item.icon}</NavLink>
          )}
        </div>
        <button className="w-full flex flex-col items-center mt-6 p-2" onClick={toggleShowSearchUser}>
          <Users />
        </button>
      </div>

      {/* Desktop menu */}
      <div className="flex flex-col gap-8 mt-15 items-center">
        
        <ToggleThemeMode/>
        {authUser && (
          <>
            <div onClick={toggleShowNotificationsModal} className="relative group hover:scale-105 px-1 pt-1  transition-all duration-200">
                <button className="relative">

                    <Bell className="size-5.5"/>
                  { anyNotifications &&  <div className="size-2 rounded-full bg-red-500  absolute top-0 right-0"></div>}
                </button>

            </div>
            <button className="group hover:scale-105   transition-all duration-200"  onClick={() => toggleShowProfileModal(true)}>
              
              <div className="flex gap-2 items-center">
                <Settings className="size-5.5 text-gray-800 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-all duration-200" />
              </div>
            </button>
            <button
              onClick={logoutAction}
              className="group hover:scale-105 transition-all duration-200"
            >
              <div className="flex gap-2 items-center">
                <LogOutIcon className="size-5.5 text-gray-800 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-all duration-200" />
              </div>
            </button>
          </>
        )}

        
      </div>

      
    </nav>
  );
};

export default NavBar;

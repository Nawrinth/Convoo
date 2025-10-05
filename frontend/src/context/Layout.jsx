// src/context/Layout.jsx
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import NavBar from "@/components/NavBar";
import ProfileModal from "@/components/modals/ProfileModal";
import SearchUser from "@/components/SearchUser";
import { useChatStore } from "@/store/useChatStore";
import NotificationModal from "@/components/modals/NotificationModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { errorTheme } from "@/styles/ToastStyle";
import { axiosInstance } from "@/lib/axios";

const Layout = ({ children }) => {
  const location = useLocation();
  const [notifications , setNotifications] = useState([]); 

  // Pages where navbar should NOT be visible
  const noNavbarPages = ["/login", "/signup", "/onBoarding"];
  
  const {showProfileModal , showSearchUser  , toggleShowProfileModal} = useAuthStore();
  const {showNotificationsModal , setAnyNotifications} = useChatStore();
  const showNavbar = !noNavbarPages.includes(location.pathname);

  const getNotificationUser = async () => {
        try {
            const res = await axiosInstance.get("/api/connections/notification-user");
            setNotifications(res.data);

            if (res.data.length === 0) {
                setAnyNotifications(false);
            } else {
                setAnyNotifications(true);
            }
        } catch (error) {
            toast.error("Failed to load notifications", errorTheme);
        }
    };

  useEffect(() => {
        getNotificationUser();
    }, []);

    useEffect(() => {
        console.log("Notifications:", notifications);
        
        } , [notifications]);

  return (
    <div className="flex min-h-[100vh] w-[100vw] ">
      {showNavbar && <NavBar />}
      
      {showNotificationsModal && <NotificationModal notifications={notifications} setNotifications={setNotifications}/>}
      
      {showProfileModal && <ProfileModal setIsOpenProfile={toggleShowProfileModal} />}
      
      {/* main content */}
      <div className={`flex-1 relative`}>
        <SearchUser/>
        {children}
      </div>
    </div>
  );
};

export default Layout;

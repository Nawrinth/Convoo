import React from "react";
import { motion , AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { errorTheme } from "@/styles/ToastStyle";
import { useChatStore } from "@/store/useChatStore";

const NotificationModal = ({notifications , setNotifications}) => {
    const {anyNotifications , setAnyNotifications , setIsChangesMade} = useChatStore();
    

    // DELETE connection
    const deleteRequest = async (fromId) => {
        try {
            await axiosInstance.delete("/api/connections", {
            data: { fromId }, // ✅ must be inside 'data'
            });

            setNotifications((prev) => prev.filter((notif) => notif._id !== fromId));
            if (notifications.length === 1) {
                setAnyNotifications(false);
            }
            toast.success("Connection request deleted");
            setIsChangesMade(true);
        } catch (error) {
            console.error(error.response?.data || error.message);
            toast.error("Failed to delete connection request");
        }
    };

    // ACCEPT connection
    const addFriend = async (fromId) => {
        console.log("Accepting connection with ID:", fromId);
        try {
            await axiosInstance.put(`/api/connections/accept-request`, {fromId});

            setNotifications((prev) => prev.filter((notif) => notif._id !== fromId));
            if (notifications.length === 1) {
                setAnyNotifications(false);
            }
            toast.success("Connection request accepted");
        } catch (error) {
            console.error(error.response?.data || error.message);
            toast.error("Failed to accept connection request");
        }
    };

    
    
  return (
    <AnimatePresence>
        <motion.div 
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        exit={{opacity:0}} 
        transition={{duration:0.2}} 
        className="fixed bottom-6 left-20 w-[70%] max-w-80 h-100 bg-sidebar space-y-2 overflow-y-auto shadow-lg rounded-lg z-200 py-4 px-2">
            {
            !anyNotifications && 
            <div className="w-full h-full flex items-center justify-center">
                <p className="opacity-60 text-sm tracking-wide">No new notifications</p>
            </div>
            }
            {anyNotifications && 
            notifications.map((notification) => (
                <div className="flex flex-col gap-3" key={notification._id}>
                    <div className="w-full h-20 border px-2 rounded-lg flex items-center bg-background/40 justify-between gap-4">
                        <div className="flex items-center gap-4 h-full">
                            <div className="relative size-10 rounded-full bg-foreground">
                                <img src={notification.profilePic} className="size-10 rounded-full  object-cover" alt="" />
                            </div>
                            <div className="flex flex-col justify-between">
                                <h2 className="text-sm">{notification.fullName}</h2>
                                <h2 className="text-xs">{notification.email}</h2>
                            </div>
                            
                        </div>
                        <div className="flex gap-2">
                            <button onClick={()=>{addFriend(notification._id)}} className="p-1 bg-green-500 rounded hover:bg-green-600 transition-all duration-150 hover:scale-104">
                                <Check className="size-5"/>
                            </button>
                            <button  onClick={()=>{deleteRequest(notification._id)}} className="p-1 bg-red-500 rounded hover:bg-red-600 transition-all duration-150 hover:scale-104">
                                <X  className="size-5" />
                            </button>
                        </div>
                    </div>
                    
                </div>
            ))
                
            }
        
        </motion.div>
    </AnimatePresence>
  );
};

export default NotificationModal;

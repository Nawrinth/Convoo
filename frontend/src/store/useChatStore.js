import { create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { errorTheme } from "@/styles/ToastStyle.js";

export const useChatStore = create((set , get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    onlineUsers:[],
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            console.log("Fetching users...");
            const res = await axiosInstance.get("/api/messages/user");
            set({ users: res.data });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users", errorTheme);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/api/messages/${userId}`);
            set({messages:res.data});
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages" , errorTheme);
        }
        set({isMessagesLoading:false});
    },
    sendMessages: async ( messageData ) => {
        const {selectedUser , messages} = get();
        try {
            const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData)
            set({messages:[...messages , res.data]});
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message" , errorTheme);
        }
    },
    setSelectedUser: (selectedUser) => set({selectedUser}),
}));
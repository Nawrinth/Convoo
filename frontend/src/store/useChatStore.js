import { create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { errorTheme, successTheme } from "@/styles/ToastStyle.js";

export const useChatStore = create((set , get) => ({
    messages:[],
    users:[],
    friends:[],
    pending:[],
    showNotificationsModal:false,
    anyNotifications:null,
    isChangesMade:true,
    setIsChangesMade: (value) => set({isChangesMade:value}),
    setAnyNotifications: (value) => set({anyNotifications:value}),
    toggleShowNotificationsModal: () => set((state) => ({ showNotificationsModal: !state.showNotificationsModal })),
    setAllToEmpty: () => set({messages:[], users:[], friends:[], pending:[]}),
    getPendingUserId: async () =>{
        try{
            console.log("Fetching pending connections...");
            const res = await axiosInstance.get("/api/connections/pending");
            set({ pending: res.data });
        } catch (error) {
            console.error("Error fetching pending connections:", error);
            toast.error("Failed to load pending connections", errorTheme);
        } 
    },
    addConnection: async (toUserId) => {
        try {
            const currentPending = get().pending || [];
            await axiosInstance.post("/api/connections", { toUserId });
            // Optionally, you can update the pending list locally
            set({ pending: [...currentPending, toUserId] });
            toast.success("Connection request sent" , successTheme);
        } catch (error) {
            console.error("Error sending connection request:", error);
            toast.error("Failed to send connection request", errorTheme);
        }
    },
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    onlineUsers:[],
    getUsers: async (search = "") => {
        set({ isUsersLoading: true });
        try {
            console.log("Fetching users...");
            const res = await axiosInstance.get(`/api/messages/user?search=${search}`);
            // Ensure users is always an array
            set({ users: Array.isArray(res.data) ? res.data : [] });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users", errorTheme);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getFriends: async () => {
        set({ isUsersLoading: true });
        try {
            console.log("Fetching users...");
            const res = await axiosInstance.get("/api/messages/friends");
            set({ friends: res.data });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users", errorTheme);
        } finally {
            set({ isUsersLoading: false });
        }
        },
    getMessages: async (pageParam, userId) => {
        try {
            const res = await axiosInstance.get(`/api/messages/${userId}`, {
                params: { page: pageParam, limit: 10 } // adjust limit as needed
            });
            // return data to react-query
            return res.data; 
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error; // let react-query handle it
        }
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
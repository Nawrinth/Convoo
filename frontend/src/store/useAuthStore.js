import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import { errorTheme, successTheme } from "@/styles/ToastStyle.js"
import { io } from "socket.io-client"

export const useAuthStore = create((set , get) => ({
    showProfileModal:false,
    toggleShowProfileModal: () => set(state => ({ showProfileModal: !state.showProfileModal })),
    showSearchUser:false,
    toggleShowSearchUser: () => set(state => ({ showSearchUser: !state.showSearchUser })),
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    socket:null,
    checkAuth: async() =>{
        try {
            const res = await axiosInstance.get("/api/auth/check",  {
                withCredentials: true
                })
            set({authUser:res.data})
            get().connectSocket()
        } catch (error) {
            set({authUser:null})
            console.log("Error on checkAuth",error)
        }

        set({isCheckingAuth:false})
    },
    signup: async(formData) =>{
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/api/auth/signup",formData)
            set({authUser:res.data})
            toast.success("Signup successful" , successTheme)

            get().connectSocket()
        } catch (error) {
            console.log("Error on signup",error.message)
            toast.error(error.response?.data?.message || "Signup failed" , errorTheme)
        }
        set({isSigningUp:false})
    },
    login: async(formData) =>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/api/auth/login",formData)
            set({authUser:res.data})
            toast.success("Login successful" , successTheme)

            get().connectSocket()
        } catch (error) {
            console.log("Error on login",error.message)
            toast.error(error.response?.data?.message || "Login failed" , errorTheme)
        }
        set({isLoggingIn:false})
    },
    logout: async ()=>{
        try {
            await axiosInstance.post("/api/auth/logout")
            set({authUser:null})
            set({showSearchUser:false})
            toast.success("Logout successful", successTheme)
            get().disconnectSocket();
        } catch (error) {
            console.log("Error on logout", error.message)
            toast.error("Logout failed", errorTheme)    
        }
    },
    updateProfile: async(formData) =>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/api/auth/update-profile",formData)
            set({authUser:res.data})
            toast.success("Profile updated successfully" , successTheme)
        } catch (error) {
            console.log("Error on updateProfile",error.message)
            toast.error(error.response?.data?.message || "Profile update failed" , errorTheme)
        }
        set({isUpdatingProfile:false})
    },
    connectSocket:() =>{
        const { authUser} = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(import.meta.env.VITE_API_URL )
        socket.connect()

        set({socket:socket})
    },
    disconnectSocket:() =>{
        if (get().socket?.connected) get().socket?.disconnect();
    }
}))
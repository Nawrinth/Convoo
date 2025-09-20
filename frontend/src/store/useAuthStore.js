import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import { errorTheme, successTheme } from "@/styles/ToastStyle.js"

export const useAuthStore = create((set) => ({
    showProfileModal:false,
    setShowProfileModal: () => set(state => ({ showProfileModal: !state.showProfileModal })),
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    checkAuth: async() =>{
        try {
            const res = await axiosInstance.get("/api/auth/check",  {
                withCredentials: true
                })
            set({authUser:res.data})
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
            toast.success("Logout successful", successTheme)
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
    }
}))
import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Button } from "@/components/ui/button"
import { EqualApproximatelyIcon, Eye, EyeClosed, EyeOff, Key, Leaf, Loader, Lock, Mail, MessageSquare, User } from "lucide-react"
import { ToggleThemeMode } from '../components/ToggleThemeMode'
import { Link } from 'react-router-dom'
import AuthPageAnimation from '@/components/AuthPageAnimation'
import toast from 'react-hot-toast'
import { errorTheme , successTheme } from '@/styles/ToastStyle'

const LoginPage = () => {
  const [showPassword , setShowPassword] = useState(false);
    const [formData , setFormData] = useState({
      email:"",
      password:"",
    })
    const {isLoggingIn , login} = useAuthStore();
    const validateForm = () =>{
    if (!(formData.email.trim() && formData.password.trim())) {
      return toast.error("All fields are required",errorTheme);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return toast.error("Please enter a valid email address",errorTheme);
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long",errorTheme);
    }

    return true
  }
  const handleSubmit = (e) =>{
    e.preventDefault();
    if (validateForm() === true){
        login(formData);
    }
  }
  return (
    <div className='grid xl:grid-cols-2  w-screen h-[calc(100vh-64px)]'>
      {/* Left Side  */}
        <div className='flex  items-center justify-center w-full '>
          <div className='space-y-10 w-full '>
            {/* Logo */}
            <div className='flex flex-col space-y-6 items-center justify-center h-full w-full'>
              <div className='flex gap-3 items-center'>
                  <div className='p-3 bg-primary/20 rounded-2xl hover:bg-primary/30 transition-colors duration-200'>
                    <Leaf/>
                  </div>
                  <h2 className='font-bold text-xl text-primary'>Convoo</h2>
              </div>
              <div className='text-center space-y-2'>

                <h3 className='text-bold text-2xl font-bold text-black/80 dark:text-white/80'>Log In to Convoo</h3>
                <p className='font-medium text-black/50 dark:text-white/50'>Reconnect with your friends and groups instantly</p>
              </div>
            </div>

            {/* Form Details  */}
            <form onSubmit={handleSubmit} className='flex items-center justify-center w-full'>
              <div className='form w-80 md:w-100 space-y-6'>
                {/* Email */}
                <div className='flex flex-col gap-2'>
                  <label htmlFor="" className='text-gray-800 dark:text-gray-300 font-bold '>Email</label>
                  <div className='w-full border-1 border-gray-500 dark:border-gray-500 p-2 rounded-lg flex gap-4 px-2 items-center'>
                    <Mail className='size-5'/>
                    <input type="text" className='w-full outline-0' value={formData.email} onChange={(e)=>{setFormData({...formData , email:e.target.value})}}   placeholder='Enter Email'/>
                  </div>
                </div>
                {/* Password  */}
                <div className='flex flex-col gap-2'>
                  <label htmlFor="" className='text-gray-800 dark:text-gray-300 font-bold '>Password</label>
                  <div className='w-full border-1 border-gray-500 dark:border-gray-500 p-2 rounded-lg flex gap-4 px-2 items-center'>
                    <Lock className='size-5'/>
                    <input type={showPassword?"text":"password"} value={formData.password} onChange={(e)=>{setFormData({...formData , password:e.target.value})}}  className='w-full outline-0'  placeholder='Enter Password'/>
                    <button onClick={()=>setShowPassword(!showPassword)} type='button'>
                        {showPassword ? <EyeOff className='size-5'/>:<Eye  className='size-5'/> }
                    </button>
                  </div>
                </div>
                {/* SUBMIT BUTTON */}
                <button
                  className={"w-full text-lg mt-10 bg-primary hover:scale-104 p-1.5  rounded-lg cursor-pointer font-semibold hover:opacity-80  text-white min-h-10 flex items-center justify-center transition-all duration-150"}
                  type='submit'
                  disabled={isLoggingIn}
                  >{isLoggingIn?<Loader className='animate-spin'/>:"Sign In"}</button>
                {/* Login Navigation */}
                <p className='font-normal text-center'>Don’t have an account?
                  <span>{" "}</span>
                  <Link to={"/signup"} className='text-[#665fca] underline'>
                      Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>

          

        </div>
      {/* Right Side */}
      <div className='hidden xl:flex flex-col gap-10 h-full items-center justify-center bg-white/20 dark:bg-black/10'>
          <AuthPageAnimation/>
          <div className='space-y-4 text-center mt-6'>
              <h1 className='font-bold text-3xl'>Rejoin the Chat 💬</h1>
              <p className='font-medium text-gray-500 dark:text-gray-300 text-lg'>Sign in to connect, share, and explore</p>
          </div>
      </div>
    </div>
  )
}


export default LoginPage
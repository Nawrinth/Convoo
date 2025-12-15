import { Camera, MailIcon, User, X } from 'lucide-react';
import React, { useState } from 'react';
import avatarImg from "../../assets/avatar.jpg";
import { useAuthStore } from '@/store/useAuthStore';
import { ToggleThemeMode } from '../ToggleThemeMode';

const ProfileModal = ({ setIsOpenProfile, isDarkMode }) => {
  const [avatar, setAvatar] = useState(null);
  const { updateProfile, isUpdatingProfile, authUser } = useAuthStore();

  // Handle avatar upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64data = reader.result;
      await updateProfile({ profilePic: base64data });
      setAvatar(null);
    };

    setAvatar(URL.createObjectURL(file));
  };



  const textColor = isDarkMode ? "#fff" : "#000";

  return (
    <div className="absolute inset-0 z-[500] w-screen h-screen bg-black/20 backdrop-blur flex items-center justify-center py-[70px] px-6">
      {/* Modal container */}
      <div className='bg-background rounded-2xl'>

      
      <div
        className="w-full px-10 bg-white/5  md:w-[600px] max-h-[80vh] relative flex flex-col gap-10 p-6 rounded-3xl shadow-xl overflow-y-auto "
        
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-3 rounded-full bg-black/5 hover:bg-black/15 dark:bg-gray-800/60 dark:hover:bg-gray-500/40 transition-all"
          onClick={() => setIsOpenProfile(false)}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-10">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold">User Profile</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your profile information and settings.
            </p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 rounded-full border-4 border-foreground/70 flex items-center justify-center bg-transparent">
              <img
                src={authUser?.profilePic || avatarImg}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-1 -right-1 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:scale-105 transition"
              >
                <Camera className="h-5 w-5" strokeWidth={2.75} />
              </label>
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to change your profile picture."}
            </p>
          </div>

          {/* Profile Info */}
          <div className="space-y-6 w-full text-gray-700 dark:text-gray-200">
            {/* Full Name */}
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <p>Full Name</p>
              </div>
              <p className="border px-4 py-2 border-primary/30 rounded-lg dark:bg-white/2 bg-primary/3">
                {authUser?.fullName}
              </p>
            </div>
            {/* Email */}
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2 text-sm">
                <MailIcon className="h-4 w-4" />
                <p>Email</p>
              </div>
              <p className="border px-4 py-2 border-primary/30 rounded-lg dark:bg-white/2 bg-primary/3">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Account Info */}
          <div className="w-full">
            <h2 className="text-[17px] font-medium pb-4">Account Information</h2>
            <div className="w-full flex items-center border-b py-2 justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
              <p className="text-xs">{new Date(authUser?.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="w-full flex items-center py-2 justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
              <p className="text-sm font-medium text-green-500">Active</p>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-4 w-full">
            <h2 className="text-sm font-medium">Theme</h2>
            <ToggleThemeMode />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

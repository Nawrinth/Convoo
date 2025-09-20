import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import { ThemeProvider } from "./context/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";

import Layout from "./context/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import DiscoverPage from "./pages/DiscoverPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-background">
        <Loader className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Private routes */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/discover-people" element={<DiscoverPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;

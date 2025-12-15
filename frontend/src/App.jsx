import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import { ThemeProvider } from "./context/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./context/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import DiscoverPage from "./pages/DiscoverPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Loader while checking auth
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-[#121212]">
        <Loader className="size-8 animate-spin" />
      </div>
    );
  }

  return (
     <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={authUser ? <Navigate to="/chat" replace /> : <LoginPage />}
              />
              <Route
                path="/signup"
                element={authUser ? <Navigate to="/chat" replace /> : <SignupPage />}
              />

              {/* Redirect root */}
              <Route path="/" element={<Navigate to="/chat" replace />} />

              {/* Private routes */}
              <Route
                path="/chat"
                element={authUser ? <ChatPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/discover-people"
                element={authUser ? <DiscoverPage /> : <Navigate to="/login" replace />}
              />
            </Routes>
          </Layout>
          <Toaster />
        </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

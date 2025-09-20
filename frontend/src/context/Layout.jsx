// src/context/Layout.jsx
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import NavBar from "@/components/NavBar";

const Layout = ({ children }) => {
  const location = useLocation();
  const { authUser } = useAuthStore();

  // Pages where navbar should NOT be visible
  const noNavbarPages = ["/login", "/signup", "/onBoarding"];
  const showNavbar = !noNavbarPages.includes(location.pathname) && authUser;

  return (
    <div className="flex min-h-[100vh] w-[100vw]">
      {showNavbar && <NavBar />}
      
      {/* main content */}
      <div className={`flex-1`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;

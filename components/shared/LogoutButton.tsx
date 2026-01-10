"use client";

import { logoutUser } from "@/services/auth/auth.services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Navigate immediately to login page
    router.push("/login");
    
    // Then perform logout cleanup in background
    try {
      await logoutUser();
      
      // Force a hard refresh to ensure all auth state is cleared
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout cleanup error:", error);
      // Still force redirect
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
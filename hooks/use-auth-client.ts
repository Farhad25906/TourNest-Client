"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserInfo } from "@/types/user.interface";
import { getUserInfo } from "@/services/auth/auth.services";


export function useAuthClient() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const userInfo = await getUserInfo();
      
      if (userInfo) {
        setUser(userInfo);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login?loggedOut=true");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isTourist: user?.role === "TOURIST",
    isHost: user?.role === "HOST",
    isAdmin: user?.role === "ADMIN",
    login,
    logout,
    checkAuth,
  };
}
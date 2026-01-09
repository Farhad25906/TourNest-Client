"use client";

import { logoutUser } from "@/services/auth/auth.services";
import { useRouter } from "next/navigation";


const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logoutUser();

    if (res.success && res.redirectToLogin) {
      router.push("/login");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;

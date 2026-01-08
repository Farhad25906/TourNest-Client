/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "../auth/auth.services";

export async function getDashboardMetaData() {
  try {
    const userInfo = await getUserInfo();

    // Check if userInfo is null
    if (!userInfo) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }
    const cacheTag = `${userInfo.role.toLowerCase()}-dashboard-meta`;

    const response = await serverFetch.get("/meta", {
      next: {
        tags: [cacheTag, "dashboard-meta", "meta-data"],
        // Faster revalidation for dashboard (30 seconds)
        // Dashboard stats should update frequently for real-time feel
        revalidate: 30,
      },
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong"
      }`,
    };
  }
}

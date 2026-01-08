/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { UserInfo } from "@/types/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./tokenHandlers";

export interface UserResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: Array<{ field: string; message: string }>;
  formData?: any;
}

// ==================== GET USER INFO ====================

export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    console.log("Fetching user info from /users/me...");

    const response = await serverFetch.get("/users/me", {
      next: { tags: ["user-info"], revalidate: 30 },
    });

    const result = await response.json();
    console.log("User info API response:", result);

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to fetch user info");
    }

    const userData = result.data;
    console.log("Raw user data:", userData);

    // Base user info (common for all roles)
    const formattedUserInfo: UserInfo = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      needPasswordChange: userData.needPasswordChange,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    // Role-based mapping
    switch (userData.role) {
      case "HOST":
        formattedUserInfo.host = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone ?? "",
          profilePhoto: userData.profilePhoto ?? "",
          bio: userData.bio ?? "",
          hometown: userData.hometown ?? "",
          visitedLocations: userData.visitedLocations ?? [],
          isVerified: userData.isVerified ?? false,
          isDeleted: userData.isDeleted ?? false,

          tourLimit: userData.tourLimit ?? 0,
          currentTourCount: userData.currentTourCount ?? 0,

          blogLimit: userData.blogLimit ?? 0,
          currentBlogCount: userData.currentBlogCount ?? 0,

          subscriptionId: userData.subscriptionId || null,
          stripeCustomerId: userData.stripeCustomerId || null,

          balance: userData.balance ?? "0",
          totalEarnings: userData.totalEarnings ?? "0",
          lastPayoutAt: userData.lastPayoutAt ?? null,

          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };
        break;

      case "ADMIN":
        formattedUserInfo.admin = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          contactNumber: userData.contactNumber ?? "",
          profilePhoto: userData.profilePhoto ?? "",
          isDeleted: userData.isDeleted ?? false,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };
        break;

      case "TOURIST":
      case "USER":
        formattedUserInfo.user = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          profilePhoto: userData.profilePhoto ?? "",
          bio: userData.bio ?? "",
          interests: userData.interests ?? "",
          location: userData.location ?? "",
          visitedCountries: userData.visitedCountries ?? "",
          totalSpent: userData.totalSpent ?? "0",
          isDeleted: userData.isDeleted ?? false,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };
        break;
    }

    console.log("Formatted user info:", formattedUserInfo);
    return formattedUserInfo;
  } catch (error) {
    console.error("Get user info error:", error);
    return null;
  }
};


// ==================== UPDATE PROFILE ====================

export const updateProfile = async (
  formData: FormData
): Promise<UserResponse> => {
  try {
    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (key === "file") continue;

      const stringValue = value?.toString();

      if (stringValue === undefined || stringValue === "") continue;

      // 🔢 Numeric fields
      if (
        key === "tourLimit" ||
        key === "currentTourCount" ||
        key === "blogLimit" ||
        key === "currentBlogCount"
      ) {
        data[key] = Number(stringValue);
        continue;
      }

      // ✅ Boolean fields
      if (key === "isVerified" || key === "isDeleted") {
        data[key] = stringValue === "true";
        continue;
      }

      // 📍 Array fields
      if (key === "visitedLocations") {
        data[key] = stringValue
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        continue;
      }

      // ❌ Nullable fields
      if (stringValue === "null") {
        data[key] = null;
        continue;
      }

      // 📝 Default (string)
      data[key] = stringValue;
    }

    console.log("Updating profile with processed data:", data);

    // Prepare multipart form data
    const requestData = new FormData();
    requestData.append("data", JSON.stringify(data));

    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
      console.log("Including file in update");
      requestData.append("file", file);
    }

    const res = await serverFetch.patch("/users/update-my-profile", {
      body: requestData,
    });

    const result = await res.json();
    console.log("Update profile response:", result);

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update profile",
        formData: data,
        errors: [
          {
            field: "general",
            message: result.message || "Update failed",
          },
        ],
      };
    }

    return {
      success: true,
      message: result.message || "Profile updated successfully!",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Update profile error:", error);

    if (
      error?.message?.toLowerCase().includes("unauthorized") ||
      error?.message?.toLowerCase().includes("authentication")
    ) {
      return {
        success: false,
        message: "Session expired. Please login again.",
        errors: [
          {
            field: "general",
            message: "Authentication required",
          },
        ],
      };
    }

    return {
      success: false,
      message: error.message || "Failed to update profile. Please try again.",
    };
  }
};


// ==================== GET PROFILE DATA ====================

// export const getProfileData = async (): Promise<UserResponse> => {
//   try {
//     const userInfo = await getUserInfo();

//     if (!userInfo || !userInfo.id) {
//       return {
//         success: false,
//         message: "User not authenticated",
//       };
//     }

//     let profileData: any = {};

//     switch (userInfo.role) {
//       case "TOURIST":
//         profileData = {
//           name: userInfo.tourist?.name || userInfo.name || "",
//           phone: userInfo.tourist?.phone || "",
//           bio: userInfo.tourist?.bio || "",
//           hometown: userInfo.tourist?.hometown || "",
//           profilePhoto: userInfo.tourist?.profilePhoto || "",
//           visitedLocations: userInfo.tourist?.visitedLocations || [],
//         };
//         break;

//       case "HOST":
//         profileData = {
//           name: userInfo.host?.name || userInfo.name || "",
//           phone: userInfo.host?.phone || "",
//           bio: userInfo.host?.bio || "",
//           hometown: userInfo.host?.hometown || "",
//           profilePhoto: userInfo.host?.profilePhoto || "",
//           visitedLocations: userInfo.host?.visitedLocations || [],
//           isVerified: userInfo.host?.isVerified || false,
//           tourLimit: userInfo.host?.tourLimit || 3,
//           currentTourCount: userInfo.host?.currentTourCount || 0,
//           subscriptionId: userInfo.host?.subscriptionId || "",
//         };
//         break;

//       case "ADMIN":
//         profileData = {
//           name: userInfo.admin?.name || userInfo.name || "",
//           contactNumber: userInfo.admin?.contactNumber || "",
//           profilePhoto: userInfo.admin?.profilePhoto || "",
//         };
//         break;
//     }

//     return {
//       success: true,
//       data: profileData,
//     };
//   } catch (error: any) {
//     console.error("Get profile data error:", error);
//     return {
//       success: false,
//       message: error.message || "Failed to load profile data",
//     };
//   }
// };

// ==================== CREATE TOURIST (ADMIN) ====================

export const createTourist = async (
  formData: FormData
): Promise<UserResponse> => {
  try {
    const requestData = new FormData();

    // Extract and structure data
    const data = {
      password: formData.get("password"),
      tourist: {
        name: formData.get("name"),
        email: formData.get("email"),
        bio: formData.get("bio"),
        interests: formData.get("interests"),
        location: formData.get("location"),
        visitedCountries: formData.get("visitedCountries"),
      },
    };

    requestData.append("data", JSON.stringify(data));

    const file = formData.get("profilePhoto");
    if (file instanceof File && file.size > 0) {
      requestData.append("file", file);
    }

    const res = await serverFetch.post("/users/create-tourist", {
      body: requestData,
    });

    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "Tourist created successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to create tourist",
    };
  } catch (error: any) {
    console.error("Create tourist error:", error);
    return {
      success: false,
      message: error.message || "Failed to create tourist. Please try again.",
    };
  }
};

// ==================== CREATE HOST (ADMIN) ====================

export const createHost = async (formData: FormData): Promise<UserResponse> => {
  try {
    const requestData = new FormData();

    const data = {
      password: formData.get("password"),
      host: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        bio: formData.get("bio"),
        hometown: formData.get("hometown"),
        visitedLocations:
          formData.get("visitedLocations")?.toString().split(",") || [],
        isVerified: formData.get("isVerified") === "true",
        tourLimit: parseInt(formData.get("tourLimit") as string) || 3,
        currentTourCount:
          parseInt(formData.get("currentTourCount") as string) || 0,
        subscriptionId: formData.get("subscriptionId"),
      },
    };

    requestData.append("data", JSON.stringify(data));

    const file = formData.get("profilePhoto");
    if (file instanceof File && file.size > 0) {
      requestData.append("file", file);
    }

    const res = await serverFetch.post("/users/create-host", {
      body: requestData,
    });

    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "Host created successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to create host",
    };
  } catch (error: any) {
    console.error("Create host error:", error);
    return {
      success: false,
      message: error.message || "Failed to create host. Please try again.",
    };
  }
};

// ==================== UPDATE USER STATUS ====================

export const updateUserStatus = async (
  userId: string,
  status: string
): Promise<UserResponse> => {
  try {
    const res = await serverFetch.patch(`/users/${userId}/status`, {
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "User status updated successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update user status",
    };
  } catch (error: any) {
    console.error("Update user status error:", error);
    return {
      success: false,
      message:
        error.message || "Failed to update user status. Please try again.",
    };
  }
};

// ==================== GET ALL USERS ====================

export const getAllUsers = async (params?: {
  searchTerm?: string;
  status?: string;
  role?: string;
  email?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<UserResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.email) queryParams.append("email", params.email);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `/users${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const res = await serverFetch.get(url);
    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch users",
    };
  } catch (error: any) {
    console.error("Get all users error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch users. Please try again.",
    };
  }
};

// ==================== DELETE USER ====================

export const deleteUser = async (userId: string): Promise<UserResponse> => {
  try {
    const res = await serverFetch.delete(`/users/${userId}`);

    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "User deleted successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to delete user",
    };
  } catch (error: any) {
    console.error("Delete user error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete user. Please try again.",
    };
  }
};

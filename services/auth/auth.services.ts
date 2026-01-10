/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/auth-utils";
import { zodValidator } from "@/lib/zodValidator";
import {
  loginValidationZodSchema,
  changePasswordValidationZodSchema,
  forgotPasswordValidationZodSchema,
  resetPasswordValidationZodSchema,
  registerPatientValidationZodSchema,
} from "@/zod/auth.validation";
import { createHostValidationZodSchema } from "@/zod/user.validation";
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { setCookie, getCookie, deleteCookie } from "./tokenHandlers";
import { cookies } from "next/headers";
import { UserInfo } from "@/types/user.interface";

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: Array<{ field: string; message: string }>;
  formData?: any;
  redirectToLogin?: boolean;
}

// Helper async function to format validation errors
const formatValidationErrors = async (
  validationResult: any
): Promise<Array<{ field: string; message: string }>> => {
  if (!validationResult.errors) {
    return [{ field: "general", message: "Validation failed" }];
  }

  return Object.entries(validationResult.errors).map(([field, messages]) => ({
    field,
    message:
      Array.isArray(messages) && messages.length > 0
        ? messages[0]
        : `Invalid ${field}`,
  }));
};

// ==================== LOGIN ====================

export const loginUser = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    const redirectTo = formData.get("redirect") || null;

    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validate once
    const validation = zodValidator(payload, loginValidationZodSchema);
    if (!validation.success) {
      return validation;
    }

    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(validation.data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(res.json());

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message || "Login failed");
    }

    // Extract cookies
    const setCookieHeaders = res.headers.getSetCookie();
    if (!setCookieHeaders || setCookieHeaders.length === 0) {
      throw new Error("No Set-Cookie header found");
    }

    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    let accessOptions: any = {};
    let refreshOptions: any = {};

    setCookieHeaders.forEach((cookie: string) => {
      const parsed = parse(cookie);
      if (parsed.accessToken) {
        accessToken = parsed.accessToken;
        accessOptions = parsed;
      }
      if (parsed.refreshToken) {
        refreshToken = parsed.refreshToken;
        refreshOptions = parsed;
      }
    });

    if (!accessToken || !refreshToken) {
      throw new Error("Tokens not found in cookies");
    }

    // Set cookies securely
    await setCookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessOptions["Max-Age"]) || 60 * 60 * 24, // seconds
      path: accessOptions.Path || "/",
      sameSite: accessOptions["SameSite"] || "lax",
    });

    await setCookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(refreshOptions["Max-Age"]) || 60 * 60 * 24 * 7, // seconds
      path: refreshOptions.Path || "/",
      sameSite: refreshOptions["SameSite"] || "lax",
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify token
    let verifiedToken: JwtPayload;
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);
      if (typeof decoded === "string") throw new Error("Invalid token");
      verifiedToken = decoded as JwtPayload;
    } catch (err) {
      throw new Error("Invalid or expired token");
    }

    const userRole: UserRole = verifiedToken.role;

    // Role-based redirect
    if (redirectTo) {
      redirect(redirectTo.toString());
    } else {
      if (userRole === "ADMIN") {
        redirect("/admin/dashboard");
      } else if (userRole === "HOST") {
        redirect("/host/dashboard");
      } else if (userRole === "TOURIST") {
        redirect("/user/dashboard");
      } else {
        redirect("/profile");
      }
    }
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Login error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Login Failed. You might have entered incorrect email or password.",
    };
  }
};

// ==================== REGISTER PATIENT (TOURIST) ====================

export const registerPatient = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    // Get form values
    const name = formData.get("name");
    const address = formData.get("address");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validate required fields
    if (!name || name.trim() === "") {
      return {
        success: false,
        message: "Name is required",
        errors: [{ field: "name", message: "Name is required" }],
      };
    }

    if (!address || address.trim() === "") {
      return {
        success: false,
        message: "Address is required",
        errors: [{ field: "address", message: "Address is required" }],
      };
    }

    if (!email || email.trim() === "") {
      return {
        success: false,
        message: "Email is required",
        errors: [{ field: "email", message: "Email is required" }],
      };
    }

    if (!password || password.trim() === "") {
      return {
        success: false,
        message: "Password is required",
        errors: [{ field: "password", message: "Password is required" }],
      };
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      return {
        success: false,
        message: "Confirm Password is required",
        errors: [
          { field: "confirmPassword", message: "Confirm Password is required" },
        ],
      };
    }

    // Validate password match
    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
        errors: [
          { field: "confirmPassword", message: "Passwords do not match" },
        ],
      };
    }

    const payload = {
      name,
      address,
      email,
      password,
      confirmPassword,
    };

    // Server-side validation using Zod
    const validationResult = zodValidator(
      payload,
      registerPatientValidationZodSchema
    );

    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: await formatValidationErrors(validationResult),
      };
    }

    const validatedPayload: any = validationResult.data;

    // Build the register data payload
    const registerData = {
      password: validatedPayload.password,
      tourist: {
        name: validatedPayload.name,
        address: validatedPayload.address,
        email: validatedPayload.email,
      },
    };

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(registerData));

    // Handle file upload if present
    if (formData.get("file")) {
      newFormData.append("file", formData.get("file") as Blob);
    }

    // Make API request
    const res = await serverFetch.post("/users/create-tourist", {
      body: newFormData,
    });

    const result = await res.json();

    if (result.success) {
      // Automatically log in the user after successful registration
      await loginUser(_currentState, formData);

      return {
        success: true,
        message: "Account created successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Registration failed. Please try again.",
      errors: [
        { field: "general", message: result.message || "Registration failed" },
      ],
    };
  } catch (error: any) {
    // Allow Next.js redirects to propagate
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Registration error:", error);

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration failed. Please try again.",
      errors: [
        { field: "general", message: "Registration failed. Please try again." },
      ],
    };
  }
};

// ==================== CREATE HOST ====================

export const createHost = async (
  prevState: AuthResponse | null,
  formData: FormData
): Promise<AuthResponse> => {
  try {
    // Get form values
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const visitedLocations = formData.get("visitedLocations") as string;

    // Validate required fields
    if (!name || name.trim() === "") {
      return {
        success: false,
        message: "Name is required",
        errors: [{ field: "name", message: "Name is required" }],
        formData: Object.fromEntries(formData.entries()),
      };
    }

    if (!email || email.trim() === "") {
      return {
        success: false,
        message: "Email is required",
        errors: [{ field: "email", message: "Email is required" }],
        formData: Object.fromEntries(formData.entries()),
      };
    }

    if (!password || password.trim() === "") {
      return {
        success: false,
        message: "Password is required",
        errors: [{ field: "password", message: "Password is required" }],
        formData: Object.fromEntries(formData.entries()),
      };
    }

    // Validate visitedLocations JSON
    if (visitedLocations) {
      try {
        JSON.parse(visitedLocations);
      } catch {
        return {
          success: false,
          message: "Invalid visited locations format",
          errors: [
            { field: "visitedLocations", message: "Must be valid JSON array" },
          ],
          formData: Object.fromEntries(formData.entries()),
        };
      }
    }

    const data = {
      password,
      host: {
        name,
        email,
        profilePhoto: (formData.get("profilePhoto") as string) || "",
        phone: phone || "",
        bio: (formData.get("bio") as string) || "",
        hometown: (formData.get("hometown") as string) || "",
        visitedLocations: visitedLocations ? JSON.parse(visitedLocations) : [],
        isVerified: formData.get("isVerified") === "true",
        tourLimit: formData.get("tourLimit")
          ? parseInt(formData.get("tourLimit") as string)
          : undefined,
        currentTourCount: formData.get("currentTourCount")
          ? parseInt(formData.get("currentTourCount") as string)
          : undefined,
        subscriptionId: (formData.get("subscriptionId") as string) || "",
      },
    };

    const validationResult = zodValidator(data, createHostValidationZodSchema);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: await formatValidationErrors(validationResult),
        formData: data,
      };
    }

    const validatedData = validationResult.data;

    // Create FormData for file upload
    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(validatedData));

    // Append profile photo file if exists
    const profilePhotoFile = formData.get("profilePhotoFile") as File;
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      newFormData.append("profilePhoto", profilePhotoFile);
    }

    const res = await serverFetch.post("/users/create-host", {
      body: newFormData,
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
      formData: data,
      errors: [
        {
          field: "general",
          message: result.message || "Failed to create host",
        },
      ],
    };
  } catch (error: any) {
    console.error("Create host error:", error);
    return {
      success: false,
      message: error.message || "Failed to create host. Please try again.",
      errors: [{ field: "general", message: "Failed to create host" }],
    };
  }
};

// ==================== CHANGE PASSWORD ====================

export const changePassword = async (
  prevState: AuthResponse | null,
  formData: FormData
): Promise<AuthResponse> => {
  try {
    // Get form values
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate required fields
    if (!oldPassword || oldPassword.trim() === "") {
      return {
        success: false,
        message: "Current password is required",
        errors: [
          { field: "oldPassword", message: "Current password is required" },
        ],
        formData: { oldPassword, newPassword, confirmPassword },
      };
    }

    if (!newPassword || newPassword.trim() === "") {
      return {
        success: false,
        message: "New password is required",
        errors: [{ field: "newPassword", message: "New password is required" }],
        formData: { oldPassword, newPassword, confirmPassword },
      };
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      return {
        success: false,
        message: "Confirm password is required",
        errors: [
          { field: "confirmPassword", message: "Confirm password is required" },
        ],
        formData: { oldPassword, newPassword, confirmPassword },
      };
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: "New passwords do not match",
        errors: [
          { field: "confirmPassword", message: "New passwords do not match" },
        ],
        formData: { oldPassword, newPassword, confirmPassword },
      };
    }

    // Validate new password is different from old
    if (oldPassword === newPassword) {
      return {
        success: false,
        message: "New password must be different from current password",
        errors: [
          {
            field: "newPassword",
            message: "Must be different from current password",
          },
        ],
        formData: { oldPassword, newPassword, confirmPassword },
      };
    }

    const data = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    const validationResult = zodValidator(
      data,
      changePasswordValidationZodSchema
    );
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: await formatValidationErrors(validationResult),
        formData: data,
      };
    }

    const res = await serverFetch.post("/auth/change-password", {
      body: JSON.stringify({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || "Password changed successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to change password",
      formData: data,
      errors: [
        {
          field: "oldPassword",
          message: result.message || "Invalid credentials",
        },
      ],
    };
  } catch (error: any) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: error.message || "Failed to change password. Please try again.",
      errors: [{ field: "general", message: "Failed to change password" }],
    };
  }
};

// ==================== FORGOT PASSWORD ====================

export const forgotPassword = async (
  prevState: AuthResponse | null,
  formData: FormData
): Promise<AuthResponse> => {
  try {
    const email = formData.get("email") as string;

    // Validate email field
    if (!email || email.trim() === "") {
      return {
        success: false,
        message: "Email is required",
        errors: [{ field: "email", message: "Email is required" }],
        formData: { email },
      };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address",
        errors: [
          { field: "email", message: "Please enter a valid email address" },
        ],
        formData: { email },
      };
    }

    const validationResult = zodValidator(
      { email },
      forgotPasswordValidationZodSchema
    );
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: await formatValidationErrors(validationResult),
        formData: { email },
      };
    }

    const res = await serverFetch.post("/auth/forgot-password", {
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        message:
          result.message || "Password reset link has been sent to your email!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to send reset link",
      formData: { email },
      errors: [
        {
          field: "email",
          message: result.message || "Failed to send reset link",
        },
      ],
    };
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "Failed to send reset link. Please try again.",
      errors: [{ field: "general", message: "Failed to send reset link" }],
    };
  }
};

// ==================== RESET PASSWORD ====================

export const resetPassword = async (
  prevState: AuthResponse | null,
  formData: FormData
): Promise<AuthResponse> => {
  try {
    const userId = formData.get("userId") as string;
    const token = formData.get("token") as string;
    const isEmailReset = formData.get("isEmailReset") === "true";

    // Get password fields
    const password = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate required fields
    if (!password || password.trim() === "") {
      return {
        success: false,
        message: "New password is required",
        errors: [{ field: "newPassword", message: "New password is required" }],
        formData: { userId, token, isEmailReset },
      };
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      return {
        success: false,
        message: "Confirm password is required",
        errors: [
          { field: "confirmPassword", message: "Confirm password is required" },
        ],
        formData: { userId, token, isEmailReset },
      };
    }

    // Validate password match
    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
        errors: [
          { field: "confirmPassword", message: "Passwords do not match" },
        ],
        formData: { userId, token, isEmailReset },
      };
    }

    // Validate password strength (optional)
    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long",
        errors: [
          { field: "newPassword", message: "Must be at least 8 characters" },
        ],
        formData: { userId, token, isEmailReset },
      };
    }

    const data = {
      password,
      confirmPassword,
    };

    const validationResult = zodValidator(
      data,
      resetPasswordValidationZodSchema
    );
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: await formatValidationErrors(validationResult),
        formData: { ...data, userId, token, isEmailReset },
      };
    }

    if (isEmailReset && (!userId || !token)) {
      return {
        success: false,
        message: "Invalid reset link",
        errors: [
          { field: "general", message: "Invalid or expired reset link" },
        ],
        formData: data,
      };
    }

    const url = "/auth/reset-password";
    const body: any = {
      password: data.password,
    };

    if (isEmailReset) {
      body.id = userId;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await serverFetch.post(url, {
        body: JSON.stringify(body),
        headers,
      });
      const result = await res.json();

      if (result.success) {
        return {
          success: true,
          message: result.message || "Password reset successfully!",
          data: result.data,
          redirectToLogin: true,
        };
      }

      return {
        success: false,
        message: result.message || "Failed to reset password",
        formData: data,
        errors: [
          {
            field: "general",
            message: result.message || "Failed to reset password",
          },
        ],
      };
    } else {
      const res = await serverFetch.post(url, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (result.success) {
        return {
          success: true,
          message: result.message || "Password reset successfully!",
          data: result.data,
          redirectToLogin: true,
        };
      }

      return {
        success: false,
        message: result.message || "Failed to reset password",
        formData: data,
        errors: [
          {
            field: "general",
            message: result.message || "Failed to reset password",
          },
        ],
      };
    }
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.message || "Failed to reset password. Please try again.",
      errors: [{ field: "general", message: "Failed to reset password" }],
    };
  }
};

// ==================== LOGOUT ====================

export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    // Validate if user is logged in before logging out
    const accessToken = await getCookie("accessToken");

    // Clear all auth-related cookies
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("user");
    await deleteCookie("token");

    // Also clear localStorage and sessionStorage (if used)
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.clear();
    }

    return {
      success: true,
      message: "Logged out successfully",
      redirectToLogin: true,
    };
  } catch (error: any) {
    console.error("Logout error:", error);

    // Force clear all cookies on error
    try {
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      await deleteCookie("user");
      await deleteCookie("token");

      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch {}

    return {
      success: true, // Still return success to force redirect
      message: "Logged out successfully",
      redirectToLogin: true,
    };
  }
};

// ==================== GET CURRENT USER ====================

export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    // Validate if user has access token
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      console.log("No access token found");
      return null;
    }

    const res = await serverFetch.get("/auth/me");

    // Check if response is ok
    if (!res.ok) {
      console.error("Failed to fetch user info, status:", res.status);
      return null;
    }

    const result = await res.json();
    console.log("User info result:", result);

    if (result.success && result.data) {
      return result.data as UserInfo;
    }

    return null;
  } catch (error: any) {
    console.error("Get current user error:", error);
    return null;
  }
};

// Alternative with AuthResponse wrapper if needed elsewhere:
export const getUserInfoWithResponse = async (): Promise<AuthResponse> => {
  try {
    // Validate if user has access token
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return {
        success: false,
        message: "No active session found",
        errors: [{ field: "auth", message: "Please login to continue" }],
      };
    }

    const res = await serverFetch.get("/users/me");

    // Check if response is ok
    if (!res.ok) {
      return {
        success: false,
        message: `Server error: ${res.status}`,
        errors: [{ field: "server", message: "Server error occurred" }],
      };
    }

    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message || "User data retrieved successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to get user data",
      errors: [
        { field: "data", message: result.message || "Failed to get user data" },
      ],
    };
  } catch (error: any) {
    console.error("Get current user error:", error);
    return {
      success: false,
      message: "Failed to get user data. Please login again.",
      errors: [{ field: "connection", message: "Network error occurred" }],
    };
  }
};

// ==================== REFRESH TOKEN ====================

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    // Validate if refresh token exists
    const refreshTokenCookie = await getCookie("refreshToken");
    if (!refreshTokenCookie) {
      return {
        success: false,
        message: "No refresh token found",
        errors: [
          { field: "auth", message: "Session expired. Please login again." },
        ],
      };
    }

    // Call refresh endpoint with refresh token
    const res = await serverFetch.post("/auth/refresh-token", {
      useRefreshToken: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Token Refreshing");

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Token refresh failed");
    }

    // Extract cookies from Set-Cookie headers
    const setCookieHeaders = res.headers.getSetCookie();
    if (!setCookieHeaders || setCookieHeaders.length === 0) {
      throw new Error("No Set-Cookie header found in refresh response");
    }

    let newAccessToken: string | null = null;
    let newRefreshToken: string | null = null;
    let accessOptions: any = {};
    let refreshOptions: any = {};

    // Parse cookies from Set-Cookie headers
    setCookieHeaders.forEach((cookie: string) => {
      const parsed = parse(cookie);
      if (parsed.accessToken) {
        newAccessToken = parsed.accessToken;
        accessOptions = parsed;
      }
      if (parsed.refreshToken) {
        newRefreshToken = parsed.refreshToken;
        refreshOptions = parsed;
      }
    });

    if (!newAccessToken) {
      throw new Error("Access token not found in refresh response");
    }

    // Set new access token cookie
    await setCookie("accessToken", newAccessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessOptions["Max-Age"]) || 60 * 60 * 24, // 1 day default
      path: accessOptions.Path || "/",
      sameSite: accessOptions.SameSite || "lax",
    });

    // Set new refresh token cookie if backend rotates it
    if (newRefreshToken) {
      await setCookie("refreshToken", newRefreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: parseInt(refreshOptions["Max-Age"]) || 60 * 60 * 24 * 7, // 7 days default
        path: refreshOptions.Path || "/",
        sameSite: refreshOptions.SameSite || "lax",
      });
    }

    // Small delay to ensure cookies are set
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Optionally verify the new token
    let verifiedToken: JwtPayload;
    try {
      const decoded = jwt.verify(
        newAccessToken,
        process.env.JWT_SECRET as string
      );
      if (typeof decoded === "string") throw new Error("Invalid token");
      verifiedToken = decoded as JwtPayload;
    } catch (err) {
      throw new Error("Invalid or expired token received from refresh");
    }

    return {
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: result.data?.user || verifiedToken,
      },
    };
  } catch (error: any) {
    console.error("Refresh token error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Session expired. Please login again.",
      errors: [
        {
          field: "auth",
          message: error.message || "Failed to refresh token",
        },
      ],
    };
  }
};

// ==================== HELPER FUNCTION FOR VALIDATION ====================

export const validateFormData = async (
  formData: FormData,
  requiredFields: string[]
): Promise<AuthResponse | null> => {
  const errors: Array<{ field: string; message: string }> = [];

  for (const field of requiredFields) {
    const value = formData.get(field) as string;
    if (!value || value.trim() === "") {
      errors.push({
        field,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`,
      });
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      message: "Please fill in all required fields",
      errors,
      formData: Object.fromEntries(formData.entries()),
    };
  }

  return null;
};

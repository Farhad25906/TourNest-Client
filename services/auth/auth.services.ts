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

// ==================== LOGIN ====================

export const loginUser = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    const redirectTo = formData.get("redirect") || null;
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    if (zodValidator(payload, loginValidationZodSchema).success === false) {
      return zodValidator(payload, loginValidationZodSchema);
    }

    const validatedPayload = zodValidator(
      payload,
      loginValidationZodSchema
    ).data;

    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    const setCookieHeaders = res.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);

        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie["refreshToken"]) {
          refreshTokenObject = parsedCookie;
        }
      });
    } else {
      throw new Error("No Set-Cookie header found");
    }

    if (!accessTokenObject) {
      throw new Error("Access token not found in cookies");
    }

    if (!refreshTokenObject) {
      throw new Error("Refresh token not found in cookies");
    }

    await setCookie("accessToken", accessTokenObject.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 1000 * 60 * 60,
      path: accessTokenObject.Path || "/",
      sameSite: accessTokenObject["SameSite"] || "none",
    });

    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge:
        parseInt(refreshTokenObject["Max-Age"]) || 1000 * 60 * 60 * 24 * 90,
      path: refreshTokenObject.Path || "/",
      sameSite: refreshTokenObject["SameSite"] || "none",
    });

    const verifiedToken: JwtPayload | string = jwt.verify(
      accessTokenObject.accessToken,
      process.env.JWT_SECRET as string
    );

    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token");
    }

    const userRole: UserRole = verifiedToken.role;

    if (!result.success) {
      throw new Error(result.message || "Login failed");
    }

    if (redirectTo) {
      const requestedPath = redirectTo.toString();
      if (isValidRedirectForRole(requestedPath, userRole)) {
        redirect(`${requestedPath}?loggedIn=true`);
      } else {
        redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
      }
    } else {
      redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
    }
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.log(error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Login Failed. You might have entered incorrect email or password."
      }`,
    };
  }
};

// ==================== REGISTER PATIENT (TOURIST) ====================

export const registerPatient = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    const payload = {
      name: formData.get("name"),
      address: formData.get("address"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (
      zodValidator(payload, registerPatientValidationZodSchema).success ===
      false
    ) {
      return zodValidator(payload, registerPatientValidationZodSchema);
    }

    const validatedPayload: any = zodValidator(
      payload,
      registerPatientValidationZodSchema
    ).data;
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

    if (formData.get("file")) {
      newFormData.append("file", formData.get("file") as Blob);
    }

    const res = await serverFetch.post("/users/create-tourist", {
      body: newFormData,
    });

    const result = await res.json();

    if (result.success) {
      await loginUser(_currentState, formData);
    }

    return result;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.log(error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration Failed. Please try again."
      }`,
    };
  }
};

// ==================== CREATE HOST ====================

export const createHost = async (
  prevState: AuthResponse | null,
  formData: FormData
): Promise<AuthResponse> => {
  try {
    const data = {
      password: formData.get("password") as string,
      host: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        profilePhoto: (formData.get("profilePhoto") as string) || "",
        phone: (formData.get("phone") as string) || "",
        bio: (formData.get("bio") as string) || "",
        hometown: (formData.get("hometown") as string) || "",
        visitedLocations: JSON.parse(
          (formData.get("visitedLocations") as string) || "[]"
        ),
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
        errors: Object.entries(validationResult.errors || {}).map(
          ([field, messages]) => ({
            field,
            message: (messages as string[])?.[0] || `Invalid ${field}`,
          })
        ),
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
    };
  }
};

// ==================== CHANGE PASSWORD ====================

export const changePassword = async (
  prevState: AuthResponse | null,
  formData: FormData
): Promise<AuthResponse> => {
  try {
    const data = {
      oldPassword: formData.get("oldPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validationResult = zodValidator(
      data,
      changePasswordValidationZodSchema
    );
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: Object.entries(validationResult.errors || {}).map(
          ([field, messages]) => ({
            field,
            message: (messages as string[])?.[0] || `Invalid ${field}`,
          })
        ),
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

    const validationResult = zodValidator(
      { email },
      forgotPasswordValidationZodSchema
    );
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: Object.entries(validationResult.errors || {}).map(
          ([field, messages]) => ({
            field,
            message: (messages as string[])?.[0] || `Invalid ${field}`,
          })
        ),
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
    };
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "Failed to send reset link. Please try again.",
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

    const data = {
      password: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validationResult = zodValidator(
      data,
      resetPasswordValidationZodSchema
    );
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: Object.entries(validationResult.errors || {}).map(
          ([field, messages]) => ({
            field,
            message: (messages as string[])?.[0] || `Invalid ${field}`,
          })
        ),
        formData: { ...data, userId, token },
      };
    }
    // if (!validationResult.success) {
    //   return {
    //     success: false,
    //     message: "Validation failed",
    //     errors: Object.entries(
    //       validationResult.error?.flatten().fieldErrors || {}
    //     ).map(([field, messages]) => ({
    //       field,
    //       message: messages?.[0] || `Invalid ${field}`,
    //     })),
    //     formData: { ...data, userId, token },
    //   };
    // }

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
      };
    }
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.message || "Failed to reset password. Please try again.",
    };
  }
};

// ==================== LOGOUT ====================

export const logoutUser = async () => {
  try {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    redirect("/login?loggedOut=true");
  } catch (error) {
    console.error("Logout error:", error);
    redirect("/login?loggedOut=true");
  }
};

// ==================== GET CURRENT USER ====================

export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const res = await serverFetch.get("/auth/me");
    const result = await res.json();
    console.log(result, "From Auth");

    if (result.success && result.data) {
      return result.data as UserInfo;
    }

    return null;
  } catch (error: any) {
    console.error("Get current user error:", error);
    return null;
  }
};

// Alternative with AuthResponse wrapper if needed elsewhere:`
export const getUserInfoWithResponse = async (): Promise<AuthResponse> => {
  try {
    const res = await serverFetch.get("/users/me");
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
      message: result.message || "Failed to get user data",
    };
  } catch (error: any) {
    console.error("Get current user error:", error);
    return {
      success: false,
      message: "Failed to get user data. Please login again.",
    };
  }
};

// ==================== REFRESH TOKEN ====================

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const res = await serverFetch.post("/auth/refresh-token");
    const result = await res.json();

    if (result.success) {
      return {
        success: true,
        message: "Token refreshed successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to refresh token",
    };
  } catch (error: any) {
    console.error("Refresh token error:", error);
    return {
      success: false,
      message: "Session expired. Please login again.",
    };
  }
};

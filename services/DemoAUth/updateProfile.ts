// // File: updateProfile.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

// import { serverFetch } from "@/lib/server-fetch";
// import { zodValidator } from "@/lib/zodValidator";
// import {
//   updateTouristProfileValidationZodSchema,
//   updateHostProfileValidationZodSchema,
//   updateAdminProfileValidationZodSchema,
// } from "@/zod/profile.validation";
// import { getUserInfo } from "./getUserInfo";

// export interface UpdateProfileResponse {
//   success: boolean;
//   message?: string;
//   data?: any;
//   errors?: Array<{ field: string; message: string }>;
//   formData?: any;
// }

// export interface UpdateProfileResponse {
//   success: boolean;
//   message?: string;
//   data?: any;
//   errors?: Array<{ field: string; message: string }>;
//   formData?: any;
// }

// // ==================== UPDATE PROFILE ====================

// export const updateProfile = async (
//   formData: FormData
// ): Promise<UpdateProfileResponse> => {
//   try {
//     // Get current user info to determine role
//     const userInfo = await getUserInfo();

//     if (!userInfo || !userInfo.role) {
//       return {
//         success: false,
//         message: "User not authenticated",
//         errors: [
//           { field: "general", message: "Please login to update profile" },
//         ],
//       };
//     }

//     // Create a clean data object
//     const data: any = {};

//     // Get all form entries
//     for (const [key, value] of formData.entries()) {
//       // Skip file field for now (we'll handle it separately)
//       if (key !== "file") {
//         data[key] = value.toString();
//       }
//     }

//     // Handle file upload
//     const file = formData.get("file");
//     if (file instanceof File && file.size > 0) {
//       // File will be handled by FormData
//     }

//     // Prepare request payload
//     const requestData = new FormData();

//     // Append JSON data
//     requestData.append("data", JSON.stringify(data));

//     // Append file if exists and is a valid file
//     if (file instanceof File && file.size > 0) {
//       requestData.append("file", file);
//     }

//     // Make API request
//     const res = await serverFetch.patch("/users/update-my-profile", {
//       body: requestData,
//     });

//     const result = await res.json();

//     if (result.success) {
//       return {
//         success: false,
//         message: result.message || "Profile updated successfully!",
//         data: result.data,
//       };
//     }

//     return {
//       success: false,
//       message: result.message || "Failed to update profile",
//       formData: data,
//       errors: [
//         { field: "general", message: result.message || "Update failed" },
//       ],
//     };
//   } catch (error: any) {
//     console.error("Update profile error:", error);

//     // Handle specific error cases
//     if (
//       error.message?.includes("unauthorized") ||
//       error.message?.includes("authentication")
//     ) {
//       return {
//         success: false,
//         message: "Session expired. Please login again.",
//         errors: [{ field: "general", message: "Authentication required" }],
//       };
//     }

//     return {
//       success: false,
//       message: error.message || "Failed to update profile. Please try again.",
//     };
//   }
// };

// // Helper function to parse form data based on role
// const parseFormData = (formData: FormData, role: string): any => {
//   const data: any = {};

//   // Common fields
//   const name = formData.get("name");
//   if (name) data.name = name.toString();

//   const profilePhoto = formData.get("profilePhoto");
//   if (profilePhoto && profilePhoto instanceof File && profilePhoto.size === 0) {
//     // Handle file removal case
//     data.profilePhoto = "";
//   }

//   // Role-specific fields
//   switch (role) {
//     case "TOURIST":
//       const phone = formData.get("phone");
//       if (phone) data.phone = phone.toString();

//       const bio = formData.get("bio");
//       if (bio) data.bio = bio.toString();

//       const hometown = formData.get("hometown");
//       if (hometown) data.hometown = hometown.toString();

//       const visitedLocations = formData.get("visitedLocations");
//       if (visitedLocations) {
//         try {
//           data.visitedLocations = JSON.parse(visitedLocations.toString());
//         } catch {
//           data.visitedLocations = visitedLocations
//             .toString()
//             .split(",")
//             .map((loc: string) => loc.trim())
//             .filter(Boolean);
//         }
//       }

//       break;

//     case "HOST":
//       const hostPhone = formData.get("phone");
//       if (hostPhone) data.phone = hostPhone.toString();

//       const hostBio = formData.get("bio");
//       if (hostBio) data.bio = hostBio.toString();

//       const hostHometown = formData.get("hometown");
//       if (hostHometown) data.hometown = hostHometown.toString();

//       const hostVisitedLocations = formData.get("visitedLocations");
//       if (hostVisitedLocations) {
//         try {
//           data.visitedLocations = JSON.parse(hostVisitedLocations.toString());
//         } catch {
//           data.visitedLocations = hostVisitedLocations
//             .toString()
//             .split(",")
//             .map((loc: string) => loc.trim())
//             .filter(Boolean);
//         }
//       }

//       const isVerified = formData.get("isVerified");
//       if (isVerified) data.isVerified = isVerified.toString() === "true";

//       const tourLimit = formData.get("tourLimit");
//       if (tourLimit) data.tourLimit = parseInt(tourLimit.toString());

//       const currentTourCount = formData.get("currentTourCount");
//       if (currentTourCount)
//         data.currentTourCount = parseInt(currentTourCount.toString());

//       const subscriptionId = formData.get("subscriptionId");
//       if (subscriptionId) data.subscriptionId = subscriptionId.toString();

//       break;

//     case "ADMIN":
//       const contactNumber = formData.get("contactNumber");
//       if (contactNumber) data.contactNumber = contactNumber.toString();
//       break;
//   }

//   return data;
// };

// // ==================== CHANGE PASSWORD ====================
// // This function can be merged with your existing auth.ts or kept separate

// export const changePassword = async (
//   prevState: UpdateProfileResponse | null,
//   formData: FormData
// ): Promise<UpdateProfileResponse> => {
//   try {
//     const data = {
//       oldPassword: formData.get("oldPassword") as string,
//       newPassword: formData.get("newPassword") as string,
//       confirmPassword: formData.get("confirmPassword") as string,
//     };

//     // Frontend validation
//     const errors: Array<{ field: string; message: string }> = [];

//     if (!data.oldPassword) {
//       errors.push({
//         field: "oldPassword",
//         message: "Current password is required",
//       });
//     }

//     if (!data.newPassword) {
//       errors.push({
//         field: "newPassword",
//         message: "New password is required",
//       });
//     } else if (data.newPassword.length < 6) {
//       errors.push({
//         field: "newPassword",
//         message: "Password must be at least 6 characters",
//       });
//     }

//     if (!data.confirmPassword) {
//       errors.push({
//         field: "confirmPassword",
//         message: "Confirm password is required",
//       });
//     }

//     if (
//       data.newPassword &&
//       data.confirmPassword &&
//       data.newPassword !== data.confirmPassword
//     ) {
//       errors.push({
//         field: "confirmPassword",
//         message: "Passwords do not match",
//       });
//     }

//     if (
//       data.oldPassword &&
//       data.newPassword &&
//       data.oldPassword === data.newPassword
//     ) {
//       errors.push({
//         field: "newPassword",
//         message: "New password must be different from current password",
//       });
//     }

//     if (errors.length > 0) {
//       return {
//         success: false,
//         errors,
//         formData: data,
//         message: "Please fix the errors below",
//       };
//     }

//     // Call API
//     const res = await serverFetch.post("/auth/change-password", {
//       body: JSON.stringify({
//         oldPassword: data.oldPassword,
//         newPassword: data.newPassword,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const result = await res.json();

//     if (result.success) {
//       return {
//         success: true,
//         message: result.message || "Password changed successfully!",
//         data: result.data,
//       };
//     }

//     return {
//       success: false,
//       message: result.message || "Failed to change password",
//       formData: data,
//       errors: [
//         {
//           field: "oldPassword",
//           message: result.message || "Invalid credentials",
//         },
//       ],
//     };
//   } catch (error: any) {
//     console.error("Change password error:", error);
//     return {
//       success: false,
//       message: error.message || "Failed to change password. Please try again.",
//     };
//   }
// };

// // ==================== GET PROFILE DATA ====================

// export const getProfileData = async (): Promise<UpdateProfileResponse> => {
//   try {
//     // This uses the existing getUserInfo but returns formatted for profile update
//     const userInfo = await getUserInfo();

//     if (!userInfo || !userInfo.id) {
//       return {
//         success: false,
//         message: "User not authenticated",
//       };
//     }

//     // Format data for profile update form
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

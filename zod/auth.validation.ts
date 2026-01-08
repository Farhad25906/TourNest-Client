import { z } from "zod";

// Login validation
export const loginValidationSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const loginValidationZodSchema = loginValidationSchema;

// Change password validation
export const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(1, "New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
.refine((data) => data.oldPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

export const changePasswordValidationZodSchema = changePasswordValidationSchema;

// Forgot password validation
export const forgotPasswordValidationSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const forgotPasswordValidationZodSchema = forgotPasswordValidationSchema;

// Reset password validation
export const resetPasswordValidationSchema = z.object({
  password: z.string()
    .min(1, "New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const resetPasswordValidationZodSchema = resetPasswordValidationSchema;

// Patient registration (Tourist)
export const registerPatientValidationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email is too long"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password is too long"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  address: z.string().max(500, "Address is too long").optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const registerPatientValidationZodSchema = registerPatientValidationSchema;

// Export types
export type LoginFormData = z.infer<typeof loginValidationSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordValidationSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordValidationSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordValidationSchema>;
export type RegisterPatientFormData = z.infer<typeof registerPatientValidationSchema>;
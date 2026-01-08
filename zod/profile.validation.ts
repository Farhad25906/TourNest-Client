import { z } from "zod";

// Common schemas
const nameSchema = z.string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters");

const phoneSchema = z.string()
  .regex(/^[+]?[0-9\s\-()]{10,20}$/, "Invalid phone number")
  .optional()
  .nullable();

const bioSchema = z.string()
  .max(500, "Bio must be less than 500 characters")
  .optional()
  .nullable();

const hometownSchema = z.string()
  .max(100, "Hometown must be less than 100 characters")
  .optional()
  .nullable();

const profilePhotoSchema = z.string()
  .url("Profile photo must be a valid URL")
  .optional()
  .or(z.literal(""));

const contactNumberSchema = z.string()
  .regex(/^[+]?[0-9\s\-()]{10,20}$/, "Invalid contact number")
  .optional();

// Update tourist profile validation
export const updateTouristProfileValidationSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
  bio: bioSchema,
  hometown: hometownSchema,
  profilePhoto: profilePhotoSchema,
  visitedLocations: z.array(z.string().max(100, "Location name too long"))
    .max(50, "Too many visited locations")
    .optional(),
}).partial();

export const updateTouristProfileValidationZodSchema = updateTouristProfileValidationSchema;

// Update host profile validation
export const updateHostProfileValidationSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
  bio: bioSchema,
  hometown: hometownSchema,
  profilePhoto: profilePhotoSchema,
  visitedLocations: z.array(z.string().max(100, "Location name too long"))
    .max(50, "Too many visited locations")
    .optional(),
  isVerified: z.boolean().optional(),
  tourLimit: z.number().int().min(0).max(100).optional(),
  currentTourCount: z.number().int().min(0).max(100).optional(),
  subscriptionId: z.string().max(50, "Subscription ID too long").optional().nullable(),
}).partial();

export const updateHostProfileValidationZodSchema = updateHostProfileValidationSchema;

// Update admin profile validation
export const updateAdminProfileValidationSchema = z.object({
  name: nameSchema.optional(),
  contactNumber: contactNumberSchema,
  profilePhoto: profilePhotoSchema,
}).partial();

export const updateAdminProfileValidationZodSchema = updateAdminProfileValidationSchema;

// Export types
export type UpdateTouristProfileInput = z.infer<typeof updateTouristProfileValidationSchema>;
export type UpdateHostProfileInput = z.infer<typeof updateHostProfileValidationSchema>;
export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileValidationSchema>;
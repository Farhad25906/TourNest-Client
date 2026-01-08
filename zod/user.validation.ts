import { USER_STATUS } from "@/constants/user.constants";
import { z } from "zod";


// Common schemas
const nameSchema = z.string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters");

const emailSchema = z.string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .max(100, "Email must be less than 100 characters");

const passwordSchema = z.string()
  .min(6, "Password must be at least 6 characters")
  .max(50, "Password must be less than 50 characters");

const profilePhotoSchema = z.string()
  .url("Profile photo must be a valid URL")
  .optional()
  .or(z.literal(""));

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

// Tourist schemas
export const createTouristValidationSchema = z.object({
  password: passwordSchema,
  tourist: z.object({
    name: nameSchema,
    email: emailSchema,
    profilePhoto: profilePhotoSchema,
    bio: bioSchema,
    interests: z.string().max(200, "Interests too long").optional(),
    location: z.string().max(100, "Location too long").optional(),
    visitedCountries: z.string().max(200, "Visited countries list too long").optional(),
  })
});

export const updateTouristValidationSchema = z.object({
  name: nameSchema.optional(),
  profilePhoto: profilePhotoSchema,
  phone: phoneSchema,
  bio: bioSchema,
  hometown: hometownSchema,
  visitedLocations: z.array(z.string().max(100, "Location name too long"))
    .max(50, "Too many visited locations")
    .optional(),
  isVerified: z.boolean().optional(),
  tourLimit: z.number().int().min(0).max(100).optional(),
  currentTourCount: z.number().int().min(0).max(100).optional(),
  subscriptionId: z.string().max(50, "Subscription ID too long").optional().nullable(),
}).partial();

// Admin schemas
export const createAdminValidationSchema = z.object({
  password: passwordSchema,
  admin: z.object({
    name: nameSchema,
    email: emailSchema,
    profilePhoto: profilePhotoSchema,
    contactNumber: z.string()
      .regex(/^[+]?[0-9\s\-()]{10,20}$/, "Invalid contact number")
      .optional(),
  })
});

export const updateAdminValidationSchema = z.object({
  name: nameSchema.optional(),
  profilePhoto: profilePhotoSchema,
  contactNumber: z.string()
    .regex(/^[+]?[0-9\s\-()]{10,20}$/, "Invalid contact number")
    .optional(),
}).partial();

// Host schemas
export const createHostValidationSchema = z.object({
  password: passwordSchema,
  host: z.object({
    name: nameSchema,
    email: emailSchema,
    profilePhoto: profilePhotoSchema,
    phone: phoneSchema,
    bio: bioSchema,
    hometown: hometownSchema,
    visitedLocations: z.array(z.string().max(100, "Location name too long"))
      .max(50, "Too many visited locations")
      .optional()
      .default([]),
    isVerified: z.boolean().optional().default(false),
    tourLimit: z.number().int().min(0).max(100).optional().default(3),
    currentTourCount: z.number().int().min(0).max(100).optional().default(0),
    subscriptionId: z.string().max(50, "Subscription ID too long").optional(),
  })
});

export const updateHostValidationSchema = z.object({
  name: nameSchema.optional(),
  profilePhoto: profilePhotoSchema,
  phone: phoneSchema,
  bio: bioSchema,
  hometown: hometownSchema,
  visitedLocations: z.array(z.string().max(100, "Location name too long"))
    .max(50, "Too many visited locations")
    .optional(),
  isVerified: z.boolean().optional(),
  tourLimit: z.number().int().min(0).max(100).optional(),
  currentTourCount: z.number().int().min(0).max(100).optional(),
  subscriptionId: z.string().max(50, "Subscription ID too long").optional(),
}).partial();

// Status update
export const updateStatusValidationSchema = z.object({
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.SUSPENDED, USER_STATUS.INACTIVE]),
});

// Export validation zod schemas
export const createTouristValidationZodSchema = createTouristValidationSchema;
export const updateTouristValidationZodSchema = updateTouristValidationSchema;
export const createAdminValidationZodSchema = createAdminValidationSchema;
export const updateAdminValidationZodSchema = updateAdminValidationSchema;
export const createHostValidationZodSchema = createHostValidationSchema;
export const updateHostValidationZodSchema = updateHostValidationSchema;
export const updateStatusValidationZodSchema = updateStatusValidationSchema;

// Export types
export type CreateTouristInput = z.infer<typeof createTouristValidationSchema>;
export type UpdateTouristInput = z.infer<typeof updateTouristValidationSchema>;
export type CreateAdminInput = z.infer<typeof createAdminValidationSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminValidationSchema>;
export type CreateHostInput = z.infer<typeof createHostValidationSchema>;
export type UpdateHostInput = z.infer<typeof updateHostValidationSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusValidationSchema>;
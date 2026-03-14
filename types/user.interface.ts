import { UserRole } from "@/lib/auth-utils";

// export type UserRole = "ADMIN" | "HOST" | "TOURIST" | "USER";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  role: UserRole;
  status?: UserStatus;
  admin?: AdminInfo;
  host?: HostInfo;
  tourist?: TouristInfo;
  user?: TouristInfo; // Alias for tourist
  needPasswordChange?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  socialLinks?: SocialLinks;
  preferenceSettings?: PreferenceSettings;
}

export interface HostInfo {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  phone?: string;
  bio?: string;
  hometown?: string;
  visitedLocations?: string[];
  isVerified?: boolean;
  tourLimit?: number;
  currentTourCount?: number;
  subscriptionId?: string;
  isDeleted: boolean;
  blogLimit: number;
  currentBlogCount: number;
  stripeCustomerId?: string | null;

  balance: string;
  totalEarnings: string;
  lastPayoutAt?: string | null;

  averageRating?: number;
  totalReviews: number;

  socialLinks?: SocialLinks;
  achievements?: string[];
  languages?: string[];
  emergencyContact?: EmergencyContact;
  favorites?: string[];
  preferenceSettings?: PreferenceSettings;
  followerCount?: number;

  createdAt: string;
  updatedAt: string;
}

export interface TouristInfo {
  id: string;
  name: string;
  email: string;

  profilePhoto?: string | null;
  bio?: string | null;
  interests?: string | null;
  location?: string | null;
  visitedCountries?: string | null;

  totalSpent?: string;
  isDeleted: boolean;

  socialLinks?: SocialLinks;
  achievements?: string[];
  languages?: string[];
  emergencyContact?: EmergencyContact;
  favorites?: string[];
  preferenceSettings?: PreferenceSettings;

  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface PreferenceSettings {
  theme?: "light" | "dark";
  notifications?: boolean;
  language?: string;
}

// Request interfaces
export interface CreateTouristRequest {
  password: string;
  tourist: Omit<TouristInfo, "profilePhoto"> & {
    name: string;
    email: string;
    profilePhoto?: string;
  };
}

export interface CreateAdminRequest {
  password: string;
  admin: Omit<AdminInfo, "profilePhoto"> & {
    name: string;
    email: string;
    profilePhoto?: string;
  };
}

export interface CreateHostRequest {
  password: string;
  host: Omit<HostInfo, "profilePhoto"> & {
    name: string;
    email: string;
    profilePhoto?: string;
  };
}

export interface UpdateTouristProfile {
  name?: string;
  profilePhoto?: string;
  bio?: string | null;
  contactNumber?: string | null;
  interests?: string | null;
  location?: string | null;
  visitedCountries?: string | null;
}

export interface UpdateHostProfile {
  name?: string;
  profilePhoto?: string;
  phone?: string;
  bio?: string;
  hometown?: string;
  visitedLocations?: string[];
  isVerified?: boolean;
  tourLimit?: number;
  currentTourCount?: number;
  subscriptionId?: string;
}

export interface UpdateAdminProfile {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
}

export interface UpdateStatusRequest {
  status: UserStatus;
}

export interface UserFilterParams {
  searchTerm?: string;
  status?: UserStatus;
  role?: UserRole;
  email?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

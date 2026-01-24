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

  createdAt: string;
  updatedAt: string;
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
  phone?: string | null;
  bio?: string | null;
  hometown?: string | null;
  visitedLocations?: string[];
  isVerified?: boolean;
  tourLimit?: number;
  currentTourCount?: number;
  subscriptionId?: string | null;
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

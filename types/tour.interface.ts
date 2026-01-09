/* eslint-disable @typescript-eslint/no-explicit-any */
export const CATEGORIES = [
  'ADVENTURE', 'CULTURE', 'BEACH', 'MOUNTAIN', 'URBAN', 'NATURE', 'FOOD',"RELAXATION"
] as const;
 

export const DIFFICULTIES = ['EASY', 'MODERATE', 'DIFFICULT', 'EXTREME'] as const;

export type TourCategory = typeof CATEGORIES[number];
export type DifficultyLevel = typeof DIFFICULTIES[number];

export type ItineraryItem = {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation?: string;
  meals?: string[];
};

export type TourItinerary = ItineraryItem[];

export interface ITour {
  id: string;
  title: string;
  description: string;
  destination: string;
  city: string;
  country: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  price: number;
  maxGroupSize: number;
  currentGroupSize: number;
  category: TourCategory;
  difficulty: DifficultyLevel;
  included: string[];
  excluded: string[];
  itinerary: TourItinerary | any;
  meetingPoint: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  hostId: string;
  createdAt: Date;
  updatedAt: Date;
  bookingCount?: number;
  host?: {
    id: string;
    name: string;
    profilePhoto: string | null;
    bio: string | null;
  };
}

export type CreateTourInput = {
  title: string;
  description: string;
  destination: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  duration: number;
  price: number;
  maxGroupSize: number;
  category: TourCategory;
  difficulty: DifficultyLevel;
  included: string[];
  excluded: string[];
  itinerary?: TourItinerary | any;
  meetingPoint: string;
  images?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
};

export type UpdateTourInput = Partial<CreateTourInput>;

export interface HostTourFilters {
  searchTerm?: string;
  destination?: string;
  city?: string;
  country?: string;
  category?: string;
  difficulty?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface HostTourStats {
  totalTours: number;
  activeTours: number;
  featuredTours: number;
  totalViews: number;
  upcomingTours: number;
  pastTours: number;
  totalBookings: number;
  confirmedBookings: number;
  toursByCategory: Record<string, number>;
  toursByStatus: {
    active: number;
    inactive: number;
    featured: number;
  };
  recentTours: Array<{
    id: string;
    title: string;
    createdAt: Date;
    status: string;
    views: number;
    bookingCount: number;
  }>;
  tourLimit: number;
  currentTourCount: number;
  tourCreationAvailable: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TourFilters {
  searchTerm?: string;
  destination?: string;
  city?: string;
  country?: string;
  category?: TourCategory;
  difficulty?: DifficultyLevel;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  hostId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
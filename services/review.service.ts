/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

// ==================== INTERFACES ====================

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
  isApproved?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  tourist?: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
  host?: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
  tour?: {
    id: string;
    title: string;
    destination: string;
    images?: string[];
  };
  booking?: {
    id: string;
    bookingDate: string;
    numberOfPeople: number;
    totalAmount: number;
  };
}

export interface ReviewFilters {
  searchTerm?: string;
  rating?: number;
  hostId?: string;
  touristId?: string;
  tourId?: string;
  minRating?: number;
  maxRating?: number;
  isApproved?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentReviews: Array<{
    rating: number;
    createdAt: string;
    tourTitle?: string;
    touristName?: string;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Record<string, string[]>;
}

// ==================== CREATE REVIEW ====================

export const createReview = async (
  reviewData: CreateReviewInput
): Promise<ApiResponse<Review>> => {
  try {
    console.log("Creating review with data:", reviewData);

    // Make API call
    const res = await serverFetch.post("/reviews", {
      body: JSON.stringify(reviewData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let result;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      result = await res.json();
    } else {
      const text = await res.text();
      console.error("Non-JSON response:", text);
      return {
        success: false,
        message: "Server returned invalid response",
      };
    }

    console.log("API response:", result);

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || `HTTP error! status: ${res.status}`,
        errors: result?.errors,
      };
    }

    if (result.success) {
      // Revalidate cache
      revalidateTag("my-reviews", "my-reviews-profile");
      revalidateTag("tour-reviews", "tour-reviews-profile");
      revalidateTag("host-reviews", "host-reviews-profile");
      revalidateTag(
        `booking-${reviewData.bookingId}`,
        `booking-${reviewData.bookingId}-profile`
      );

      return {
        success: true,
        message: "Review created successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to create review",
      errors: result.errors,
    };
  } catch (error: any) {
    console.error("Create review error:", error);
    return {
      success: false,
      message: error.message || "Failed to create review. Please try again.",
    };
  }
};

// ==================== UPDATE REVIEW ====================

export const updateReview = async (
  reviewId: string,
  updateData: UpdateReviewInput
): Promise<ApiResponse<Review>> => {
  try {
    const res = await serverFetch.patch(`/reviews/${reviewId}`, {
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || `HTTP error! status: ${res.status}`,
        errors: result?.errors,
      };
    }

    if (result.success) {
      // Revalidate cache
      revalidateTag("my-reviews", "my-reviews-profile");
      revalidateTag("tour-reviews", "tour-reviews-profile");
      revalidateTag("host-reviews", "host-reviews-profile");
      revalidateTag(`review-${reviewId}`, `review-${reviewId}-profile`);
      revalidateTag("all-reviews-admin", "all-reviews-admin-profile");
      return {
        success: true,
        message: "Review updated successfully!",
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Update review error:", error);
    return {
      success: false,
      message: error.message || "Failed to update review. Please try again.",
    };
  }
};

// ==================== DELETE REVIEW ====================

export async function deleteReview(reviewId: string): Promise<ApiResponse> {
  try {
    const response = await serverFetch.delete(`/reviews/${reviewId}`);
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || `HTTP error! status: ${response.status}`,
      };
    }

    if (result.success) {
      revalidateTag("my-reviews", "my-reviews-profile");
      revalidateTag("tour-reviews", "tour-reviews-profile");
      revalidateTag("host-reviews", "host-reviews-profile");
      revalidateTag(`review-${reviewId}`, `review-${reviewId}-profile`);
      revalidateTag("all-reviews-admin", "all-reviews-admin-profile");

      return {
        success: true,
        message: "Review deleted successfully",
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Delete review error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete review",
    };
  }
}

// ==================== GET ALL REVIEWS (ADMIN) ====================

export async function getAllReviews(
  filters?: ReviewFilters
): Promise<ApiResponse<Review[]>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    // Only append default values if not explicitly provided in filters
    if (!filters?.page && queryParams.get("page") === null) {
      queryParams.append("page", "1");
    }
    if (!filters?.limit && queryParams.get("limit") === null) {
      queryParams.append("limit", "10");
    }
    if (!filters?.sortBy && queryParams.get("sortBy") === null) {
      queryParams.append("sortBy", "createdAt");
    }
    if (!filters?.sortOrder && queryParams.get("sortOrder") === null) {
      queryParams.append("sortOrder", "desc");
    }

    const queryString = queryParams.toString();

    const response = await serverFetch.get(`/reviews`, {
      next: {
        tags: ["all-reviews-admin"],
        revalidate: 30,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Get all reviews error response:", error);
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
        data: [],
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Reviews fetched successfully",
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get all reviews error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch reviews",
    };
  }
}

// ==================== GET SINGLE REVIEW ====================

export async function getSingleReview(
  reviewId: string
): Promise<ApiResponse<Review>> {
  try {
    const response = await serverFetch.get(`/reviews/${reviewId}`, {
      next: {
        tags: [`review-${reviewId}`],
        revalidate: 60,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: "Review fetched successfully",
        data: result.data as Review,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Get single review error:", error);
    return {
      success: false,
      message: "Failed to fetch review details",
    };
  }
}

// ==================== GET TOUR REVIEWS ====================

export async function getTourReviews(
  tourId: string,
  filters?: {
    minRating?: number;
    maxRating?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
): Promise<ApiResponse<any>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    // Only append default values if not explicitly provided in filters
    if (!filters?.page && queryParams.get("page") === null) {
      queryParams.append("page", "1");
    }
    if (!filters?.limit && queryParams.get("limit") === null) {
      queryParams.append("limit", "10");
    }
    if (!filters?.sortBy && queryParams.get("sortBy") === null) {
      queryParams.append("sortBy", "createdAt");
    }
    if (!filters?.sortOrder && queryParams.get("sortOrder") === null) {
      queryParams.append("sortOrder", "desc");
    }

    const queryString = queryParams.toString();

    const response = await serverFetch.get(
      `/reviews/tour/${tourId}${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: [`tour-reviews-${tourId}`],
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: "Tour reviews fetched successfully",
      data: result.data,
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get tour reviews error:", error);
    return {
      success: false,
      data: null,
      message: "Failed to fetch tour reviews",
    };
  }
}

// ==================== GET HOST REVIEWS ====================

export async function getHostReviews(
  hostId: string,
  filters?: {
    minRating?: number;
    maxRating?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
): Promise<ApiResponse<Review[]>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    // Only append default values if not explicitly provided in filters
    if (!filters?.page && queryParams.get("page") === null) {
      queryParams.append("page", "1");
    }
    if (!filters?.limit && queryParams.get("limit") === null) {
      queryParams.append("limit", "10");
    }
    if (!filters?.sortBy && queryParams.get("sortBy") === null) {
      queryParams.append("sortBy", "createdAt");
    }
    if (!filters?.sortOrder && queryParams.get("sortOrder") === null) {
      queryParams.append("sortOrder", "desc");
    }

    const queryString = queryParams.toString();

    const response = await serverFetch.get(`/reviews/my-reviews`, {
      next: {
        tags: [`host-reviews-${hostId}`],
        revalidate: 60,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: "Host reviews fetched successfully",
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get host reviews error:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch host reviews",
    };
  }
}

// ==================== GET MY REVIEWS ====================

export async function getMyReviews(
  filters?: ReviewFilters
): Promise<ApiResponse<Review[]>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    // Only append default values if not explicitly provided in filters
    // Check if the key exists in queryParams, not just in filters
    if (!queryParams.has("page")) {
      queryParams.append("page", "1");
    }
    if (!queryParams.has("limit")) {
      queryParams.append("limit", "10");
    }
    if (!queryParams.has("sortBy")) {
      queryParams.append("sortBy", "createdAt");
    }
    if (!queryParams.has("sortOrder")) {
      queryParams.append("sortOrder", "desc");
    }

    const queryString = queryParams.toString();

    const response = await serverFetch.get(`/reviews/my-reviews`, {
      next: {
        tags: ["my-reviews"],
        revalidate: 30,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Get my reviews error response:", errorText);
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
        data: [],
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Reviews fetched successfully",
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get my reviews error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch your reviews",
    };
  }
}

// ==================== GET REVIEW STATISTICS ====================

export async function getReviewStats(
  hostId?: string,
  touristId?: string
): Promise<ApiResponse<ReviewStats>> {
  try {
    const queryParams = new URLSearchParams();

    if (hostId) queryParams.append("hostId", hostId);
    if (touristId) queryParams.append("touristId", touristId);

    const queryString = queryParams.toString();

    const response = await serverFetch.get(
      `/reviews/stats/summary${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: [`review-stats-${hostId || touristId || "global"}`],
          revalidate: 120,
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: "Review statistics fetched successfully",
        data: result.data as ReviewStats,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Get review stats error:", error);
    return {
      success: false,
      message: "Failed to fetch review statistics",
    };
  }
}

// ==================== APPROVE REVIEW ====================

export async function approveReview(
  reviewId: string,
  isApproved: boolean
): Promise<ApiResponse<Review>> {
  try {
    const response = await serverFetch.patch(`/reviews/${reviewId}`, {
      body: JSON.stringify({ isApproved }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || `HTTP error! status: ${response.status}`,
        errors: result?.errors,
      };
    }

    if (result.success) {
      // Revalidate cache
      revalidateTag("my-reviews", "my-reviews-profile");
      revalidateTag("tour-reviews", "tour-reviews-profile");
      revalidateTag("host-reviews", "host-reviews-profile");
      revalidateTag(`review-${reviewId}`, `review-${reviewId}-profile`);
      revalidateTag("all-reviews-admin", "all-reviews-admin-profile");
      return {
        success: true,
        message: `Review ${
          isApproved ? "approved" : "unapproved"
        } successfully!`,
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Approve review error:", error);
    return {
      success: false,
      message: "Failed to update review status",
    };
  }
}

// ==================== ADDITIONAL HELPER FUNCTIONS ====================

// Get recent reviews
export async function getRecentReviews(
  limit: number = 5
): Promise<ApiResponse<Review[]>> {
  try {
    const response = await serverFetch.get(
      `/reviews?limit=${limit}&sortBy=createdAt&sortOrder=desc&isApproved=true`,
      {
        next: {
          tags: ["recent-reviews"],
          revalidate: 60,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      message: "Recent reviews fetched successfully",
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get recent reviews error:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch recent reviews",
    };
  }
}

// Get top rated reviews
export async function getTopRatedReviews(
  minRating: number = 4,
  limit: number = 5
): Promise<ApiResponse<Review[]>> {
  try {
    const response = await serverFetch.get(
      `/reviews?minRating=${minRating}&limit=${limit}&sortBy=rating&sortOrder=desc&isApproved=true`,
      {
        next: {
          tags: ["top-rated-reviews"],
          revalidate: 120,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      message: "Top rated reviews fetched successfully",
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get top rated reviews error:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch top rated reviews",
    };
  }
}

// Search reviews
export async function searchReviews(
  query: string,
  filters?: ReviewFilters
): Promise<ApiResponse<Review[]>> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("searchTerm", query);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await serverFetch.get(
      `/reviews?${queryParams.toString()}`,
      {
        next: {
          tags: ["search-reviews"],
          revalidate: 60,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      message: "Reviews searched successfully",
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Search reviews error:", error);
    return {
      success: false,
      data: [],
      message: "Failed to search reviews",
    };
  }
}

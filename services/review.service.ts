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
  };
  booking?: {
    bookingDate: string;
    numberOfPeople: number;
  };
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
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// ==================== CREATE REVIEW ====================

export const createReview = async (
  reviewData: CreateReviewInput
): Promise<ApiResponse<Review>> => {
  try {
    console.log("Creating review with data:", reviewData);

    const res = await serverFetch.post("/reviews", {
      body: JSON.stringify(reviewData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("API Error:", result);
      return {
        success: false,
        message: result?.message || `HTTP error! status: ${res.status}`,
        errors: result?.errors,
      };
    }

    // Revalidate cache
    revalidateTag("my-reviews",`booking-${reviewData.bookingId}`);
    // revalidateTag();

    return {
      success: true,
      message: "Review created successfully!",
      data: result.data,
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

    // Revalidate cache
    revalidateTag("my-reviews","review-${reviewId}");

    return {
      success: true,
      message: "Review updated successfully!",
      data: result.data,
    };
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

    // Revalidate cache
    revalidateTag("my-reviews","reviews");

    return {
      success: true,
      message: "Review deleted successfully",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Delete review error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete review",
    };
  }
}

// ==================== GET ALL REVIEWS (ADMIN) ====================

export async function getAllReviews(): Promise<ApiResponse<Review[]>> {
  try {
    const response = await serverFetch.get(`/reviews`, {
      next: {
        tags: ["all-reviews-admin"],
        revalidate: 30,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch reviews`,
        data: [],
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: "Reviews fetched successfully",
      data: Array.isArray(result) ? result : result.data || [],
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
        message: `Review not found`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: "Review fetched successfully",
      data: result,
    };
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
  tourId: string
): Promise<ApiResponse<any>> {
  try {
    const response = await serverFetch.get(`/reviews/tour/${tourId}`, {
      next: {
        tags: [`tour-reviews-${tourId}`],
        revalidate: 60,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch tour reviews`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: "Tour reviews fetched successfully",
      data: result,
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
  hostId: string
): Promise<ApiResponse<Review[]>> {
  try {
    const response = await serverFetch.get(`/reviews/host/${hostId}`, {
      next: {
        tags: [`host-reviews-${hostId}`],
        revalidate: 60,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch host reviews`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: "Host reviews fetched successfully",
      data: Array.isArray(result) ? result : [],
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

export async function getMyReviews(): Promise<ApiResponse<Review[]>> {
  try {
    const response = await serverFetch.get(`/reviews/my-reviews`, {
      next: {
        tags: ["my-reviews"],
        revalidate: 30,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch your reviews`,
        data: [],
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: "Reviews fetched successfully",
      data: Array.isArray(result) ? result : result.data || [],
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
        message: `Failed to fetch review statistics`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: "Review statistics fetched successfully",
      data: result,
    };
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

    // Revalidate cache
    revalidateTag("my-reviews","review-${reviewId}");

    return {
      success: true,
      message: `Review ${isApproved ? "approved" : "unapproved"} successfully!`,
      data: result,
    };
  } catch (error: any) {
    console.error("Approve review error:", error);
    return {
      success: false,
      message: "Failed to update review status",
    };
  }
}

// ==================== GET RECENT REVIEWS ====================

export async function getRecentReviews(
  limit: number = 5
): Promise<ApiResponse<Review[]>> {
  try {
    const response = await serverFetch.get(`/reviews?limit=${limit}&isApproved=true`, {
      next: {
        tags: ["recent-reviews"],
        revalidate: 60,
      },
    });

    const result = await response.json();

    return {
      success: true,
      message: "Recent reviews fetched successfully",
      data: Array.isArray(result) ? result.slice(0, limit) : [],
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

// ==================== GET TOP RATED REVIEWS ====================

export async function getTopRatedReviews(
  limit: number = 5
): Promise<ApiResponse<Review[]>> {
  try {
    const response = await serverFetch.get(`/reviews?limit=${limit}&isApproved=true`, {
      next: {
        tags: ["top-rated-reviews"],
        revalidate: 120,
      },
    });

    const result = await response.json();

    // Filter and sort by rating on client side since backend doesn't support sorting
    const reviews = Array.isArray(result) ? result : [];
    const topRated = reviews
      .filter(review => review.rating >= 4)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    return {
      success: true,
      message: "Top rated reviews fetched successfully",
      data: topRated,
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
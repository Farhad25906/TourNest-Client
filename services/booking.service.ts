/* eslint-disable @typescript-eslint/no-explicit-any */
// services/booking.service.ts
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import {
  IBooking,
  IBookingFilters,
  IBookingStats,
  ApiResponse,
} from "@/types/booking.interface";

// ==================== CREATE & UPDATE SERVICES ====================

export const createBooking = async (bookingData: {
  tourId: string;
  numberOfPeople: number;
  totalAmount: number;
  specialRequests?: string;
  paymentMethod?: string;
}): Promise<ApiResponse<any>> => {
  try {
    console.log("Creating booking with data:", bookingData);

    // Make API call - matches backend createBooking endpoint
    const res = await serverFetch.post("/bookings", {
      body: JSON.stringify(bookingData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    console.log("API response:", result);

    if (result.success) {
      // Revalidate cache with required second parameter
      revalidateTag("my-bookings", "my-booking-stats");
      revalidateTag("host-bookings", "host-bookings-stats");

      return {
        success: true,
        message: "Booking created successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to create booking",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return {
      success: false,
      message: error.message || "Failed to create booking. Please try again.",
    };
  }
};

export const initiateBookingPayment = async (
  bookingId: string
): Promise<ApiResponse<any>> => {
  try {
    console.log("Initiating payment for booking:", bookingId);

    const res = await serverFetch.post(
      `/bookings/${bookingId}/initiate-payment`
    );
    const result = await res.json();

    if (result.success) {
      revalidateTag("my-bookings", "my-booking-stats");
      revalidateTag("host-bookings", "host-bookings-stats");

      return {
        success: true,
        message: "Payment initiated successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to initiate payment",
    };
  } catch (error: any) {
    console.error("Initiate payment error:", error);
    return {
      success: false,
      message: error.message || "Failed to initiate payment",
    };
  }
};

export const updateBooking = async (
  bookingId: string,
  updateData: {
    numberOfPeople?: number;
    totalAmount?: number;
    specialRequests?: string;
    status?: string;
    paymentStatus?: string;
    isReviewed?: boolean;
  }
): Promise<ApiResponse<IBooking>> => {
  try {
    console.log("Updating booking with data:", updateData);

    const res = await serverFetch.patch(`/bookings/${bookingId}`, {
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (result.success) {
      // Revalidate cache
      revalidateTag("my-bookings", "my-booking-stats");
      revalidateTag("host-bookings", "host-bookings-stats");

      return {
        success: true,
        message: "Booking updated successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update booking",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Booking update error:", error);
    return {
      success: false,
      message: error.message || "Failed to update booking. Please try again.",
    };
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: string
): Promise<ApiResponse<IBooking>> => {
  try {
    console.log("Updating booking status:", { bookingId, status });

    const res = await serverFetch.patch(`/bookings/${bookingId}/status`, {
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (result.success) {
      // Revalidate cache
      revalidateTag("my-bookings", "my-booking-stats");
      revalidateTag("host-bookings", "host-bookings-stats");

      return {
        success: true,
        message: "Booking status updated successfully!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update booking status",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Booking status update error:", error);
    return {
      success: false,
      message:
        error.message || "Failed to update booking status. Please try again.",
    };
  }
};

// ==================== GET SERVICES ====================

// Get all bookings (admin only) - matches backend getAllBookings
export async function getAllBookings(
  filters?: IBookingFilters
): Promise<ApiResponse<IBooking[]>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Convert numbers to string
          queryParams.append(key, String(value));
        }
      });
    }

    // Add default pagination if not provided - make sure these are numbers
    const page = filters?.page ? Number(filters.page) : 1;
    const limit = filters?.limit ? Number(filters.limit) : 10;
    const sortBy = filters?.sortBy || "createdAt";
    const sortOrder = filters?.sortOrder || "desc";

    // Set the query parameters with proper values
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortOrder", sortOrder);

    const queryString = queryParams.toString();

    const response = await serverFetch.get(
      `/bookings${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: ["all-bookings"],
          revalidate: 60,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      data: result.data || [],
      meta: result.meta,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get all bookings error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch bookings",
    };
  }
}

// Get my bookings (tourist) - matches backend getMyBookings
export async function getMyBookings(
  filters?: IBookingFilters
): Promise<ApiResponse<IBooking[]>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    // Add default pagination if not provided
    if (!filters?.page) queryParams.append("page", "1");
    if (!filters?.limit) queryParams.append("limit", "10");
    if (!filters?.sortBy) queryParams.append("sortBy", "bookingDate");
    if (!filters?.sortOrder) queryParams.append("sortOrder", "desc");

    const queryString = queryParams.toString();

    const response = await serverFetch.get(
      `/bookings/my-bookings${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: ["my-bookings"],
          revalidate: 30,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      data: result.data || [],
      meta: result.meta,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get my bookings error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch your bookings",
    };
  }
}

// Get host bookings - matches backend getHostBookings
export async function getHostBookings(
  filters?: IBookingFilters
): Promise<ApiResponse<IBooking[]>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    // Add default pagination if not provided
    if (!filters?.page) queryParams.append("page", "1");
    if (!filters?.limit) queryParams.append("limit", "10");
    if (!filters?.sortBy) queryParams.append("sortBy", "bookingDate");
    if (!filters?.sortOrder) queryParams.append("sortOrder", "desc");

    const queryString = queryParams.toString();

    const response = await serverFetch.get(
      `/bookings/host/my-bookings${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: ["host-bookings"],
          revalidate: 30,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      data: result.data || [],
      meta: result.meta,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get host bookings error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch host bookings",
    };
  }
}

// Get single booking - matches backend getSingleBooking
export async function getSingleBooking(
  bookingId: string
): Promise<ApiResponse<IBooking>> {
  try {
    const response = await serverFetch.get(`/bookings/${bookingId}`, {
      next: {
        tags: [`booking-${bookingId}`],
        revalidate: 60,
      },
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch booking",
    };
  } catch (error: any) {
    console.error("Get booking error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch booking details",
    };
  }
}

// Get booking payment info - matches backend getBookingPaymentInfo
export async function getBookingPaymentInfo(
  bookingId: string
): Promise<ApiResponse<any>> {
  try {
    const response = await serverFetch.get(
      `/bookings/${bookingId}/payment-info`,
      {
        next: {
          tags: [`booking-payment-${bookingId}`],
          revalidate: 30,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      data: result.data,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get booking payment info error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch payment info",
    };
  }
}

// ==================== CANCEL & DELETE SERVICES ====================

// Cancel booking - matches backend cancelBooking
export async function cancelBooking(bookingId: string): Promise<ApiResponse> {
  try {
    const response = await serverFetch.patch(`/bookings/${bookingId}/cancel`);
    const result = await response.json();

    if (result.success) {
      // Revalidate relevant cache tags with profile
      revalidateTag("my-bookings", "my-bookings-profile");
      revalidateTag("host-bookings", "host-bookings-profile");
      revalidateTag("user-booking-stats", "user-stats-profile");
      revalidateTag("host-booking-stats", "host-stats-profile");
      revalidateTag(`booking-${bookingId}`, `booking-${bookingId}-profile`);

      return {
        success: true,
        message: result.message || "Booking cancelled successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to cancel booking",
    };
  } catch (error: any) {
    console.error("Cancel booking error:", error);
    return {
      success: false,
      message: error.message || "Failed to cancel booking",
    };
  }
}

// Delete booking (admin only) - matches backend deleteBooking
export async function deleteBooking(bookingId: string): Promise<ApiResponse> {
  try {
    const response = await serverFetch.delete(`/bookings/${bookingId}`);
    const result = await response.json();

    if (result.success) {
      // Revalidate relevant cache tags with profile parameter
      revalidateTag("all-bookings", "all-bookings-profile");
      revalidateTag("my-bookings", "my-bookings-profile");
      revalidateTag("host-bookings", "host-bookings-profile");
      revalidateTag("user-booking-stats", "user-booking-stats-profile");
      revalidateTag("host-booking-stats", "host-booking-stats-profile");

      return {
        success: true,
        message: result.message || "Booking deleted successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to delete booking",
    };
  } catch (error: any) {
    console.error("Delete booking error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete booking",
    };
  }
}

// ==================== STATISTICS SERVICES ====================

// Get user booking statistics - matches backend getUserBookingStats
export async function getUserBookingStats(): Promise<
  ApiResponse<IBookingStats>
> {
  try {
    const response = await serverFetch.get(`/bookings/user/stats`, {
      next: {
        tags: ["user-booking-stats"],
        revalidate: 60,
      },
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch booking statistics",
    };
  } catch (error: any) {
    console.error("Get booking stats error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch booking statistics",
    };
  }
}

// Get host booking statistics - matches backend getHostBookingStats
export async function getHostBookingStats(): Promise<
  ApiResponse<IBookingStats>
> {
  try {
    const response = await serverFetch.get(`/bookings/host/stats`, {
      next: {
        tags: ["host-booking-stats"],
        revalidate: 60,
      },
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch host booking statistics",
    };
  } catch (error: any) {
    console.error("Get host booking stats error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch host booking statistics",
    };
  }
}

export async function getMyBookingStats(): Promise<ApiResponse<IBookingStats>> {
  try {
    const response = await serverFetch.get(`/bookings/user/stats`, {
      next: {
        tags: ["my-booking-stats"],
        revalidate: 60,
      },
    });

    const result = await response.json();
    console.log("Get booking stats response:", result);

    if (result.success) {
      return {
        success: true,
        data: result.data as IBookingStats,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch booking statistics",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Get booking stats error:", error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch booking statistics"
      }`,
    };
  }
}

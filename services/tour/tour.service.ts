/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { zodValidator } from "@/lib/zodValidator";

import {
  ITour,
  HostTourFilters,
  HostTourStats,
  TourFilters,
  ApiResponse,
} from "@/types/tour.interface";
import {
  createTourFrontendValidationSchema,
  updateTourFrontendValidationSchema,
} from "@/zod/tour.validation";

// ==================== CREATE & UPDATE SERVICES ====================

export const createTour = async (
  _currentState: any,
  formData: FormData
): Promise<ApiResponse<ITour>> => {
  try {
    // Extract and transform form data
    const rawData: Record<string, any> = {
      title: formData.get("title"),
      description: formData.get("description"),
      destination: formData.get("destination"),
      city: formData.get("city"),
      country: formData.get("country"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      duration: formData.get("duration")
        ? parseInt(formData.get("duration") as string)
        : 0,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : 0,
      maxGroupSize: formData.get("maxGroupSize")
        ? parseInt(formData.get("maxGroupSize") as string)
        : 0,
      category: formData.get("category"),
      difficulty: formData.get("difficulty"),
      meetingPoint: formData.get("meetingPoint"),
      isActive: formData.get("isActive") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    };

    // Handle included items (array)
    const includedItems = formData.getAll("included").filter((item) => {
      const itemStr = item.toString().trim();
      return itemStr !== "" && itemStr !== '""';
    });
    rawData.included = includedItems.length > 0 ? includedItems : [];

    // Handle excluded items (array)
    const excludedItems = formData.getAll("excluded").filter((item) => {
      const itemStr = item.toString().trim();
      return itemStr !== "" && itemStr !== '""';
    });
    rawData.excluded = excludedItems.length > 0 ? excludedItems : [];

    // Handle itinerary (JSON string)
    const itinerary = formData.get("itinerary");
    if (itinerary && typeof itinerary === "string" && itinerary.trim() !== "") {
      try {
        const parsedItinerary = JSON.parse(itinerary);
        // Filter out empty activities
        const cleanedItinerary = parsedItinerary
          .map((day: any) => ({
            ...day,
            activities: day.activities.filter(
              (activity: string) => activity && activity.trim() !== ""
            ),
          }))
          .filter(
            (day: any) =>
              day.activities.length > 0 || day.title || day.description
          );
        rawData.itinerary = cleanedItinerary;
      } catch (error) {
        console.error("Failed to parse itinerary:", error);
        rawData.itinerary = [];
      }
    } else {
      rawData.itinerary = [];
    }

    // Validate data using frontend schema
    const validation = zodValidator(
      rawData,
      createTourFrontendValidationSchema
    );
    if (!validation.success) {
      return {
        success: false,
        errors: validation.errors,
        message: "Validation failed",
      };
    }

    const validatedData = validation.data as Record<string, any>;

    // Prepare the final data object for backend (with defaults)
    const dataForBackend = {
      ...validatedData,
      currentGroupSize: 0,
      views: 0,
      // Ensure arrays are properly formatted
      included: Array.isArray(validatedData.included)
        ? validatedData.included
        : [],
      excluded: Array.isArray(validatedData.excluded)
        ? validatedData.excluded
        : [],
      itinerary: Array.isArray(validatedData.itinerary)
        ? validatedData.itinerary
        : [],
    };

    // Prepare form data for upload - IMPORTANT: field name must be "data" for backend
    const submitData = new FormData();
    submitData.append("data", JSON.stringify(dataForBackend));

    // Handle single image upload - field name must be "file" for backend
    const imageInput = formData.get("images");
    if (imageInput instanceof File && imageInput.size > 0 && imageInput.name) {
      submitData.append("file", imageInput);
    } else {
      // Check if there are multiple images (from the old implementation)
      const images = formData.getAll("images");
      const firstImage = images.find(
        (img) => img instanceof File && img.size > 0
      );
      if (firstImage) {
        submitData.append("file", firstImage);
      }
    }

    // Make API call
    const res = await serverFetch.post("/tour/create-tour", {
      body: submitData,
      // Don't set Content-Type header - browser will set it automatically with boundary
    });

    const result = await res.json();

    if (result.success) {
      // Revalidate cache
      revalidateTag("my-tours", "my-tour-stats");

      return {
        success: true,
        message: "Tour created successfully!",
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Tour creation error:", error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to create tour. Please try again."
      }`,
    };
  }
};

export const updateTour = async (
  tourId: string,
  formData: FormData
): Promise<ApiResponse<ITour>> => {
  try {
    const rawData: Record<string, any> = {};

    const fields = [
      "title",
      "description",
      "destination",
      "city",
      "country",
      "startDate",
      "endDate",
      "duration",
      "price",
      "maxGroupSize",
      "category",
      "difficulty",
      "meetingPoint",
      "isActive",
      "isFeatured",
    ];

    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null && value !== "") {
        if (field === "duration" || field === "maxGroupSize") {
          rawData[field] = parseInt(value as string);
        } else if (field === "price") {
          rawData[field] = parseFloat(value as string);
        } else if (field === "isActive" || field === "isFeatured") {
          rawData[field] = value === "true";
        } else if (field === "startDate" || field === "endDate") {
          rawData[field] = value as string;
        } else {
          rawData[field] = value;
        }
      }
    });

    const included = formData.getAll("included");
    if (included.length > 0) {
      rawData.included = included.filter((item) => item !== "");
    }

    const excluded = formData.getAll("excluded");
    if (excluded.length > 0) {
      rawData.excluded = excluded.filter((item) => item !== "");
    }

    const itinerary = formData.get("itinerary");
    if (itinerary) {
      try {
        rawData.itinerary = JSON.parse(itinerary as string);
      } catch {
        rawData.itinerary = itinerary;
      }
    }

    const imagesInput = formData.get("existingImages");
    if (imagesInput) {
      try {
        rawData.images = JSON.parse(imagesInput as string);
      } catch {
        rawData.images = imagesInput;
      }
    }

    if (Object.keys(rawData).length > 0) {
      // Validate using frontend schema
      const validation = zodValidator(
        rawData,
        updateTourFrontendValidationSchema
      );
      if (!validation.success) {
        return {
          success: false,
          errors: validation.errors,
          message: "Validation failed",
        };
      }
    }

    const submitData = new FormData();

    if (Object.keys(rawData).length > 0) {
      submitData.append("data", JSON.stringify(rawData));
    }

    const newImages = formData.getAll("newImages");
    newImages.forEach((image) => {
      if (image instanceof File && image.size > 0) {
        submitData.append(`images`, image);
      }
    });

    const res = await serverFetch.patch(`/tour/${tourId}`, {
      body: submitData,
    });

    const result = await res.json();

    if (result.success) {
      // revalidateTag("my-tours", "my-tours-profile");
      // revalidateTag("my-tour-stats", "my-tour-stats-profile");
      // revalidateTag(`my-tour-${tourId}`, `my-tour-${tourId}-profile`);
      // revalidateTag("tours-list", "tours-list-profile");
      // revalidateTag("all-tours-admin", "all-tours-admin-profile");
      // revalidateTag(`tour-${tourId}`, `tour-${tourId}-profile`);

      return {
        success: true,
        message: "Tour updated successfully!",
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Tour update error:", error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update tour. Please try again."
      }`,
    };
  }
};

// ==================== GET & DELETE SERVICES ====================

// Get all tours (Public)
export async function getAllTours(
  filters?: TourFilters
): Promise<ApiResponse<ITour[]>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    if (!filters?.page) queryParams.append("page", "1");
    if (!filters?.limit) queryParams.append("limit", "12");
    if (!filters?.sortBy) queryParams.append("sortBy", "createdAt");
    if (!filters?.sortOrder) queryParams.append("sortOrder", "desc");

    const queryString = queryParams.toString();

    const response = await serverFetch.get(
      `/tour${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: ["tours-list"],
          revalidate: 60,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get all tours error:", error);
    return {
      success: false,
      data: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch tours"
      }`,
    };
  }
}

// Get single tour by ID (Public)
export async function getSingleTour(
  tourId: string
): Promise<ApiResponse<ITour>> {
  try {
    const response = await serverFetch.get(`/tour/${tourId}`, {
      next: {
        tags: [`tour-${tourId}`],
        revalidate: 60,
      },
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data as ITour,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Get single tour error:", error);
    return {
      success: false,
      data: undefined,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch tour details"
      }`,
    };
  }
}

// Get all tours for Admin dashboard
export async function getAllToursForAdmin(
  filters?: TourFilters & {
    hostId?: string;
    includeInactive?: boolean;
  }
): Promise<ApiResponse<ITour[]>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    // Admin can see all tours including inactive
    if (!filters?.includeInactive) {
      queryParams.append("isActive", "true");
    }

    if (!filters?.page) queryParams.append("page", "1");
    if (!filters?.limit) queryParams.append("limit", "50");

    const queryString = queryParams.toString();

    const response = await serverFetch.get(`/tour`, {
      next: {
        tags: ["all-tours-admin"],
        revalidate: 30,
      },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get all tours for admin error:", error);
    return {
      success: false,
      data: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch tours for admin"
      }`,
    };
  }
}

// Delete tour by ID (Admin & Host)
export async function deleteTour(tourId: string): Promise<ApiResponse> {
  try {
    const response = await serverFetch.delete(`/tour/${tourId}`);
    const result = await response.json();

    if (result.success) {
      revalidateTag("my-tours", "my-tour-stats");

      return {
        success: true,
        message: result.message || "Tour deleted successfully",
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Delete tour error:", error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to delete tour"
      }`,
    };
  }
}

// ==================== HOST-SPECIFIC SERVICES ====================

export async function getMyTours(
  filters?: HostTourFilters
): Promise<ApiResponse<ITour[]>> {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();

    const response = await serverFetch.get(
      `/tour/host/my-tours${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: ["my-tours"],
          revalidate: 30,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? (result.data as ITour[]) : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get my tours error:", error);
    return {
      success: false,
      data: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch your tours"
      }`,
    };
  }
}

export async function getMyTourStats(): Promise<ApiResponse<HostTourStats>> {
  try {
    const response = await serverFetch.get(`/tour/host/stats`, {
      next: {
        tags: ["my-tour-stats"],
        revalidate: 60,
      },
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data as HostTourStats,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Get tour stats error:", error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch tour statistics"
      }`,
    };
  }
}

export async function getMyTourDetails(
  tourId: string
): Promise<ApiResponse<ITour & { bookingStats?: any }>> {
  try {
    const response = await serverFetch.get(`/tour/host/my-tours/${tourId}`, {
      next: {
        tags: [`my-tour-${tourId}`],
        revalidate: 60,
      },
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data as ITour & { bookingStats?: any },
      };
    }

    return result;
  } catch (error: any) {
    console.error("Get tour details error:", error);
    return {
      success: false,
      data: undefined,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch tour details"
      }`,
    };
  }
}

// ==================== TOUR STATUS MANAGEMENT ====================

export async function updateTourStatus(
  tourId: string,
  isActive: boolean
): Promise<ApiResponse> {
  try {
    const response = await serverFetch.patch(`/tour/${tourId}`, {
      body: JSON.stringify({ isActive }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("my-tours", "my-tours-profile");
      revalidateTag("my-tour-stats", "my-tour-stats-profile");
      revalidateTag(`my-tour-${tourId}`, `my-tour-${tourId}-profile`);
      revalidateTag("tours-list", "tours-list-profile");
      revalidateTag("all-tours-admin", "all-tours-admin-profile");

      return {
        success: true,
        message: `Tour ${isActive ? "activated" : "deactivated"} successfully!`,
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Update tour status error:", error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update tour status"
      }`,
    };
  }
}

export async function updateTourFeatured(
  tourId: string,
  isFeatured: boolean
): Promise<ApiResponse> {
  try {
    const response = await serverFetch.patch(`/tour/${tourId}`, {
      body: JSON.stringify({ isFeatured }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("my-tours", "my-tours-profile");
      revalidateTag("my-tour-stats", "my-tour-stats-profile");
      revalidateTag(`my-tour-${tourId}`, `my-tour-${tourId}-profile`);
      revalidateTag("all-tours-admin", "all-tours-admin-profile");

      return {
        success: true,
        message: `Tour ${
          isFeatured ? "marked as featured" : "removed from featured"
        } successfully!`,
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Update tour featured error:", error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update tour featured status"
      }`,
    };
  }
}

// ==================== SPECIAL TOUR QUERIES ====================

export async function getFeaturedTours(
  limit: number = 6
): Promise<ApiResponse<ITour[]>> {
  try {
    const response = await serverFetch.get(
      `/tour?isFeatured=true&limit=${limit}&sortBy=createdAt&sortOrder=desc`,
      {
        next: {
          tags: ["featured-tours"],
          revalidate: 180,
        },
      }
    );

    const result = await response.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? (result.data as ITour[]) : [],
    };
  } catch (error: any) {
    console.error("Get featured tours error:", error);
    return {
      success: false,
      data: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch featured tours"
      }`,
    };
  }
}

export async function getToursByCategory(
  category: string,
  limit?: number
): Promise<ApiResponse<ITour[]>> {
  try {
    let url = `/tour?category=${category}&isActive=true`;
    if (limit) {
      url += `&limit=${limit}`;
    }

    const response = await serverFetch.get(url, {
      next: {
        tags: [`tours-category-${category}`],
        revalidate: 120,
      },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? (result.data as ITour[]) : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get tours by category error:", error);
    return {
      success: false,
      data: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch tours by category"
      }`,
    };
  }
}

export async function searchTours(
  query: string,
  filters?: TourFilters
): Promise<ApiResponse<ITour[]>> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("searchTerm", query);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await serverFetch.get(`/tour?${queryParams.toString()}`, {
      next: {
        tags: ["search-tours"],
        revalidate: 60,
      },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? (result.data as ITour[]) : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Search tours error:", error);
    return {
      success: false,
      data: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to search tours"
      }`,
    };
  }
}

export async function getUpcomingTours(
  limit?: number
): Promise<ApiResponse<ITour[]>> {
  try {
    let url = `/tour?isActive=true&sortBy=startDate&sortOrder=asc`;
    if (limit) {
      url += `&limit=${limit}`;
    }

    const response = await serverFetch.get(url, {
      next: {
        tags: ["upcoming-tours"],
        revalidate: 120,
      },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? (result.data as ITour[]) : [],
      meta: result.meta,
    };
  } catch (error: any) {
    console.error("Get upcoming tours error:", error);
    return {
      success: false,
      data: [],
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch upcoming tours"
      }`,
    };
  }
}

export async function duplicateTour(tourId: string): Promise<ApiResponse> {
  try {
    const tourResponse = await getMyTourDetails(tourId);

    if (!tourResponse.success || !tourResponse.data) {
      return tourResponse;
    }

    const tour = tourResponse.data;

    const duplicateData = {
      title: `${tour.title} - Copy`,
      description: tour.description,
      destination: tour.destination,
      city: tour.city,
      country: tour.country,
      startDate: tour.startDate,
      endDate: tour.endDate,
      duration: tour.duration,
      price: tour.price,
      maxGroupSize: tour.maxGroupSize,
      category: tour.category,
      difficulty: tour.difficulty,
      included: tour.included,
      excluded: tour.excluded,
      itinerary: tour.itinerary,
      meetingPoint: tour.meetingPoint,
      images: tour.images,
      isActive: false,
      isFeatured: false,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(duplicateData));

    const response = await serverFetch.post("/tour/create-tour", {
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("my-tours", "my-tours-profile");
      revalidateTag("my-tour-stats", "my-tour-stats-profile");
      revalidateTag("all-tours-admin", "all-tours-admin-profile");

      return {
        success: true,
        message: "Tour duplicated successfully!",
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Duplicate tour error:", error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to duplicate tour"
      }`,
    };
  }
}

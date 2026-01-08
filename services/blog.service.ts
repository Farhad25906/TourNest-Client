/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidatePath, revalidateTag } from "next/cache";

// Types for blog
export interface IBlog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  views: number;
  likesCount: number;
  hostId: string;
  tourId?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    likes: number;
    comments: number;
  };
  author?: IBlogAuthor;
  authorId: string;
  isLiked?: boolean;
  tags?: string[];
  host?: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
}

export interface IComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  blogId: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  likes?: number;
  replies?: IComment[];
}
export interface IBlogAuthor {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface BlogListResponse {
  success: boolean;
  message: string;
  data: IBlog[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface SingleBlogResponse {
  success: boolean;
  message: string;
  data: IBlog;
}

// ============================================
// BLOG CRUD OPERATIONS
// ============================================

/**
 * Get all blogs (Public)
 */
export async function getAllBlogs(params?: {
  searchTerm?: string;
  category?: string;
  status?: string;
  hostId?: string;
  tourId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  try {
    const queryString = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryString.append(key, String(value));
        }
      });
    }

    const response = await serverFetch.get(
      `/blogs${queryString.toString() ? `?${queryString.toString()}` : ""}`,
      // {
      //   revalidate: 60, // Cache for 60 seconds
      //   tags: ["blogs"],
      // }
      {
        revalidate: 60,
        tags: ["blogs"],
      } as any
    );

    // );

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      message: `Failed to fetch blogs: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
      data: [],
      meta: { page: 1, limit: 10, total: 0 },
    };
  }
}

/**
 * Get single blog by ID
 */
export async function getBlogById(blogId: string) {
  try {
    const response = await serverFetch.get(`/blogs/${blogId}`, {
      revalidate: 60,
      tags: [`blog-${blogId}`],
    } as any);

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    return {
      success: false,
      message: "Failed to fetch blog",
      data: null,
    };
  }
}

/**
 * Create a new blog
 */
export async function createBlog(formData: FormData) {
  try {
    const response = await serverFetch.post("/blogs", {
      body: formData,
      // Note: No Content-Type header for FormData
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("blogs", { expire: 0 });
      revalidateTag("my-blogs", { expire: 0 });
      revalidatePath("/dashboard/blogs");
      revalidatePath("/blogs");
    }

    return result;
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return {
      success: false,
      message: `Failed to create blog: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
      data: null,
    };
  }
}

/**
 * Update a blog
 */
export async function updateBlog(blogId: string, formData: FormData) {
  try {
    const response = await serverFetch.patch(`/blogs/${blogId}`, {
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("blogs", { expire: 0 });
      revalidateTag(`blog-${blogId}`, { expire: 0 });
      revalidateTag("my-blogs", { expire: 0 });
      revalidatePath("/dashboard/blogs");
      revalidatePath(`/blogs/${blogId}`);
    }

    return result;
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return {
      success: false,
      message: `Failed to update blog: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
      data: null,
    };
  }
}

/**
 * Delete a blog
 */
export async function deleteBlog(blogId: string) {
  try {
    const response = await serverFetch.delete(`/blogs/${blogId}`);

    const result = await response.json();

    if (result.success) {
      revalidateTag("blogs", { expire: 0 });
      revalidateTag(`blog-${blogId}`, { expire: 0 });
      revalidateTag("my-blogs", { expire: 0 });
      revalidatePath("/dashboard/blogs");
      revalidatePath("/blogs");
    }

    return result;
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return {
      success: false,
      message: `Failed to delete blog: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
    };
  }
}

// ============================================
// MY BLOGS (HOST SPECIFIC)
// ============================================

/**
 * Get my blogs (for host)
 */
export async function getMyBlogs() {
  try {
    const response = await serverFetch.get("/blogs/me/my-blogs", {
      revalidate: 30, // Cache for 30 seconds
      tags: ["my-blogs"],
    } as any);

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching my blogs:", error);
    return {
      success: false,
      message: `Failed to fetch your blogs: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
      data: [],
    };
  }
}

// ============================================
// COMMENTS OPERATIONS
// ============================================

/**
 * Create comment on blog
 */
export async function createComment(
  blogId: string,
  data: {
    content: string;
    parentId?: string;
  }
) {
  try {
    const response = await serverFetch.post(`/blogs/${blogId}/comments`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag(`blog-${blogId}`, { expire: 0 });
      revalidatePath(`/blogs/${blogId}`);
    }

    return result;
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return {
      success: false,
      message: `Failed to create comment: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
    };
  }
}

/**
 * Update comment
 */
export async function updateComment(
  commentId: string,
  data: { content: string }
) {
  try {
    const response = await serverFetch.patch(`/blogs/comments/${commentId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error updating comment:", error);
    return {
      success: false,
      message: `Failed to update comment: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
    };
  }
}

/**
 * Delete comment
 */
export async function deleteComment(commentId: string) {
  try {
    const response = await serverFetch.delete(`/blogs/comments/${commentId}`);

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    return {
      success: false,
      message: `Failed to delete comment: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
    };
  }
}

// ============================================
// LIKES OPERATIONS
// ============================================

/**
 * Toggle like on blog
 */
export async function toggleLike(blogId: string) {
  try {
    const response = await serverFetch.post(`/blogs/${blogId}/like`);

    const result = await response.json();

    if (result.success) {
      revalidateTag(`blog-${blogId}`, { expire: 0 });
      revalidateTag("blogs", { expire: 0 });
      revalidatePath(`/blogs/${blogId}`);
    }

    return result;
  } catch (error: any) {
    console.error("Error toggling like:", error);
    return {
      success: false,
      message: `Failed to toggle like: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
    };
  }
}

/**
 * Toggle like on comment
 */
export async function toggleCommentLike(commentId: string) {
  try {
    const response = await serverFetch.post(
      `/blogs/comments/${commentId}/like`
    );

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error toggling comment like:", error);
    return {
      success: false,
      message: `Failed to toggle comment like: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
    };
  }
}

// ============================================
// BLOG STATISTICS
// ============================================

/**
 * Get blog statistics (for host dashboard)
 */
export async function getBlogStats() {
  try {
    const response = await serverFetch.get("/blogs/stats", {
      revalidate: 60, // Cache for 60 seconds
      tags: ["blog-stats"],
    } as any);

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching blog stats:", error);
    return {
      success: false,
      message: `Failed to fetch blog statistics: ${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Please try again"
      }`,
      data: null,
    };
  }
}

export async function likeBlog(blogId: string) {
  try {
    const response = await serverFetch.post(`/blogs/${blogId}/like`);

    const result = await response.json();

    if (result.success) {
      revalidateTag(`blog-${blogId}`, { expire: 0 });
      revalidateTag("blogs", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error liking blog:", error);
    return {
      success: false,
      message: "Please login to like this blog",
    };
  }
}

/**
 * Comment on a blog post
 */
export async function commentOnBlog(blogId: string, content: string) {
  try {
    const response = await serverFetch.post(`/blogs/${blogId}/comments`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag(`blog-${blogId}`, { expire: 0 });
      revalidatePath(`/blogs/${blogId}`);
    }

    return result;
  } catch (error: any) {
    console.error("Error commenting on blog:", error);
    return {
      success: false,
      message: "Please login to comment",
    };
  }
}

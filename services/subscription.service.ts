/* eslint-disable @typescript-eslint/no-explicit-any */
// services/subscription.service.ts
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

// Get all subscription plans (for admin management)
export async function getAllSubscriptionPlans() {
  try {
    const response = await serverFetch.get(`/subscriptions/subscriptionPlans`, {
      next: {
        tags: ["subscription-plans", "admin-subscriptions"],
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
    console.error("Get subscription plans error:", error);
    return {
      success: false,
      data: [],
      message: `Failed to fetch subscription plans`,
    };
  }
}

export async function getCurrentSubscription() {
  try {
    const response = await serverFetch.get(`/subscriptions/my-subscription`, {
      next: {
        tags: ["host-subscription", "my-subscription"],
        revalidate: 30,
      },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: result.data,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get current subscription error:", error);
    return {
      success: false,
      data: null,
      message: `Failed to fetch current subscription`,
    };
  }
}

// Create subscription
export async function createSubscription(planId: string) {
  try {
    const response = await serverFetch.post(`/subscriptions/subscribe`, {
      body: JSON.stringify({ planId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      // Revalidate all related subscription tags
      revalidateTag("host-subscription", "my-subscription");
      revalidateTag("subscription-plans", "subscription-analytics");

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Create subscription error:", error);
    return {
      success: false,
      message: `Failed to create subscription: ${error.message}`,
    };
  }
}

// Initiate subscription payment
export async function initiateSubscriptionPayment(subscriptionId: string) {
  try {
    const response = await serverFetch.post(
      `/subscriptions/${subscriptionId}/initiate-payment`,
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag("host-subscription","my-subscription");
      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Initiate payment error:", error);
    return {
      success: false,
      message: `Failed to initiate payment: ${error.message}`,
    };
  }
}

// Get all subscriptions (admin view)
export async function getAllSubscriptions() {
  try {
    const response = await serverFetch.get(`/subscriptions`, {
      next: {
        tags: ["all-subscriptions", "admin-subscriptions"],
        revalidate: 30,
      },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get all subscriptions error:", error);
    return {
      success: false,
      data: [],
      message: `Failed to fetch subscriptions`,
    };
  }
}

export async function getPublicSubscriptions() {
  try {
    const response = await serverFetch.get(`/subscriptions/plans`, {
      next: {
        tags: ["public-subscriptions", "subscription-plans"],
        revalidate: 30,
      },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? result.data : [],
      meta: result.meta,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get all subscriptions error:", error);
    return {
      success: false,
      data: [],
      message: `Failed to fetch subscriptions`,
    };
  }
}

// Update subscription plan
export async function updateSubscriptionPlan(planId: string, data: any) {
  try {
    const response = await serverFetch.patch(`/subscriptions/plans/${planId}`, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      // Revalidate all subscription-related tags
      revalidateTag("subscription-plans","admin-subscriptions");
      revalidateTag("public-subscriptions","all-subscriptions");


      return {
        success: true,
        data: result.data,
        message: result.message || "Subscription plan updated successfully",
      };
    }

    return result;
  } catch (error: any) {
    console.error("Update subscription plan error:", error);
    return {
      success: false,
      message: `Failed to update subscription plan: ${error.message}`,
    };
  }
}

// Delete subscription plan
export async function deleteSubscriptionPlan(planId: string) {
  try {
    const response = await serverFetch.delete(`/subscriptions/plans/${planId}`);
    const result = await response.json();

    if (result.success) {
      // Revalidate all subscription-related tags
      revalidateTag("subscription-plans","admin-subscriptions");
      revalidateTag("all-subscriptions","subscription-analytics");


      return {
        success: true,
        message: result.message || "Subscription plan deleted successfully",
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Delete subscription plan error:", error);
    return {
      success: false,
      message: `Failed to delete subscription plan: ${error.message}`,
    };
  }
}

// Create subscription plan
export async function createSubscriptionPlan(data: any) {
  try {
    const response = await serverFetch.post(`/subscriptions/create-plan`, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      // Revalidate all subscription-related tags
      revalidateTag("subscription-plans","admin-subscriptions");
      revalidateTag("all-subscriptions","subscription-analytics");


      return {
        success: true,
        data: result.data,
        message: result.message || "Subscription plan created successfully",
      };
    }

    return result;
  } catch (error: any) {
    console.error("Create subscription plan error:", error);
    return {
      success: false,
      message: `Failed to create subscription plan: ${error.message}`,
    };
  }
}

// Get subscription analytics
export async function getSubscriptionAnalytics() {
  try {
    const response = await serverFetch.get(
      `/subscriptions/analytics/overview`,
      {
        next: {
          tags: ["subscription-analytics", "admin-subscriptions"],
          revalidate: 300,
        },
      },
    );

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Get subscription analytics error:", error);
    return {
      success: false,
      message: `Failed to fetch subscription analytics`,
    };
  }
}

// Additional function: Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await serverFetch.delete(
      `/subscriptions/${subscriptionId}`,
    );
    const result = await response.json();

    if (result.success) {
      // Revalidate all subscription-related tags
      revalidateTag("host-subscription","my-subscription");
      revalidateTag("subscription-plans","subscription-analytics");

      return {
        success: true,
        message: result.message || "Subscription cancelled successfully",
        data: result.data,
      };
    }

    return result;
  } catch (error: any) {
    console.error("Cancel subscription error:", error);
    return {
      success: false,
      message: `Failed to cancel subscription: ${error.message}`,
    };
  }
}

// Get subscription by ID (admin or detailed view)
export async function getSubscriptionById(subscriptionId: string) {
  try {
    const response = await serverFetch.get(`/subscriptions/${subscriptionId}`, {
      next: {
        tags: [`subscription-${subscriptionId}`, "admin-subscriptions"],
        revalidate: 30,
      },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: result.data,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get subscription by ID error:", error);
    return {
      success: false,
      data: null,
      message: `Failed to fetch subscription details`,
    };
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

// ==================== INTERFACES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface IPayment {
  id: string;
  userId: string;
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  stripePaymentId?: string;
  stripeSessionId?: string;
  description?: string;
  metadata?: any;
  paidAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    role: string;
    tourist?: {
      name: string;
      profilePhoto?: string;
    };
  };
  booking?: {
    id: string;
    status: string;
    paymentStatus: string;
    numberOfPeople: number;
    totalAmount: number;
    tour?: {
      id: string;
      title: string;
      destination: string;
      host?: {
        id: string;
        name: string;
      };
    };
  };
}

export interface IEarningsData {
  payments: IPayment[];
  summary: {
    totalEarnings: number;
    totalTransactions: number;
    pendingBalance: number;
    totalEarningsToDate: number;
  };
  earningsByMonth: Array<{
    month: string;
    earnings: number;
  }>;
}

export interface IAllPaymentsData {
  payments: IPayment[];
  stats: {
    totalAmount: number;
    totalTransactions: number;
    statusCounts: Record<string, number>;
  };
}

// ==================== PAYMENT ACTIONS ====================

// Server Action: Get all payments (ADMIN)
export async function getAllPayments(): Promise<ApiResponse<IAllPaymentsData>> {
  "use server";

  try {
    const response = await serverFetch.get(`/payments`, {
      next: {
        tags: ["all-payments"],
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
    console.error("Get all payments error:", error);
    return {
      success: false,
      data: {
        payments: [],
        stats: {
          totalAmount: 0,
          totalTransactions: 0,
          statusCounts: {},
        },
      },
      message: error.message || "Failed to fetch payments",
    };
  }
}

// Server Action: Get host earnings (HOST)
export async function getHostEarnings(): Promise<ApiResponse<IEarningsData>> {
  "use server";

  try {
    const response = await serverFetch.get(`/payments/host/earnings`, {
      next: {
        tags: ["host-earnings"],
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
    console.error("Get host earnings error:", error);
    return {
      success: false,
      data: {
        payments: [],
        summary: {
          totalEarnings: 0,
          totalTransactions: 0,
          pendingBalance: 0,
          totalEarningsToDate: 0,
        },
        earningsByMonth: [],
      },
      message: error.message || "Failed to fetch earnings",
    };
  }
}

// Server Action: Get user payment history (TOURIST)
export async function getUserPaymentHistory(): Promise<
  ApiResponse<IPayment[]>
> {
  "use server";

  try {
    const response = await serverFetch.get(`/payments/user/history`, {
      next: {
        tags: ["user-payment-history"],
        revalidate: 30,
      },
    });

    const result = await response.json();

    return {
      success: result.success,
      data: result.data || [],
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get user payment history error:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch payment history",
    };
  }
}

// Server Action: Get payment status by session ID
export async function getPaymentStatus(
  sessionId: string
): Promise<ApiResponse<any>> {
  "use server";

  try {
    const response = await serverFetch.get(`/payments/status/${sessionId}`);
    const result = await response.json();

    return {
      success: result.success,
      data: result.data,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Get payment status error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch payment status",
    };
  }
}

// Server Action: Verify payment completion
export async function verifyPaymentCompletion(
  sessionId: string
): Promise<ApiResponse<any>> {
  "use server";

  try {
    const response = await serverFetch.get(`/payments/verify/${sessionId}`);
    const result = await response.json();

    if (result.success) {
      // Revalidate cache for all relevant data
      revalidateTag("my-bookings", "my-bookings-profile");
      revalidateTag("user-booking-stats", "user-booking-stats-profile");
      revalidateTag("host-bookings", "host-bookings-profile");
      revalidateTag("host-booking-stats", "host-booking-stats-profile");

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to verify payment",
    };
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return {
      success: false,
      message: error.message || "Failed to verify payment",
    };
  }
}

// Refund payment
export async function refundPayment(
  paymentId: string,
  reason?: string
): Promise<ApiResponse> {
  "use server";

  try {
    const response = await serverFetch.post(`/payments/refund/${paymentId}`, {
      body: JSON.stringify({ reason }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      // Revalidate cache
      revalidateTag("user-payment-history", "user-payment-history-profile");
      revalidateTag("host-earnings", "host-earnings-profile");
      revalidateTag("all-payments", "all-payments-profile");

      return {
        success: true,
        data: result.data,
        message: result.message || "Payment refunded successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to refund payment",
    };
  } catch (error: any) {
    console.error("Refund payment error:", error);
    return {
      success: false,
      message: error.message || "Failed to refund payment",
    };
  }
}

// Utility function to check if booking can be paid
export async function canPayForBooking(bookingId: string): Promise<
  ApiResponse<{
    canPay: boolean;
    isPaid: boolean;
    paymentStatus: string;
    bookingStatus: string;
  }>
> {
  "use server";

  try {
    const response = await serverFetch.get(
      `/bookings/${bookingId}/payment-info`
    );
    const result = await response.json();

    if (result.success) {
      const { canPay, isPaid, paymentStatus, bookingStatus } =
        result.data || {};
      return {
        success: true,
        data: {
          canPay: canPay || false,
          isPaid: isPaid || false,
          paymentStatus: paymentStatus || "PENDING",
          bookingStatus: bookingStatus || "PENDING",
        },
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to check payment status",
    };
  } catch (error: any) {
    console.error("Check payment ability error:", error);
    return {
      success: false,
      message: error.message || "Failed to check payment status",
    };
  }
}

// ==================== UTILITY FUNCTIONS ====================

// Export payment status options for UI
export async function getPaymentStatusOptions() {
  return [
    { value: "PENDING", label: "Pending", color: "yellow" },
    { value: "PROCESSING", label: "Processing", color: "blue" },
    { value: "COMPLETED", label: "Completed", color: "green" },
    { value: "FAILED", label: "Failed", color: "red" },
    { value: "CANCELLED", label: "Cancelled", color: "gray" },
    { value: "REFUNDED", label: "Refunded", color: "orange" },
  ];
}

// Export payment method options for UI
export async function getPaymentMethodOptions() {
  return {
    card: "Card",
    cash: "Cash",
    bkash: "Bkash",
  };
}

// Export booking status options for UI
export async function getBookingStatusOptions() {
  return [
    { value: "PENDING", label: "Pending", color: "yellow" },
    { value: "CONFIRMED", label: "Confirmed", color: "green" },
    { value: "CANCELLED", label: "Cancelled", color: "red" },
    { value: "COMPLETED", label: "Completed", color: "blue" },
    { value: "REFUNDED", label: "Refunded", color: "orange" },
  ];
}

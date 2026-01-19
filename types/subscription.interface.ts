// types/subscription.interface.ts
export interface ISubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  tourLimit: number;
  blogLimit: number | null;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISubscription {
  id: string;
  hostId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: string;
  autoRenew: boolean;
  tourLimit: number;
  remainingTours: number;
  blogLimit: number | null;
  remainingBlogs: number | null;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  host: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    currentTourCount: number;
    phone?: string;
  };
  plan: ISubscriptionPlan;
  payments?: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface ISubscriptionAnalytics {
  overview: {
    total: number;
    active: number;
    cancelled: number;
    pending: number;
    expired: number;
  };
  revenue: {
    monthly: number;
    annual: number;
  };
  popularPlans: Array<{
    planId: string;
    planName: string;
    count: number;
    price: number;
  }>;
  recentPayments: any[];
  upcomingRenewals: any[];
}

export interface ISubscriptionUpdateData {
  status?: string;
  adminNotes?: string;
  extendDays?: number;
  adjustTourLimit?: number;
  adjustBlogLimit?: number;
  reason?: string;
}
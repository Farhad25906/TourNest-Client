/* eslint-disable @typescript-eslint/no-explicit-any */
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
  stripePriceId: string | null;
  stripeProductId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscription {
  id: string;
  hostId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAUSED';
  autoRenew: boolean;
  tourLimit: number;
  blogLimit: number | null;
  remainingTours: number;
  remainingBlogs: number | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt: Date | null;
  adminNotes?: string;
  plan: ISubscriptionPlan;
  host: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    currentTourCount: number;
    user: {
      id: string;
      email: string;
      status: string;
      createdAt: Date;
    };
  };
  payments?: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
  }>;
  _count?: {
    payments: number;
  };
}

export interface ISubscriptionFilters {
  searchTerm?: string;
  status?: string;
  hostId?: string;
  planId?: string;
  hostName?: string;
  hostEmail?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
    total: number;
    monthly: Array<{
      month: string;
      revenue: number;
    }>;
    arpu: number;
    averagePayment: number;
  };
  popularPlans: Array<{
    planId: string;
    planName: string;
    count: number;
  }>;
  metrics: {
    churnRate: number;
    renewalRate: number;
    activeSubscribers: number;
    monthlyRecurringRevenue: number;
  };
  recentActivity: ISubscription[];
}

export interface ISubscriptionUpdateData {
  planId?: string;
  status?: string;
  extendDays?: number;
  adjustTourLimit?: number;
  adjustBlogLimit?: number;
  adminNotes?: string;
  reason?: string;
}

export interface ISubscriptionStats {
  tourUsage: {
    limit: number;
    used: number;
    remaining: number;
    percentage: number;
  };
  blogUsage: {
    limit: number;
    used: number;
    remaining: number;
    percentage: number;
  } | null;
  totalPayments: number;
  totalRevenue: number;
  stripeInfo: any | null;
}
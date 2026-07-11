import { queryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { dashboardKeys } from "@/features/dashboard/query-keys";
import type {
  DashboardStats,
  PaymentRecord,
  PaymentStatus,
  PlatformStats,
  SubscribersByPlan,
  TrendPoint,
} from "@/features/dashboard/types";

type DashboardStatsResponse = {
  api_requests_today: number;
  total_users: number;
  active_subscriptions: number;
  monthly_revenue: number;
  yearly_revenue: number;
  available_plans: number;
  growth_rate_percent: number;
  avg_response_time_ms: number;
  visits: number;
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await apiGet<DashboardStatsResponse>("/admin/dashboard/stats");

  return {
    apiRequestsToday: data.api_requests_today,
    totalUsers: data.total_users,
    activeSubscriptions: data.active_subscriptions,
    monthlyRevenue: data.monthly_revenue,
    yearlyRevenue: data.yearly_revenue,
    availablePlans: data.available_plans,
    growthRatePercent: data.growth_rate_percent,
    avgResponseTimeMs: data.avg_response_time_ms,
    visits: data.visits,
  };
}

export const dashboardStatsQueryOptions = queryOptions({
  queryKey: dashboardKeys.stats(),
  queryFn: fetchDashboardStats,
});

export async function fetchRevenueTrend(): Promise<TrendPoint[]> {
  return apiGet<TrendPoint[]>("/admin/dashboard/revenue-trend");
}

export const revenueTrendQueryOptions = queryOptions({
  queryKey: dashboardKeys.revenueTrend(),
  queryFn: fetchRevenueTrend,
});

export async function fetchUsageTrend(): Promise<TrendPoint[]> {
  return apiGet<TrendPoint[]>("/admin/dashboard/usage-trend");
}

export const usageTrendQueryOptions = queryOptions({
  queryKey: dashboardKeys.usageTrend(),
  queryFn: fetchUsageTrend,
});

type SubscribersByPlanResponse = {
  slices: { plan_name: string; count: number }[];
  total: number;
};

export async function fetchSubscribersByPlan(): Promise<SubscribersByPlan> {
  const data = await apiGet<SubscribersByPlanResponse>(
    "/admin/dashboard/subscribers-by-plan",
  );

  return {
    slices: data.slices.map((slice) => ({
      planName: slice.plan_name,
      count: slice.count,
    })),
    total: data.total,
  };
}

export const subscribersByPlanQueryOptions = queryOptions({
  queryKey: dashboardKeys.subscribersByPlan(),
  queryFn: fetchSubscribersByPlan,
});

type PlatformStatsResponse = {
  total_users: number;
  verified_users: number;
  active_subscriptions: number;
  crawls_today: number;
  ai_calls_today: number;
};

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const data = await apiGet<PlatformStatsResponse>("/admin/stats");

  return {
    totalUsers: data.total_users,
    verifiedUsers: data.verified_users,
    activeSubscriptions: data.active_subscriptions,
    crawlsToday: data.crawls_today,
    aiCallsToday: data.ai_calls_today,
  };
}

export const platformStatsQueryOptions = queryOptions({
  queryKey: dashboardKeys.platformStats(),
  queryFn: fetchPlatformStats,
});

const RECENT_PAYMENTS_LIMIT = 5;

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

type PaymentResponse = {
  id: string;
  reference: string;
  user_id: string;
  user_name: string;
  plan_name: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  date: string;
};

type PaymentsListResponse = {
  payments: PaymentResponse[];
  total: number;
  page: number;
  per_page: number;
};

export async function fetchRecentPayments(): Promise<PaymentRecord[]> {
  const data = await apiGet<PaymentsListResponse>(
    `/admin/financial/payments?page=1&per_page=${RECENT_PAYMENTS_LIMIT}`,
  );

  return data.payments
    .map((payment) => ({
      id: payment.id,
      customerName: payment.user_name,
      customerInitials: initialsFrom(payment.user_name),
      planName: payment.plan_name,
      date: payment.date,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status as PaymentStatus,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const recentPaymentsQueryOptions = queryOptions({
  queryKey: dashboardKeys.recentPayments(),
  queryFn: fetchRecentPayments,
});

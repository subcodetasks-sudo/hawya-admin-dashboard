import { queryOptions } from "@tanstack/react-query";

import { dashboardKeys } from "@/features/dashboard/query-keys";
import type {
  ApiUsageTrendPoint,
  DashboardOverview,
  PaymentRecord,
  PlanBreakdown,
  RevenueTrendPoint,
} from "@/features/dashboard/types";

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  return delay({
    apiRequestsToday: {
      value: 1_240_000,
      delta: { value: 6.1, direction: "up", period: "vsYesterday" },
    },
    activeUsers: {
      value: 12_847,
      delta: { value: 15.2, direction: "up", period: "vsLastMonth" },
    },
    activeSubscriptions: {
      value: 6_264,
      delta: { value: 18.9, direction: "up", period: "vsLastMonth" },
    },
    monthlyRevenue: {
      value: 103_200,
      currency: "USD",
      delta: { value: 12.4, direction: "up", period: "vsLastMonth" },
    },
    avgResponseTimeMs: { value: 142, deltaMs: -18, direction: "down" },
    activePlans: { value: 5 },
    growthRate: {
      value: 12.4,
      delta: { value: 2.1, direction: "up", period: "vsLastMonth" },
    },
    netRevenue: {
      value: 1_240_000,
      currency: "USD",
      delta: { value: 34.6, direction: "up", period: "vsLastMonth" },
    },
  });
}

export const dashboardOverviewQueryOptions = queryOptions({
  queryKey: dashboardKeys.overview(),
  queryFn: fetchDashboardOverview,
});

export async function fetchRevenueTrend(): Promise<RevenueTrendPoint[]> {
  const now = new Date();
  const shape = [62, 58, 65, 70, 74, 80, 88, 95, 101, 108, 115, 120];

  const points: RevenueTrendPoint[] = shape.map((value, index) => {
    const monthsAgo = shape.length - 1 - index;
    const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);

    return { month: date.toISOString(), revenue: value * 1_000 };
  });

  return delay(points);
}

export const revenueTrendQueryOptions = queryOptions({
  queryKey: dashboardKeys.revenueTrend(),
  queryFn: fetchRevenueTrend,
});

export async function fetchApiUsageTrend(): Promise<ApiUsageTrendPoint[]> {
  const now = new Date();
  const shape = [148, 165, 172, 190, 205, 120, 95];

  const points: ApiUsageTrendPoint[] = shape.map((value, index) => {
    const daysAgo = shape.length - 1 - index;
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);

    return { date: date.toISOString(), requests: value * 1_000 };
  });

  return delay(points);
}

export const apiUsageTrendQueryOptions = queryOptions({
  queryKey: dashboardKeys.apiUsageTrend(),
  queryFn: fetchApiUsageTrend,
});

export async function fetchSubscribersByPlan(): Promise<PlanBreakdown[]> {
  return delay([
    { plan: "starter", subscribers: 1_247 },
    { plan: "pro", subscribers: 3_891 },
    { plan: "business", subscribers: 892 },
    { plan: "enterprise", subscribers: 234 },
  ]);
}

export const subscribersByPlanQueryOptions = queryOptions({
  queryKey: dashboardKeys.subscribersByPlan(),
  queryFn: fetchSubscribersByPlan,
});

export async function fetchRecentPayments(): Promise<PaymentRecord[]> {
  const now = new Date();
  const daysAgo = (n: number) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - n).toISOString();

  return delay([
    {
      id: "pay_1",
      customerName: "James Kim",
      customerInitials: "JK",
      planKey: "enterprise",
      date: daysAgo(6),
      amount: 4_990,
      currency: "USD",
      status: "paid",
    },
    {
      id: "pay_2",
      customerName: "Sarah Nath",
      customerInitials: "SN",
      planKey: "pro",
      date: daysAgo(21),
      amount: 79,
      currency: "USD",
      status: "paid",
    },
    {
      id: "pay_3",
      customerName: "Marcus Williams",
      customerInitials: "MW",
      planKey: "business",
      date: daysAgo(33),
      amount: 1_990,
      currency: "USD",
      status: "paid",
    },
    {
      id: "pay_4",
      customerName: "Elena Rodriguez",
      customerInitials: "ER",
      planKey: "starter",
      date: daysAgo(56),
      amount: 29,
      currency: "USD",
      status: "failed",
    },
    {
      id: "pay_5",
      customerName: "Riya Patel",
      customerInitials: "RP",
      planKey: "pro",
      date: daysAgo(88),
      amount: 79,
      currency: "USD",
      status: "refunded",
    },
  ]);
}

export const recentPaymentsQueryOptions = queryOptions({
  queryKey: dashboardKeys.recentPayments(),
  queryFn: fetchRecentPayments,
});

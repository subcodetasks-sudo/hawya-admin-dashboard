import { queryOptions } from "@tanstack/react-query";

import { claudeUsageKeys } from "@/features/claude-usage/query-keys";
import type {
  ClaudeUsageOverview,
  DailyRequestsPoint,
  TokenConsumptionPoint,
  TopApiUser,
} from "@/features/claude-usage/types";

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

export async function fetchClaudeUsageOverview(): Promise<ClaudeUsageOverview> {
  return delay({
    successRate: {
      value: 98.7,
      delta: { value: 0.3, direction: "up", period: "vsLastMonth" },
    },
    tokensSent: {
      value: 73_600_000,
      delta: { value: 12.5, direction: "up", period: "vsLastMonth" },
    },
    requests: {
      value: 1_240_000,
      delta: { value: 18.2, direction: "up", period: "vsLastMonth" },
    },
    remainingQuota: { value: 67.8, renewalInDays: 12 },
    avgResponseTimeMs: { value: 142, deltaMs: -18, direction: "down" },
    requestCost: {
      value: 16_112,
      currency: "USD",
      delta: { value: 8.4, direction: "down", period: "vsLastMonth" },
    },
  });
}

export const claudeUsageOverviewQueryOptions = queryOptions({
  queryKey: claudeUsageKeys.overview(),
  queryFn: fetchClaudeUsageOverview,
});

export async function fetchTokenConsumptionTrend(): Promise<TokenConsumptionPoint[]> {
  const now = new Date();
  const shape = [7.2, 8.1, 8.7, 8.9, 8.3, 7.6, 7.1];

  const points: TokenConsumptionPoint[] = shape.map((value, index) => {
    const daysAgo = shape.length - 1 - index;
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);

    return { date: date.toISOString(), tokens: Math.round(value * 1_000_000) };
  });

  return delay(points);
}

export const tokenConsumptionTrendQueryOptions = queryOptions({
  queryKey: claudeUsageKeys.tokenConsumptionTrend(),
  queryFn: fetchTokenConsumptionTrend,
});

export async function fetchDailyRequestsTrend(): Promise<DailyRequestsPoint[]> {
  const now = new Date();
  const shape = [186, 172, 165, 158, 142, 121, 108];

  const points: DailyRequestsPoint[] = shape.map((value, index) => {
    const daysAgo = shape.length - 1 - index;
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);

    return { date: date.toISOString(), requests: value * 1_000 };
  });

  return delay(points);
}

export const dailyRequestsTrendQueryOptions = queryOptions({
  queryKey: claudeUsageKeys.dailyRequestsTrend(),
  queryFn: fetchDailyRequestsTrend,
});

export async function fetchTopApiUsers(): Promise<TopApiUser[]> {
  return delay([
    {
      id: "api_user_james_kim",
      name: "James Kim",
      initials: "JK",
      planKey: "enterprise",
      requests: 891_243,
      tokens: 892_000_000,
      cost: 2_890,
      currency: "USD",
      usagePercent: 92,
      status: "active",
    },
    {
      id: "api_user_marcus_williams",
      name: "Marcus Williams",
      initials: "MW",
      planKey: "business",
      requests: 234_891,
      tokens: 235_000_000,
      cost: 940,
      currency: "USD",
      usagePercent: 47,
      status: "active",
    },
    {
      id: "api_user_thomas_muller",
      name: "Thomas Muller",
      initials: "TM",
      planKey: "business",
      requests: 156_789,
      tokens: 157_000_000,
      cost: 627,
      currency: "USD",
      usagePercent: 31,
      status: "active",
    },
    {
      id: "api_user_sarah_chen",
      name: "Sarah Chen",
      initials: "SC",
      planKey: "pro",
      requests: 87_432,
      tokens: 87_000_000,
      cost: 437,
      currency: "USD",
      usagePercent: 87,
      status: "active",
    },
    {
      id: "api_user_li_wei",
      name: "Li Wei",
      initials: "LW",
      planKey: "pro",
      requests: 67_234,
      tokens: 67_000_000,
      cost: 336,
      currency: "USD",
      usagePercent: 34,
      status: "active",
    },
    {
      id: "api_user_priya_patel",
      name: "Priya Patel",
      initials: "PP",
      planKey: "pro",
      requests: 45_672,
      tokens: 46_000_000,
      cost: 228,
      currency: "USD",
      usagePercent: 91,
      status: "limitExceeded",
    },
    {
      id: "api_user_elena_rodriguez",
      name: "Elena Rodriguez",
      initials: "ER",
      planKey: "starter",
      requests: 9_821,
      tokens: 9_800_000,
      cost: 49,
      currency: "USD",
      usagePercent: 98,
      status: "limitExceeded",
    },
    {
      id: "api_user_aisha_okonkwo",
      name: "Aisha Okonkwo",
      initials: "AO",
      planKey: "starter",
      requests: 3_421,
      tokens: 3_400_000,
      cost: 17,
      currency: "USD",
      usagePercent: 34,
      status: "active",
    },
  ]);
}

export const topApiUsersQueryOptions = queryOptions({
  queryKey: claudeUsageKeys.topUsers(),
  queryFn: fetchTopApiUsers,
});

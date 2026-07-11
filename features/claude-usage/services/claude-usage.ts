import { queryOptions } from "@tanstack/react-query";

import { apiGet, apiPut } from "@/lib/api-client";
import { claudeUsageKeys } from "@/features/claude-usage/query-keys";
import type {
  AiSettings,
  TopApiUser,
  TrendPoint,
  UpdateAiSettingsInput,
  UsageMetric,
  UsageSummary,
} from "@/features/claude-usage/types";

type UsageSummaryResponse = {
  total_requests: number;
  total_tokens: number;
  success_rate_percent: number;
  failed_requests: number;
  avg_response_time_ms: number;
  remaining_quota_percent: number;
};

export async function fetchUsageSummary(): Promise<UsageSummary> {
  const data = await apiGet<UsageSummaryResponse>("/admin/usage/summary");

  return {
    totalRequests: data.total_requests,
    totalTokens: data.total_tokens,
    successRatePercent: data.success_rate_percent,
    failedRequests: data.failed_requests,
    avgResponseTimeMs: data.avg_response_time_ms,
    remainingQuotaPercent: data.remaining_quota_percent,
  };
}

export const usageSummaryQueryOptions = queryOptions({
  queryKey: claudeUsageKeys.summary(),
  queryFn: fetchUsageSummary,
});

const TREND_DAYS = 7;

type UsageTrendResponse = { points: TrendPoint[] };

export async function fetchUsageTrend(metric: UsageMetric): Promise<TrendPoint[]> {
  const data = await apiGet<UsageTrendResponse>(
    `/admin/usage/trend?days=${TREND_DAYS}&metric=${metric}`,
  );

  return data.points;
}

export const tokensTrendQueryOptions = queryOptions({
  queryKey: claudeUsageKeys.trend("tokens", TREND_DAYS),
  queryFn: () => fetchUsageTrend("tokens"),
});

export const requestsTrendQueryOptions = queryOptions({
  queryKey: claudeUsageKeys.trend("requests", TREND_DAYS),
  queryFn: () => fetchUsageTrend("requests"),
});

const TOP_USERS_LIMIT = 8;

type TopApiUserResponse = {
  user_id: string;
  display_name: string;
  plan_name: string;
  requests: number;
  tokens: number;
  limit: number;
  usage_percent: number;
  status: string;
};

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export async function fetchTopApiUsers(): Promise<TopApiUser[]> {
  const data = await apiGet<TopApiUserResponse[]>(
    `/admin/usage/top-users?limit=${TOP_USERS_LIMIT}`,
  );

  return data.map((user) => ({
    id: user.user_id,
    name: user.display_name,
    initials: initialsFrom(user.display_name),
    planName: user.plan_name,
    requests: user.requests,
    tokens: user.tokens,
    limit: user.limit,
    usagePercent: user.usage_percent,
    status: user.status,
    // No backend field for per-user request cost yet — omitted until one exists.
  }));
}

export const topApiUsersQueryOptions = queryOptions({
  queryKey: claudeUsageKeys.topUsers(TOP_USERS_LIMIT),
  queryFn: fetchTopApiUsers,
});

type AiSettingsResponse = {
  monthly_budget_usd: number;
  current_spend_usd: number;
  percent_used: number;
  month: string;
  updated_at: string;
};

function mapAiSettings(data: AiSettingsResponse): AiSettings {
  return {
    monthlyBudgetUsd: data.monthly_budget_usd,
    currentSpendUsd: data.current_spend_usd,
    percentUsed: data.percent_used,
    month: data.month,
    updatedAt: data.updated_at,
  };
}

export async function fetchAiSettings(): Promise<AiSettings> {
  const data = await apiGet<AiSettingsResponse>("/admin/ai-settings");
  return mapAiSettings(data);
}

export const aiSettingsQueryOptions = queryOptions({
  queryKey: claudeUsageKeys.aiSettings(),
  queryFn: fetchAiSettings,
});

export async function updateAiSettings(input: UpdateAiSettingsInput): Promise<AiSettings> {
  const data = await apiPut<AiSettingsResponse>("/admin/ai-settings", {
    monthly_budget_usd: input.monthlyBudgetUsd,
  });

  return mapAiSettings(data);
}

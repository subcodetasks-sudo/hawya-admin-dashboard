import type { UsageMetric } from "@/features/claude-usage/types";

export const claudeUsageKeys = {
  all: ["claude-usage"] as const,
  summary: () => [...claudeUsageKeys.all, "summary"] as const,
  trend: (metric: UsageMetric, days: number) =>
    [...claudeUsageKeys.all, "trend", metric, days] as const,
  topUsers: (limit: number) => [...claudeUsageKeys.all, "top-users", limit] as const,
  aiSettings: () => [...claudeUsageKeys.all, "ai-settings"] as const,
};

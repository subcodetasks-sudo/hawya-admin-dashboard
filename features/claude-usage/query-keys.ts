import type { UsageMetric } from "@/features/claude-usage/types";

export const claudeUsageKeys = {
  all: ["claude-usage"] as const,
  summary: () => [...claudeUsageKeys.all, "summary"] as const,
  trend: (metric: UsageMetric, days: number) =>
    [...claudeUsageKeys.all, "trend", metric, days] as const,
  topUsers: (limit: number) => [...claudeUsageKeys.all, "top-users", limit] as const,
  aiSettings: () => [...claudeUsageKeys.all, "ai-settings"] as const,
};

export const anthropicUsageKeys = {
  all: ["anthropic-usage"] as const,
  summary: () => [...anthropicUsageKeys.all, "summary"] as const,
  balance: () => [...anthropicUsageKeys.all, "balance"] as const,
  workspaces: () => [...anthropicUsageKeys.all, "workspaces"] as const,
  costReport: (startingAt: string, endingAt?: string) =>
    [...anthropicUsageKeys.all, "cost-report", startingAt, endingAt ?? null] as const,
  usageReport: (startingAt: string, endingAt?: string) =>
    [...anthropicUsageKeys.all, "usage-report", startingAt, endingAt ?? null] as const,
};

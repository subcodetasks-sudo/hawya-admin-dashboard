export const claudeUsageKeys = {
  all: ["claude-usage"] as const,
  overview: () => [...claudeUsageKeys.all, "overview"] as const,
  tokenConsumptionTrend: () => [...claudeUsageKeys.all, "token-consumption-trend"] as const,
  dailyRequestsTrend: () => [...claudeUsageKeys.all, "daily-requests-trend"] as const,
  topUsers: () => [...claudeUsageKeys.all, "top-users"] as const,
};

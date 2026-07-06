export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  revenueTrend: () => [...dashboardKeys.all, "revenue-trend"] as const,
  apiUsageTrend: () => [...dashboardKeys.all, "api-usage-trend"] as const,
  subscribersByPlan: () => [...dashboardKeys.all, "subscribers-by-plan"] as const,
  recentPayments: () => [...dashboardKeys.all, "recent-payments"] as const,
};

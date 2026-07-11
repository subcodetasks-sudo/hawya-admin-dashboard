export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  revenueTrend: () => [...dashboardKeys.all, "revenue-trend"] as const,
  usageTrend: () => [...dashboardKeys.all, "usage-trend"] as const,
  subscribersByPlan: () => [...dashboardKeys.all, "subscribers-by-plan"] as const,
  platformStats: () => [...dashboardKeys.all, "platform-stats"] as const,
  recentPayments: () => [...dashboardKeys.all, "recent-payments"] as const,
};

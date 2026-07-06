export type TrendDirection = "up" | "down";

export type StatDelta = {
  value: number;
  direction: TrendDirection;
  period: "vsYesterday" | "vsLastMonth" | "vsLastWeek";
};

export type DashboardOverview = {
  apiRequestsToday: { value: number; delta: StatDelta };
  activeUsers: { value: number; delta: StatDelta };
  activeSubscriptions: { value: number; delta: StatDelta };
  monthlyRevenue: { value: number; currency: string; delta: StatDelta };
  avgResponseTimeMs: { value: number; deltaMs: number; direction: TrendDirection };
  activePlans: { value: number };
  growthRate: { value: number; delta: StatDelta };
  netRevenue: { value: number; currency: string; delta: StatDelta };
};

export type RevenueTrendPoint = {
  month: string;
  revenue: number;
};

export type ApiUsageTrendPoint = {
  date: string;
  requests: number;
};

export type PlanKey = "starter" | "pro" | "business" | "enterprise";

export type PlanBreakdown = {
  plan: PlanKey;
  subscribers: number;
};

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type PaymentRecord = {
  id: string;
  customerName: string;
  customerInitials: string;
  planKey: PlanKey;
  date: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
};

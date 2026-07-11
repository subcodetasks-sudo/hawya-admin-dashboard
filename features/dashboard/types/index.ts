export type TrendPoint = {
  label: string;
  value: number;
};

export type DashboardStats = {
  apiRequestsToday: number;
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  availablePlans: number;
  growthRatePercent: number;
  avgResponseTimeMs: number;
  visits: number;
};

export type PlanSlice = {
  planName: string;
  count: number;
};

export type SubscribersByPlan = {
  slices: PlanSlice[];
  total: number;
};

export type PlatformStats = {
  totalUsers: number;
  verifiedUsers: number;
  activeSubscriptions: number;
  crawlsToday: number;
  aiCallsToday: number;
};

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type PaymentRecord = {
  id: string;
  customerName: string;
  customerInitials: string;
  planName: string;
  date: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
};

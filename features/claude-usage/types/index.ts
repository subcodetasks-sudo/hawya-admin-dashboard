export type TrendDirection = "up" | "down";

export type StatDelta = {
  value: number;
  direction: TrendDirection;
  period: "vsYesterday" | "vsLastWeek" | "vsLastMonth";
};

export type ClaudeUsageOverview = {
  successRate: { value: number; delta: StatDelta };
  tokensSent: { value: number; delta: StatDelta };
  requests: { value: number; delta: StatDelta };
  remainingQuota: { value: number; renewalInDays: number };
  avgResponseTimeMs: { value: number; deltaMs: number; direction: TrendDirection };
  requestCost: { value: number; currency: string; delta: StatDelta };
};

export type TokenConsumptionPoint = {
  date: string;
  tokens: number;
};

export type DailyRequestsPoint = {
  date: string;
  requests: number;
};

export type ApiUserPlanKey = "starter" | "pro" | "business" | "enterprise";

export type ApiUserStatus = "active" | "limitExceeded";

export type TopApiUser = {
  id: string;
  name: string;
  initials: string;
  planKey: ApiUserPlanKey;
  requests: number;
  tokens: number;
  cost: number;
  currency: string;
  usagePercent: number;
  status: ApiUserStatus;
};

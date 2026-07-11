export type TrendPoint = {
  label: string;
  value: number;
};

export type UsageMetric = "tokens" | "requests";

export type UsageSummary = {
  totalRequests: number;
  totalTokens: number;
  successRatePercent: number;
  failedRequests: number;
  avgResponseTimeMs: number;
  remainingQuotaPercent: number;
};

export type TopApiUser = {
  id: string;
  name: string;
  initials: string;
  planName: string;
  requests: number;
  tokens: number;
  limit: number;
  usagePercent: number;
  status: string;
};

export type AiSettings = {
  monthlyBudgetUsd: number;
  currentSpendUsd: number;
  percentUsed: number;
  month: string;
  updatedAt: string;
};

export type UpdateAiSettingsInput = {
  monthlyBudgetUsd: number;
};

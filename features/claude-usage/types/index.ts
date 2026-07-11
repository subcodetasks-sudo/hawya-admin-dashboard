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

export type AnthropicModelCost = {
  model: string;
  amount: string;
  currency: string;
};

export type AnthropicModelUsage = {
  model: string;
  inputTokens: number;
  outputTokens: number;
};

export type AnthropicDailyCost = {
  startingAt: string;
  endingAt: string;
  results: AnthropicModelCost[];
};

export type AnthropicDailyUsage = {
  startingAt: string;
  endingAt: string;
  results: AnthropicModelUsage[];
};

export type AnthropicUsageSummary = {
  month: string;
  realCostUsd: number;
  inputTokens: number;
  outputTokens: number;
  dailyCost: AnthropicDailyCost[];
  dailyUsage: AnthropicDailyUsage[];
  knownBalanceUsd: number;
  balanceRecordedAt: string;
  costSinceBalanceRecorded: number;
  remainingUsd: number;
};

export type AnthropicBalance = {
  knownBalanceUsd: number;
  balanceRecordedAt: string;
};

export type UpdateAnthropicBalanceInput = {
  knownBalanceUsd: number;
};

export type AnthropicWorkspace = {
  id: string;
  type: string;
  name: string;
  createdAt: string;
  archivedAt: string | null;
  displayColor: string;
};

export type DateRange = {
  startingAt: string;
  endingAt?: string;
};

import { queryOptions } from "@tanstack/react-query";

import { apiGet, apiPut } from "@/lib/api-client";
import { anthropicUsageKeys } from "@/features/claude-usage/query-keys";
import type {
  AnthropicBalance,
  AnthropicDailyCost,
  AnthropicDailyUsage,
  AnthropicUsageSummary,
  AnthropicWorkspace,
  UpdateAnthropicBalanceInput,
} from "@/features/claude-usage/types";

type AnthropicModelCostResponse = {
  model: string;
  amount: string;
  currency: string;
};

type AnthropicModelUsageResponse = {
  model: string;
  input_tokens: number;
  output_tokens: number;
};

type AnthropicDailyCostResponse = {
  starting_at: string;
  ending_at: string;
  results: AnthropicModelCostResponse[];
};

type AnthropicDailyUsageResponse = {
  starting_at: string;
  ending_at: string;
  results: AnthropicModelUsageResponse[];
};

function mapDailyCost(entry: AnthropicDailyCostResponse): AnthropicDailyCost {
  return {
    startingAt: entry.starting_at,
    endingAt: entry.ending_at,
    results: entry.results,
  };
}

function mapDailyUsage(entry: AnthropicDailyUsageResponse): AnthropicDailyUsage {
  return {
    startingAt: entry.starting_at,
    endingAt: entry.ending_at,
    results: entry.results.map((result) => ({
      model: result.model,
      inputTokens: result.input_tokens,
      outputTokens: result.output_tokens,
    })),
  };
}

type AnthropicUsageSummaryResponse = {
  month: string;
  real_cost_usd: number;
  tokens: {
    input_tokens: number;
    output_tokens: number;
  };
  daily_cost: AnthropicDailyCostResponse[];
  daily_usage: AnthropicDailyUsageResponse[];
  known_balance_usd: number;
  balance_recorded_at: string;
  cost_since_balance_recorded: number;
  remaining_usd: number;
};

export async function fetchAnthropicUsageSummary(): Promise<AnthropicUsageSummary> {
  const data = await apiGet<AnthropicUsageSummaryResponse>(
    "/admin/anthropic/usage-summary",
  );

  return {
    month: data.month,
    realCostUsd: data.real_cost_usd,
    inputTokens: data.tokens.input_tokens,
    outputTokens: data.tokens.output_tokens,
    dailyCost: data.daily_cost.map(mapDailyCost),
    dailyUsage: data.daily_usage.map(mapDailyUsage),
    knownBalanceUsd: data.known_balance_usd,
    balanceRecordedAt: data.balance_recorded_at,
    costSinceBalanceRecorded: data.cost_since_balance_recorded,
    remainingUsd: data.remaining_usd,
  };
}

export const anthropicUsageSummaryQueryOptions = queryOptions({
  queryKey: anthropicUsageKeys.summary(),
  queryFn: fetchAnthropicUsageSummary,
});

type AnthropicBalanceResponse = {
  known_balance_usd: number;
  balance_recorded_at: string;
};

function mapBalance(data: AnthropicBalanceResponse): AnthropicBalance {
  return {
    knownBalanceUsd: data.known_balance_usd,
    balanceRecordedAt: data.balance_recorded_at,
  };
}

export async function fetchAnthropicBalance(): Promise<AnthropicBalance> {
  const data = await apiGet<AnthropicBalanceResponse>("/admin/anthropic/balance");
  return mapBalance(data);
}

export const anthropicBalanceQueryOptions = queryOptions({
  queryKey: anthropicUsageKeys.balance(),
  queryFn: fetchAnthropicBalance,
});

export async function updateAnthropicBalance(
  input: UpdateAnthropicBalanceInput,
): Promise<AnthropicBalance> {
  const data = await apiPut<AnthropicBalanceResponse>("/admin/anthropic/balance", {
    known_balance_usd: input.knownBalanceUsd,
  });

  return mapBalance(data);
}

function buildDateRangeQuery(startingAt: string, endingAt?: string) {
  const params = new URLSearchParams({ starting_at: startingAt });

  if (endingAt) {
    params.set("ending_at", endingAt);
  }

  return params.toString();
}

export async function fetchAnthropicCostReport(
  startingAt: string,
  endingAt?: string,
): Promise<AnthropicDailyCost[]> {
  const data = await apiGet<AnthropicDailyCostResponse[]>(
    `/admin/anthropic/cost-report?${buildDateRangeQuery(startingAt, endingAt)}`,
  );

  return data.map(mapDailyCost);
}

export function anthropicCostReportQueryOptions(startingAt: string, endingAt?: string) {
  return queryOptions({
    queryKey: anthropicUsageKeys.costReport(startingAt, endingAt),
    queryFn: () => fetchAnthropicCostReport(startingAt, endingAt),
  });
}

export async function fetchAnthropicUsageReport(
  startingAt: string,
  endingAt?: string,
): Promise<AnthropicDailyUsage[]> {
  const data = await apiGet<AnthropicDailyUsageResponse[]>(
    `/admin/anthropic/usage-report?${buildDateRangeQuery(startingAt, endingAt)}`,
  );

  return data.map(mapDailyUsage);
}

export function anthropicUsageReportQueryOptions(startingAt: string, endingAt?: string) {
  return queryOptions({
    queryKey: anthropicUsageKeys.usageReport(startingAt, endingAt),
    queryFn: () => fetchAnthropicUsageReport(startingAt, endingAt),
  });
}

type AnthropicWorkspaceResponse = {
  id: string;
  type: string;
  name: string;
  created_at: string;
  archived_at: string | null;
  display_color: string;
};

export async function fetchAnthropicWorkspaces(): Promise<AnthropicWorkspace[]> {
  const data = await apiGet<AnthropicWorkspaceResponse[]>("/admin/anthropic/workspaces");

  return data.map((workspace) => ({
    id: workspace.id,
    type: workspace.type,
    name: workspace.name,
    createdAt: workspace.created_at,
    archivedAt: workspace.archived_at,
    displayColor: workspace.display_color,
  }));
}

export const anthropicWorkspacesQueryOptions = queryOptions({
  queryKey: anthropicUsageKeys.workspaces(),
  queryFn: fetchAnthropicWorkspaces,
});

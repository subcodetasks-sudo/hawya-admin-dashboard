"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowDownToLine, ArrowUpFromLine, DollarSign, TrendingDown, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import UsageStatCard from "@/features/claude-usage/components/usage-stat-card";
import { anthropicUsageSummaryQueryOptions } from "@/features/claude-usage/services/anthropic-usage";
import { formatCurrency, formatNumber } from "@/lib/format";

export default function AnthropicStatsGrid() {
  const t = useTranslations("ClaudeUsage.anthropic");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(anthropicUsageSummaryQueryOptions);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">{t("stats.loadError")}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <UsageStatCard
        icon={DollarSign}
        label={t("stats.realCost")}
        value={formatCurrency(data.realCostUsd, "USD", locale)}
      />
      <UsageStatCard
        icon={Wallet}
        label={t("stats.remaining")}
        value={formatCurrency(data.remainingUsd, "USD", locale)}
      />
      <UsageStatCard
        icon={TrendingDown}
        label={t("stats.costSinceRecorded")}
        value={formatCurrency(data.costSinceBalanceRecorded, "USD", locale)}
      />
      <UsageStatCard
        icon={ArrowDownToLine}
        label={t("stats.inputTokens")}
        value={formatNumber(data.inputTokens, locale, {
          notation: "compact",
          maximumFractionDigits: 1,
        })}
      />
      <UsageStatCard
        icon={ArrowUpFromLine}
        label={t("stats.outputTokens")}
        value={formatNumber(data.outputTokens, locale, {
          notation: "compact",
          maximumFractionDigits: 1,
        })}
      />
    </div>
  );
}

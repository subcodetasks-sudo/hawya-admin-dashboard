"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, Clock, Database, Send, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import UsageStatCard from "@/features/claude-usage/components/usage-stat-card";
import { usageSummaryQueryOptions } from "@/features/claude-usage/services/claude-usage";
import { formatNumber, formatPercent } from "@/lib/format";

export default function UsageStatsGrid() {
  const t = useTranslations("ClaudeUsage");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(usageSummaryQueryOptions);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
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
        icon={Activity}
        label={t("stats.totalRequests")}
        value={formatNumber(data.totalRequests, locale, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
      />
      <UsageStatCard
        icon={Send}
        label={t("stats.totalTokens")}
        value={formatNumber(data.totalTokens, locale, {
          notation: "compact",
          maximumFractionDigits: 1,
        })}
      />
      <UsageStatCard
        icon={ShieldCheck}
        label={t("stats.successRate")}
        value={formatPercent(data.successRatePercent, locale).replace(/^[+-]/, "")}
      />
      <UsageStatCard
        icon={AlertTriangle}
        label={t("stats.failedRequests")}
        value={formatNumber(data.failedRequests, locale, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
      />
      <UsageStatCard
        icon={Clock}
        label={t("stats.avgResponseTime")}
        value={`${formatNumber(data.avgResponseTimeMs, locale)}ms`}
      />
      <UsageStatCard
        icon={Database}
        label={t("stats.remainingQuota")}
        value={formatPercent(data.remainingQuotaPercent, locale).replace(/^[+-]/, "")}
        // Backend doesn't return a quota renewal date yet, so no sublabel here.
      />
    </div>
  );
}

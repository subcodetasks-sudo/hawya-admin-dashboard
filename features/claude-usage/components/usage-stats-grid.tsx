"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Clock, DollarSign, Send, ShieldCheck, Database } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import UsageStatCard from "@/features/claude-usage/components/usage-stat-card";
import { claudeUsageOverviewQueryOptions } from "@/features/claude-usage/services/claude-usage";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

export default function UsageStatsGrid() {
  const t = useTranslations("ClaudeUsage");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(claudeUsageOverviewQueryOptions);

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
    return (
      <p className="text-sm text-destructive">{t("table.loadError")}</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <UsageStatCard
        icon={ShieldCheck}
        label={t("stats.successRate")}
        value={formatPercent(data.successRate.value, locale).replace(/^[+-]/, "")}
        deltaLabel={`${formatPercent(data.successRate.delta.value, locale)} ${t(`compare.${data.successRate.delta.period}`)}`}
        direction={data.successRate.delta.direction}
      />
      <UsageStatCard
        icon={Send}
        label={t("stats.tokensSent")}
        value={formatNumber(data.tokensSent.value, locale, {
          notation: "compact",
          maximumFractionDigits: 1,
        })}
        deltaLabel={`${formatPercent(data.tokensSent.delta.value, locale)} ${t(`compare.${data.tokensSent.delta.period}`)}`}
        direction={data.tokensSent.delta.direction}
      />
      <UsageStatCard
        icon={Activity}
        label={t("stats.requests")}
        value={formatNumber(data.requests.value, locale, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
        deltaLabel={`${formatPercent(data.requests.delta.value, locale)} ${t(`compare.${data.requests.delta.period}`)}`}
        direction={data.requests.delta.direction}
      />
      <UsageStatCard
        icon={Database}
        label={t("stats.remainingQuota")}
        value={formatPercent(data.remainingQuota.value, locale).replace(/^[+-]/, "")}
        deltaLabel={t("remainingQuota.renewsIn", { days: data.remainingQuota.renewalInDays })}
      />
      <UsageStatCard
        icon={Clock}
        label={t("stats.avgResponseTime")}
        value={`${formatNumber(data.avgResponseTimeMs.value, locale)}ms`}
        deltaLabel={`${formatNumber(data.avgResponseTimeMs.deltaMs, locale, { signDisplay: "always" })}ms ${t("compare.vsLastMonth")}`}
        direction={data.avgResponseTimeMs.direction}
      />
      <UsageStatCard
        icon={DollarSign}
        label={t("stats.requestCost")}
        value={formatCurrency(data.requestCost.value, data.requestCost.currency, locale, {
          notation: "compact",
          maximumFractionDigits: 1,
        })}
        deltaLabel={`${formatPercent(
          data.requestCost.delta.direction === "down"
            ? -data.requestCost.delta.value
            : data.requestCost.delta.value,
          locale,
        )} ${t(`compare.${data.requestCost.delta.period}`)}`}
        direction={data.requestCost.delta.direction}
      />
    </div>
  );
}

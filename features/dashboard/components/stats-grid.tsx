"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Clock,
  CreditCard,
  Layers,
  LineChart,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import StatCard from "@/features/dashboard/components/stat-card";
import { dashboardOverviewQueryOptions } from "@/features/dashboard/services/dashboard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsGrid() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(dashboardOverviewQueryOptions);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        {t("stats.apiRequestsToday")} — unable to load.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        icon={Zap}
        label={t("stats.apiRequestsToday")}
        value={formatNumber(data.apiRequestsToday.value, locale, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
        deltaLabel={`${formatPercent(data.apiRequestsToday.delta.value, locale)} ${t(`compare.${data.apiRequestsToday.delta.period}`)}`}
        direction={data.apiRequestsToday.delta.direction}
      />
      <StatCard
        icon={Users}
        label={t("stats.activeUsers")}
        value={formatNumber(data.activeUsers.value, locale)}
        deltaLabel={`${formatPercent(data.activeUsers.delta.value, locale)} ${t(`compare.${data.activeUsers.delta.period}`)}`}
        direction={data.activeUsers.delta.direction}
      />
      <StatCard
        icon={CreditCard}
        label={t("stats.activeSubscriptions")}
        value={formatNumber(data.activeSubscriptions.value, locale)}
        deltaLabel={`${formatPercent(data.activeSubscriptions.delta.value, locale)} ${t(`compare.${data.activeSubscriptions.delta.period}`)}`}
        direction={data.activeSubscriptions.delta.direction}
      />
      <StatCard
        icon={Wallet}
        label={t("stats.monthlyRevenue")}
        value={formatCurrency(
          data.monthlyRevenue.value,
          data.monthlyRevenue.currency,
          locale,
        )}
        deltaLabel={`${formatPercent(data.monthlyRevenue.delta.value, locale)} ${t(`compare.${data.monthlyRevenue.delta.period}`)}`}
        direction={data.monthlyRevenue.delta.direction}
      />
      <StatCard
        icon={Clock}
        label={t("stats.avgResponseTime")}
        value={`${formatNumber(data.avgResponseTimeMs.value, locale)}ms`}
        deltaLabel={`${data.avgResponseTimeMs.deltaMs}ms`}
        direction={data.avgResponseTimeMs.direction}
      />
      <StatCard
        icon={Layers}
        label={t("stats.activePlans")}
        value={formatNumber(data.activePlans.value, locale)}
      />
      <StatCard
        icon={LineChart}
        label={t("stats.growthRate")}
        value={formatPercent(data.growthRate.value, locale).replace(/^[+-]/, "")}
        deltaLabel={`${formatPercent(data.growthRate.delta.value, locale)} ${t(`compare.${data.growthRate.delta.period}`)}`}
        direction={data.growthRate.delta.direction}
      />
      <StatCard
        icon={Activity}
        label={t("stats.netRevenue")}
        value={formatCurrency(data.netRevenue.value, data.netRevenue.currency, locale, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
        deltaLabel={`${formatPercent(data.netRevenue.delta.value, locale)} ${t(`compare.${data.netRevenue.delta.period}`)}`}
        direction={data.netRevenue.delta.direction}
        highlight
      />
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Clock,
  CreditCard,
  Eye,
  Layers,
  LineChart,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/features/dashboard/components/stat-card";
import { dashboardStatsQueryOptions } from "@/features/dashboard/services/dashboard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

export default function StatsGrid() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(dashboardStatsQueryOptions);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        {t("stats.title")} — {t("stats.loadError")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <StatCard
        icon={Zap}
        label={t("stats.apiRequestsToday")}
        value={formatNumber(data.apiRequestsToday, locale, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
      />
      <StatCard
        icon={Users}
        label={t("stats.totalUsers")}
        value={formatNumber(data.totalUsers, locale)}
      />
      <StatCard
        icon={CreditCard}
        label={t("stats.activeSubscriptions")}
        value={formatNumber(data.activeSubscriptions, locale)}
      />
      <StatCard
        icon={Wallet}
        label={t("stats.monthlyRevenue")}
        value={formatCurrency(data.monthlyRevenue, "USD", locale, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
      />
      <StatCard
        icon={Activity}
        label={t("stats.yearlyRevenue")}
        value={formatCurrency(data.yearlyRevenue, "USD", locale, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
        highlight
      />
      <StatCard
        icon={Layers}
        label={t("stats.availablePlans")}
        value={formatNumber(data.availablePlans, locale)}
      />
      <StatCard
        icon={LineChart}
        label={t("stats.growthRate")}
        value={formatPercent(data.growthRatePercent, locale).replace(/^[+-]/, "")}
      />
      <StatCard
        icon={Clock}
        label={t("stats.avgResponseTime")}
        value={`${formatNumber(data.avgResponseTimeMs, locale)}ms`}
      />
      <StatCard
        icon={Eye}
        label={t("stats.visits")}
        value={formatNumber(data.visits, locale)}
      />
    </div>
  );
}

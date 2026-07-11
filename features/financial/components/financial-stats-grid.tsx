"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, DollarSign, LineChart, RotateCcw, TrendingUp, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import FinancialStatCard from "@/features/financial/components/financial-stat-card";
import { financialSummaryQueryOptions } from "@/features/financial/services/financial";
import { formatCurrency } from "@/lib/format";

export default function FinancialStatsGrid() {
  const t = useTranslations("Financial");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(financialSummaryQueryOptions);

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

  function money(value: number) {
    return formatCurrency(value, "USD", locale, {
      notation: "compact",
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <FinancialStatCard icon={Wallet} label={t("stats.mrr")} value={money(data.mrr)} />
      <FinancialStatCard
        icon={TrendingUp}
        label={t("stats.yearlyRevenue")}
        value={money(data.yearlyRevenue)}
      />
      <FinancialStatCard
        icon={DollarSign}
        label={t("stats.monthlyRevenue")}
        value={money(data.monthlyRevenue)}
      />
      <FinancialStatCard
        icon={RotateCcw}
        label={t("stats.refundsThisMonth")}
        value={money(data.refundsThisMonth)}
      />
      <FinancialStatCard
        icon={Clock}
        label={t("stats.pendingPayments")}
        value={money(data.pendingPayments)}
      />
      <FinancialStatCard icon={LineChart} label={t("stats.arr")} value={money(data.arr)} highlight />
    </div>
  );
}

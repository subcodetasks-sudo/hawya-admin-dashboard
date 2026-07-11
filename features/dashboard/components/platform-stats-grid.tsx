"use client";

import { useQuery } from "@tanstack/react-query";
import { Bot, CreditCard, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/features/dashboard/components/stat-card";
import { platformStatsQueryOptions } from "@/features/dashboard/services/dashboard";
import { formatNumber } from "@/lib/format";

export default function PlatformStatsGrid() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(platformStatsQueryOptions);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        {t("platformStats.title")} — {t("stats.loadError")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      <StatCard
        icon={Users}
        label={t("platformStats.totalUsers")}
        value={formatNumber(data.totalUsers, locale)}
      />
      <StatCard
        icon={ShieldCheck}
        label={t("platformStats.verifiedUsers")}
        value={formatNumber(data.verifiedUsers, locale)}
      />
      <StatCard
        icon={CreditCard}
        label={t("platformStats.activeSubscriptions")}
        value={formatNumber(data.activeSubscriptions, locale)}
      />
      <StatCard
        icon={Bot}
        label={t("platformStats.crawlsToday")}
        value={formatNumber(data.crawlsToday, locale)}
      />
      <StatCard
        icon={Sparkles}
        label={t("platformStats.aiCallsToday")}
        value={formatNumber(data.aiCallsToday, locale, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
      />
    </div>
  );
}

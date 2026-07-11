"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { revenueByPlanQueryOptions } from "@/features/financial/services/financial";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const BAR_COLOR_VARS = [
  "var(--primary)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function colorForIndex(index: number) {
  return BAR_COLOR_VARS[index % BAR_COLOR_VARS.length];
}

export default function RevenueByPlanCard() {
  const t = useTranslations("Financial");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(revenueByPlanQueryOptions);

  const rows = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const max = Math.max(...data.map((item) => item.revenue));

    return data.map((item, index) => ({
      ...item,
      percent: max > 0 ? Math.round((item.revenue / max) * 100) : 0,
      color: colorForIndex(index),
    }));
  }, [data]);

  const isEmpty = !isLoading && !isError && rows.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("revenueByPlan.title")}</CardTitle>
        <CardDescription>{t("revenueByPlan.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-destructive">{t("revenueByPlan.loadError")}</p>
        ) : isEmpty ? (
          <p className="text-sm text-muted-foreground">{t("revenueByPlan.empty")}</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {rows.map((row) => (
              <li key={row.planName} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span
                    className={cn(
                      "inline-flex h-5 w-fit items-center rounded-full px-2 text-xs font-medium",
                    )}
                    style={{
                      backgroundColor: `color-mix(in srgb, ${row.color} 15%, transparent)`,
                      color: row.color,
                    }}
                  >
                    {row.planName}
                  </span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCurrency(row.revenue, "USD", locale, {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    })}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${row.percent}%`, backgroundColor: row.color }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

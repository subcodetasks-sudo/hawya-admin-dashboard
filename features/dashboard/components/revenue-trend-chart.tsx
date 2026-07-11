"use client";

import { useId, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { revenueTrendQueryOptions } from "@/features/dashboard/services/dashboard";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency, formatNumber } from "@/lib/format";

const chartConfig = {
  value: { label: "Revenue", color: "var(--chart-3)" },
} satisfies ChartConfig;

export default function RevenueTrendChart() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const gradientId = useId();
  const { data, isLoading, isError } = useQuery(revenueTrendQueryOptions);

  const points = useMemo(() => {
    if (!data) {
      return [];
    }

    const dateLocale = getDateFnsLocale(locale);

    return data.map((point) => ({
      ...point,
      tickLabel: format(new Date(point.label), "MMM", { locale: dateLocale }),
    }));
  }, [data, locale]);

  const isEmpty = !isLoading && !isError && points.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("charts.revenueTrend.title")}</CardTitle>
        <CardDescription>
          {t("charts.revenueTrend.subtitle", {
            year: formatNumber(new Date().getFullYear(), locale, {
              useGrouping: false,
            }),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="aspect-video w-full" />
        ) : isError || !data ? (
          <p className="text-sm text-destructive">
            {t("charts.revenueTrend.title")} — {t("charts.loadError")}
          </p>
        ) : isEmpty ? (
          <p className="text-sm text-muted-foreground">{t("charts.noData")}</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-video w-full">
            <AreaChart data={points} margin={{ left: -12, right: 12 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="tickLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={64}
                tickFormatter={(value: number) =>
                  formatCurrency(value, "USD", locale, {
                    notation: "compact",
                    maximumFractionDigits: 0,
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {t("charts.revenueTrend.title")}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatCurrency(Number(value), "USD", locale)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                dataKey="value"
                type="monotone"
                fill={`url(#${gradientId})`}
                stroke="var(--primary)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

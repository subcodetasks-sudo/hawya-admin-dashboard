"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { usageTrendQueryOptions } from "@/features/dashboard/services/dashboard";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatNumber } from "@/lib/format";

const chartConfig = {
  value: { label: "Requests", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function ApiUsageChart() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(usageTrendQueryOptions);

  const points = useMemo(() => {
    if (!data) {
      return [];
    }

    const dateLocale = getDateFnsLocale(locale);

    return data.map((point) => ({
      ...point,
      tickLabel: format(new Date(point.label), "EEE", { locale: dateLocale }),
    }));
  }, [data, locale]);

  const isEmpty = !isLoading && !isError && points.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("charts.apiUsageTrend.title")}</CardTitle>
        <CardDescription>{t("charts.apiUsageTrend.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="aspect-video w-full" />
        ) : isError || !data ? (
          <p className="text-sm text-destructive">
            {t("charts.apiUsageTrend.title")} — {t("charts.loadError")}
          </p>
        ) : isEmpty ? (
          <p className="text-sm text-muted-foreground">{t("charts.noData")}</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-video w-full">
            <BarChart data={points} margin={{ left: -12, right: 12 }}>
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
                  formatNumber(value, locale, {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {t("charts.apiUsageTrend.title")}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatNumber(Number(value), locale)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="value"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

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
import { dailyRequestsTrendQueryOptions } from "@/features/claude-usage/services/claude-usage";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatNumber } from "@/lib/format";

const chartConfig = {
  requests: { label: "Requests", color: "var(--primary)" },
} satisfies ChartConfig;

export default function DailyRequestsChart() {
  const t = useTranslations("ClaudeUsage");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(dailyRequestsTrendQueryOptions);

  const points = useMemo(() => {
    if (!data) {
      return [];
    }

    const dateLocale = getDateFnsLocale(locale);

    return data.map((point) => ({
      ...point,
      label: format(new Date(point.date), "EEE", { locale: dateLocale }),
    }));
  }, [data, locale]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("charts.dailyRequests.title")}</CardTitle>
        <CardDescription>{t("charts.dailyRequests.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="aspect-video w-full" />
        ) : isError || !data ? (
          <p className="text-sm text-destructive">
            {t("charts.dailyRequests.title")} — unable to load.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-video w-full">
            <BarChart data={points} margin={{ left: -12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
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
                          {t("charts.dailyRequests.title")}
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
                dataKey="requests"
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

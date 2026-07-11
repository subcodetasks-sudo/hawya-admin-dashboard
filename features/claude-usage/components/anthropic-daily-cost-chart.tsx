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
import { anthropicUsageSummaryQueryOptions } from "@/features/claude-usage/services/anthropic-usage";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency } from "@/lib/format";

export default function AnthropicDailyCostChart() {
  const t = useTranslations("ClaudeUsage.anthropic");
  const locale = useLocale();
  const gradientId = useId();
  const { data, isLoading, isError } = useQuery(anthropicUsageSummaryQueryOptions);

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      amount: { label: t("charts.cost.title"), color: "var(--primary)" },
    }),
    [t],
  );

  const points = useMemo(() => {
    if (!data) {
      return [];
    }

    const dateLocale = getDateFnsLocale(locale);

    return data.dailyCost.map((entry) => ({
      tickLabel: format(new Date(entry.startingAt), "d MMM", { locale: dateLocale }),
      amount: entry.results.reduce((sum, result) => sum + Number(result.amount), 0),
    }));
  }, [data, locale]);

  const isEmpty = !isLoading && !isError && points.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("charts.cost.title")}</CardTitle>
        <CardDescription>{t("charts.cost.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="aspect-video w-full" />
        ) : isError || !data ? (
          <p className="text-sm text-destructive">
            {t("charts.cost.title")} — {t("charts.loadError")}
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
                tickFormatter={(value: number) => formatCurrency(value, "USD", locale)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {t("charts.cost.title")}
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
                dataKey="amount"
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

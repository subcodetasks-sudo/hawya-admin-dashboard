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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { anthropicUsageSummaryQueryOptions } from "@/features/claude-usage/services/anthropic-usage";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatNumber } from "@/lib/format";

export default function AnthropicDailyUsageChart() {
  const t = useTranslations("ClaudeUsage.anthropic");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(anthropicUsageSummaryQueryOptions);

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      inputTokens: { label: t("stats.inputTokens"), color: "var(--primary)" },
      outputTokens: { label: t("stats.outputTokens"), color: "var(--chart-2)" },
    }),
    [t],
  );

  const points = useMemo(() => {
    if (!data) {
      return [];
    }

    const dateLocale = getDateFnsLocale(locale);

    return data.dailyUsage.map((entry) => ({
      tickLabel: format(new Date(entry.startingAt), "d MMM", { locale: dateLocale }),
      inputTokens: entry.results.reduce((sum, result) => sum + result.inputTokens, 0),
      outputTokens: entry.results.reduce((sum, result) => sum + result.outputTokens, 0),
    }));
  }, [data, locale]);

  const isEmpty = !isLoading && !isError && points.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("charts.usage.title")}</CardTitle>
        <CardDescription>{t("charts.usage.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="aspect-video w-full" />
        ) : isError || !data ? (
          <p className="text-sm text-destructive">
            {t("charts.usage.title")} — {t("charts.loadError")}
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
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]?.label}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatNumber(Number(value), locale)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="inputTokens" stackId="tokens" fill="var(--primary)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="outputTokens" stackId="tokens" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

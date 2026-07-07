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
import { tokenConsumptionTrendQueryOptions } from "@/features/claude-usage/services/claude-usage";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatNumber } from "@/lib/format";

const chartConfig = {
  tokens: { label: "Tokens", color: "var(--primary)" },
} satisfies ChartConfig;

export default function TokenConsumptionChart() {
  const t = useTranslations("ClaudeUsage");
  const locale = useLocale();
  const gradientId = useId();
  const { data, isLoading, isError } = useQuery(tokenConsumptionTrendQueryOptions);

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
        <CardTitle>{t("charts.tokenConsumption.title")}</CardTitle>
        <CardDescription>{t("charts.tokenConsumption.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="aspect-video w-full" />
        ) : isError || !data ? (
          <p className="text-sm text-destructive">
            {t("charts.tokenConsumption.title")} — unable to load.
          </p>
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
                          {t("charts.tokenConsumption.title")}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatNumber(Number(value), locale)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                dataKey="tokens"
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

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Cell, Pie, PieChart } from "recharts";

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
import { subscribersByPlanQueryOptions } from "@/features/dashboard/services/dashboard";
import { formatNumber } from "@/lib/format";

const SLICE_COLOR_VARS = [
  "var(--primary)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function colorForIndex(index: number) {
  return SLICE_COLOR_VARS[index % SLICE_COLOR_VARS.length];
}

export default function SubscribersByPlanChart() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(subscribersByPlanQueryOptions);

  const slices = useMemo(
    () =>
      (data?.slices ?? []).map((slice, index) => ({
        ...slice,
        color: colorForIndex(index),
      })),
    [data],
  );

  const chartConfig = useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        slices.map((slice) => [
          slice.planName,
          { label: slice.planName, color: slice.color },
        ]),
      ),
    [slices],
  );

  const isEmpty = !isLoading && !isError && (!data || data.total === 0 || slices.length === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("charts.subscribersByPlan.title")}</CardTitle>
        <CardDescription>
          {t("charts.subscribersByPlan.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="mx-auto aspect-square w-full max-w-52 rounded-full" />
        ) : isError || !data ? (
          <p className="text-sm text-destructive">
            {t("charts.subscribersByPlan.title")} — {t("charts.loadError")}
          </p>
        ) : isEmpty ? (
          <p className="text-sm text-muted-foreground">{t("charts.noData")}</p>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-52 w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="planName" hideLabel />}
                />
                <Pie
                  data={slices}
                  dataKey="count"
                  nameKey="planName"
                  innerRadius={55}
                  outerRadius={80}
                  strokeWidth={2}
                >
                  {slices.map((slice) => (
                    <Cell key={slice.planName} fill={slice.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="flex w-full flex-col gap-3 sm:w-40">
              {slices.map((slice) => (
                <li
                  key={slice.planName}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    {slice.planName}
                  </span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatNumber(slice.count, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

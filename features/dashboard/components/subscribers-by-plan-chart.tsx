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
import type { PlanKey } from "@/features/dashboard/types";
import { formatNumber } from "@/lib/format";

const PLAN_ORDER: PlanKey[] = ["starter", "pro", "business", "enterprise"];

const PLAN_COLOR_VARS: Record<PlanKey, string> = {
  starter: "var(--primary)",
  pro: "var(--chart-1)",
  business: "var(--chart-2)",
  enterprise: "var(--chart-3)",
};

export default function SubscribersByPlanChart() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(subscribersByPlanQueryOptions);

  const chartConfig = useMemo<ChartConfig>(
    () =>
      Object.fromEntries(
        PLAN_ORDER.map((plan) => [
          plan,
          { label: t(`plans.${plan}`), color: PLAN_COLOR_VARS[plan] },
        ]),
      ),
    [t],
  );

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
            {t("charts.subscribersByPlan.title")} — unable to load.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-52 w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="plan" hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="subscribers"
                  nameKey="plan"
                  innerRadius={55}
                  outerRadius={80}
                  strokeWidth={2}
                >
                  {data.map((entry) => (
                    <Cell key={entry.plan} fill={PLAN_COLOR_VARS[entry.plan]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="flex w-full flex-col gap-3 sm:w-40">
              {PLAN_ORDER.map((plan) => {
                const entry = data.find((item) => item.plan === plan);

                if (!entry) {
                  return null;
                }

                return (
                  <li
                    key={plan}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: PLAN_COLOR_VARS[plan] }}
                      />
                      {t(`plans.${plan}`)}
                    </span>
                    <span className="font-medium tabular-nums text-foreground">
                      {formatNumber(entry.subscribers, locale)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

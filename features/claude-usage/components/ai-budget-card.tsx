"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import EditAiBudgetDialog from "@/features/claude-usage/components/edit-ai-budget-dialog";
import { aiSettingsQueryOptions } from "@/features/claude-usage/services/claude-usage";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency } from "@/lib/format";

function progressColor(percentUsed: number) {
  if (percentUsed >= 90) {
    return "[&>[data-slot=progress-indicator]]:bg-destructive";
  }

  if (percentUsed >= 70) {
    return "[&>[data-slot=progress-indicator]]:bg-amber-500";
  }

  return "";
}

export default function AiBudgetCard() {
  const t = useTranslations("ClaudeUsage");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(aiSettingsQueryOptions);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("aiBudget.title")}</CardTitle>
        <CardDescription>{t("aiBudget.subtitle")}</CardDescription>
        {data ? (
          <CardAction>
            <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
              {t("aiBudget.edit")}
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-56" />
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-destructive">{t("aiBudget.loadError")}</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-semibold tabular-nums">
                {formatCurrency(data.currentSpendUsd, "USD", locale)}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("aiBudget.ofBudget", {
                  budget: formatCurrency(data.monthlyBudgetUsd, "USD", locale),
                })}
              </span>
            </div>
            <Progress
              value={Math.min(data.percentUsed, 100)}
              className={progressColor(data.percentUsed)}
            />
            <p className="text-xs text-muted-foreground">
              {t("aiBudget.monthLabel", {
                month: format(new Date(`${data.month}-01`), "MMMM yyyy", {
                  locale: dateLocale,
                }),
              })}
              {" · "}
              {t("aiBudget.updatedAt", {
                date: format(new Date(data.updatedAt), "d MMM, HH:mm", {
                  locale: dateLocale,
                }),
              })}
            </p>
          </div>
        )}
      </CardContent>
      {data ? (
        <EditAiBudgetDialog
          currentBudget={data.monthlyBudgetUsd}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
    </Card>
  );
}

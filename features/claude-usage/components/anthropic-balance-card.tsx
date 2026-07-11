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
import { Skeleton } from "@/components/ui/skeleton";
import EditAnthropicBalanceDialog from "@/features/claude-usage/components/edit-anthropic-balance-dialog";
import { anthropicBalanceQueryOptions } from "@/features/claude-usage/services/anthropic-usage";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency } from "@/lib/format";

export default function AnthropicBalanceCard() {
  const t = useTranslations("ClaudeUsage.anthropic");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(anthropicBalanceQueryOptions);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("balance.title")}</CardTitle>
        <CardDescription>{t("balance.subtitle")}</CardDescription>
        {data ? (
          <CardAction>
            <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
              {t("balance.edit")}
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-destructive">{t("balance.loadError")}</p>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold tabular-nums">
              {formatCurrency(data.knownBalanceUsd, "USD", locale)}
            </span>
            <p className="text-xs text-muted-foreground">
              {t("balance.recordedAt", {
                date: format(new Date(data.balanceRecordedAt), "d MMM yyyy, HH:mm", {
                  locale: dateLocale,
                }),
              })}
            </p>
          </div>
        )}
      </CardContent>
      {data ? (
        <EditAnthropicBalanceDialog
          currentBalance={data.knownBalanceUsd}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
    </Card>
  );
}

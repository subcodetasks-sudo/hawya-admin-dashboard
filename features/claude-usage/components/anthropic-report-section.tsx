"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import type { DateRange } from "react-day-picker";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AnthropicDateRangePicker from "@/features/claude-usage/components/anthropic-date-range-picker";
import {
  anthropicCostReportQueryOptions,
  anthropicUsageReportQueryOptions,
} from "@/features/claude-usage/services/anthropic-usage";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency, formatNumber } from "@/lib/format";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toIsoDayStart(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T00:00:00Z`;
}

export default function AnthropicReportSection() {
  const t = useTranslations("ClaudeUsage.anthropic");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);

  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: startOfMonth(new Date()),
    to: new Date(),
  }));

  const startingAt = range?.from ? toIsoDayStart(range.from) : undefined;
  const endingAt = range?.to ? toIsoDayStart(range.to) : undefined;

  const costReport = useQuery({
    ...anthropicCostReportQueryOptions(startingAt ?? "", endingAt),
    enabled: Boolean(startingAt),
  });

  const usageReport = useQuery({
    ...anthropicUsageReportQueryOptions(startingAt ?? "", endingAt),
    enabled: Boolean(startingAt),
  });

  const costRows = useMemo(
    () =>
      (costReport.data ?? []).flatMap((entry) =>
        entry.results.map((result) => ({
          date: entry.startingAt,
          model: result.model,
          amount: Number(result.amount),
          currency: result.currency,
        })),
      ),
    [costReport.data],
  );

  const usageRows = useMemo(
    () =>
      (usageReport.data ?? []).flatMap((entry) =>
        entry.results.map((result) => ({
          date: entry.startingAt,
          model: result.model,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
        })),
      ),
    [usageReport.data],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("report.title")}</CardTitle>
        <CardDescription>{t("report.subtitle")}</CardDescription>
        <CardAction>
          <AnthropicDateRangePicker range={range} onRangeChange={setRange} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">{t("report.costSection")}</h3>
          <div className="overflow-x-auto ring-1 ring-border/80 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 text-start">{t("report.date")}</TableHead>
                  <TableHead className="px-4 text-start">{t("report.model")}</TableHead>
                  <TableHead className="px-4 text-start">{t("report.amount")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costReport.isLoading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3} className="px-4 py-3">
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ) : costReport.isError ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={3}
                      className="px-4 py-8 text-center text-sm text-destructive"
                    >
                      {t("report.loadError")}
                    </TableCell>
                  </TableRow>
                ) : costRows.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={3}
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      {t("report.empty")}
                    </TableCell>
                  </TableRow>
                ) : (
                  costRows.map((row, index) => (
                    <TableRow key={`${row.date}-${row.model}-${index}`}>
                      <TableCell className="px-4 py-3 text-sm tabular-nums">
                        {format(new Date(row.date), "d MMM yyyy", { locale: dateLocale })}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm">{row.model}</TableCell>
                      <TableCell className="px-4 py-3 text-sm tabular-nums">
                        {formatCurrency(row.amount, row.currency, locale)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">{t("report.usageSection")}</h3>
          <div className="overflow-x-auto ring-1 ring-border/80 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 text-start">{t("report.date")}</TableHead>
                  <TableHead className="px-4 text-start">{t("report.model")}</TableHead>
                  <TableHead className="px-4 text-start">{t("report.inputTokens")}</TableHead>
                  <TableHead className="px-4 text-start">{t("report.outputTokens")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageReport.isLoading ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="px-4 py-3">
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ) : usageReport.isError ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-destructive"
                    >
                      {t("report.loadError")}
                    </TableCell>
                  </TableRow>
                ) : usageRows.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      {t("report.empty")}
                    </TableCell>
                  </TableRow>
                ) : (
                  usageRows.map((row, index) => (
                    <TableRow key={`${row.date}-${row.model}-${index}`}>
                      <TableCell className="px-4 py-3 text-sm tabular-nums">
                        {format(new Date(row.date), "d MMM yyyy", { locale: dateLocale })}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm">{row.model}</TableCell>
                      <TableCell className="px-4 py-3 text-sm tabular-nums">
                        {formatNumber(row.inputTokens, locale)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm tabular-nums">
                        {formatNumber(row.outputTokens, locale)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PlanRowActions from "@/features/plans/components/plan-row-actions";
import PlanStatusBadge from "@/features/plans/components/plan-status-badge";
import { plansListQueryOptions } from "@/features/plans/services/plans";
import type { PlanStatusFilter } from "@/features/plans/types";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatNumber, toLocaleDigits } from "@/lib/format";

type Props = {
  searchQuery: string;
  statusFilter: PlanStatusFilter;
};

// Money amounts stay in Latin digits with a plain "$" symbol regardless of
// locale, and are isolated with dir="ltr" — mixing Eastern Arabic numerals
// with a literal "/mo" suffix inside an RTL page causes the bidi algorithm
// to visually reorder the symbol, suffix, and digits unpredictably.
function formatPlanPrice(amount: number, currency: string) {
  const symbol = currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount)}`;
}

export default function PlansTable({ searchQuery, statusFilter }: Props) {
  const t = useTranslations("Plans");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(plansListQueryOptions);

  const plans = (data ?? []).filter((plan) => {
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter;
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="overflow-hidden rounded-b-xl bg-card border border-foreground/10 border-t-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 text-start">{t("table.plan")}</TableHead>
            <TableHead className="px-4 text-start">{t("table.monthly")}</TableHead>
            <TableHead className="px-4 text-start">{t("table.annual")}</TableHead>
            <TableHead className="px-4 text-start">{t("table.subscribers")}</TableHead>
            <TableHead className="px-4 text-start">{t("table.status")}</TableHead>
            <TableHead className="px-4 text-start">{t("table.createdAt")}</TableHead>
            <TableHead className="px-4 text-center">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell colSpan={7} className="px-4 py-3">
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : isError ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="px-4 py-8 text-center text-sm text-destructive">
                {t("table.loadError")}
              </TableCell>
            </TableRow>
          ) : plans.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={7}
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                {t("table.empty")}
              </TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{plan.name}</span>
                    <span className="text-xs text-muted-foreground">{plan.description}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 tabular-nums">
                  <span dir="ltr">
                    {formatPlanPrice(plan.monthlyPrice, plan.currency)}
                    {t("table.perMonthSuffix")}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 tabular-nums">
                  <span dir="ltr">
                    {formatPlanPrice(plan.annualPrice, plan.currency)}
                    {t("table.perYearSuffix")}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 tabular-nums">
                  {formatNumber(plan.subscribers, locale)}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <PlanStatusBadge status={plan.status} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  {toLocaleDigits(
                    format(new Date(plan.createdAt), "d MMMM yyyy", { locale: dateLocale }),
                    locale,
                  )}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <PlanRowActions plan={plan} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

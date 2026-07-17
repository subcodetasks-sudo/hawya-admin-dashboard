"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/csv-export";
import InvoicesCard from "@/features/financial/components/invoices-card";
import PaymentsCard from "@/features/financial/components/payments-card";
import RevenueByPlanCard from "@/features/financial/components/revenue-by-plan-card";
import RevenueTrendChart from "@/features/financial/components/revenue-trend-chart";
import FinancialStatsGrid from "@/features/financial/components/financial-stats-grid";
import { financialKeys } from "@/features/financial/query-keys";
import {
  financialSummaryQueryOptions,
  revenueByPlanQueryOptions,
} from "@/features/financial/services/financial";

export default function FinancialOverview() {
  const t = useTranslations("Financial");
  const queryClient = useQueryClient();
  const { data: summary } = useQuery(financialSummaryQueryOptions);
  const { data: revenueByPlan } = useQuery(revenueByPlanQueryOptions);

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: financialKeys.all });
  }

  function handleExportReport() {
    const rows: string[][] = [
      ["metric", "value"],
      ["monthly_revenue", String(summary?.monthlyRevenue ?? "")],
      ["yearly_revenue", String(summary?.yearlyRevenue ?? "")],
      ["mrr", String(summary?.mrr ?? "")],
      ["arr", String(summary?.arr ?? "")],
      ["pending_payments", String(summary?.pendingPayments ?? "")],
      ["refunds_this_month", String(summary?.refundsThisMonth ?? "")],
      [],
      ["plan_name", "revenue"],
      ...(revenueByPlan ?? []).map((item) => [item.planName, String(item.revenue)]),
    ];
    downloadCsv(rows, "financial-report.csv");
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label={t("refresh")}
            onClick={handleRefresh}
          >
            <RefreshCw />
          </Button>
          <Button onClick={handleExportReport}>
            <Download data-icon="inline-start" />
            {t("exportReport")}
          </Button>
        </div>
      </div>

      <FinancialStatsGrid />

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <RevenueByPlanCard />
        <RevenueTrendChart />
      </div>

      <PaymentsCard />
      <InvoicesCard />
    </div>
  );
}

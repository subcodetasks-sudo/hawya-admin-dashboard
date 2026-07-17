import type { InvoicesListParams, PaymentsListParams } from "@/features/financial/types";

export const financialKeys = {
  all: ["financial"] as const,
  summary: () => [...financialKeys.all, "summary"] as const,
  revenueByPlan: () => [...financialKeys.all, "revenue-by-plan"] as const,
  revenueTrend: (months: number) => [...financialKeys.all, "revenue-trend", months] as const,
  payments: (params: PaymentsListParams) => [...financialKeys.all, "payments", params] as const,
  invoices: (params: InvoicesListParams) => [...financialKeys.all, "invoices", params] as const,
};

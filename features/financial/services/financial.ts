import { queryOptions } from "@tanstack/react-query";

import { apiGet } from "@/lib/api-client";
import { financialKeys } from "@/features/financial/query-keys";
import type {
  FinancialSummary,
  Invoice,
  InvoicesListParams,
  InvoicesListResult,
  Payment,
  PaymentsListParams,
  PaymentsListResult,
  PlanRevenue,
  RevenueTrendPoint,
} from "@/features/financial/types";

type FinancialSummaryResponse = {
  monthly_revenue: number;
  yearly_revenue: number;
  mrr: number;
  arr: number;
  pending_payments: number;
  refunds_this_month: number;
};

export async function fetchFinancialSummary(): Promise<FinancialSummary> {
  const data = await apiGet<FinancialSummaryResponse>("/admin/financial/summary");

  return {
    monthlyRevenue: data.monthly_revenue,
    yearlyRevenue: data.yearly_revenue,
    mrr: data.mrr,
    arr: data.arr,
    pendingPayments: data.pending_payments,
    refundsThisMonth: data.refunds_this_month,
  };
}

export const financialSummaryQueryOptions = queryOptions({
  queryKey: financialKeys.summary(),
  queryFn: fetchFinancialSummary,
});

type PlanRevenueResponse = {
  plan_name: string;
  revenue: number;
};

export async function fetchRevenueByPlan(): Promise<PlanRevenue[]> {
  const data = await apiGet<PlanRevenueResponse[]>("/admin/financial/revenue-by-plan");

  return data.map((item) => ({
    planName: item.plan_name,
    revenue: item.revenue,
  }));
}

export const revenueByPlanQueryOptions = queryOptions({
  queryKey: financialKeys.revenueByPlan(),
  queryFn: fetchRevenueByPlan,
});

export async function fetchRevenueTrend(months = 12): Promise<RevenueTrendPoint[]> {
  return apiGet<RevenueTrendPoint[]>(`/admin/financial/revenue-trend?months=${months}`);
}

export function revenueTrendQueryOptions(months = 12) {
  return queryOptions({
    queryKey: financialKeys.revenueTrend(months),
    queryFn: () => fetchRevenueTrend(months),
  });
}

type PaymentResponse = {
  id: string;
  reference: string;
  user_id: string;
  user_name: string;
  plan_name: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  date: string;
};

function mapPayment(data: PaymentResponse): Payment {
  return {
    id: data.id,
    reference: data.reference,
    userId: data.user_id,
    userName: data.user_name,
    planName: data.plan_name,
    amount: data.amount,
    currency: data.currency,
    paymentMethod: data.payment_method,
    status: data.status as Payment["status"],
    date: data.date,
  };
}

type PaymentsListResponse = {
  payments: PaymentResponse[];
  total: number;
  page: number;
  per_page: number;
};

export async function fetchPayments(params: PaymentsListParams): Promise<PaymentsListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    per_page: String(params.perPage),
  });

  if (params.status) {
    query.set("status", params.status);
  }

  const data = await apiGet<PaymentsListResponse>(`/admin/financial/payments?${query.toString()}`);

  return {
    payments: data.payments.map(mapPayment),
    total: data.total,
    page: data.page,
    perPage: data.per_page,
  };
}

export function paymentsListQueryOptions(params: PaymentsListParams) {
  return queryOptions({
    queryKey: financialKeys.payments(params),
    queryFn: () => fetchPayments(params),
  });
}

type InvoiceResponse = {
  id: string;
  reference: string;
  user_id: string;
  user_name: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  issued_at: string;
};

function mapInvoice(data: InvoiceResponse): Invoice {
  return {
    id: data.id,
    reference: data.reference,
    userId: data.user_id,
    userName: data.user_name,
    planName: data.plan_name,
    amount: data.amount,
    currency: data.currency,
    status: data.status as Invoice["status"],
    issuedAt: data.issued_at,
  };
}

type InvoicesListResponse = {
  invoices: InvoiceResponse[];
  total: number;
  page?: number;
  per_page?: number;
};

export async function fetchInvoices(params: InvoicesListParams): Promise<InvoicesListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    per_page: String(params.perPage),
  });

  const data = await apiGet<InvoicesListResponse>(`/admin/financial/invoices?${query.toString()}`);

  return {
    invoices: data.invoices.map(mapInvoice),
    total: data.total,
    page: data.page ?? params.page,
    perPage: data.per_page ?? params.perPage,
  };
}

export function invoicesListQueryOptions(params: InvoicesListParams) {
  return queryOptions({
    queryKey: financialKeys.invoices(params),
    queryFn: () => fetchInvoices(params),
  });
}

type InvoiceDownloadResponse = { url: string };

export async function fetchInvoiceDownloadUrl(id: string): Promise<string> {
  const data = await apiGet<InvoiceDownloadResponse>(`/admin/financial/invoices/${id}/download`);
  return data.url;
}

export type FinancialSummary = {
  monthlyRevenue: number;
  yearlyRevenue: number;
  mrr: number;
  arr: number;
  pendingPayments: number;
  refundsThisMonth: number;
};

export type PlanRevenue = {
  planName: string;
  revenue: number;
};

export type RevenueTrendPoint = {
  label: string;
  value: number;
};

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type Payment = {
  id: string;
  reference: string;
  userId: string;
  userName: string;
  planName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  date: string;
};

export type PaymentsListParams = {
  page: number;
  perPage: number;
  status?: PaymentStatus;
};

export type PaymentsListResult = {
  payments: Payment[];
  total: number;
  page: number;
  perPage: number;
};

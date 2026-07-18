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

export type Invoice = {
  id: string;
  number: string;
  userId: string;
  userName: string;
  planName: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  issuedAt: string;
  paidAt: string | null;
};

export type InvoicesListParams = {
  page: number;
  perPage: number;
};

export type InvoicesListResult = {
  invoices: Invoice[];
  total: number;
  page: number;
  perPage: number;
};

export type UserFinancialStatus = {
  userId: string;
  status: string;
  outstandingAmount: number;
  lastPaymentAt: string | null;
};

export type BillingCycle = "monthly" | "yearly";

export type SubscriptionStatus = "active" | "pending" | "expired" | "cancelled" | "suspended";

export type Subscription = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  price: number;
  currency: string;
  autoRenew: boolean;
  startedAt: string;
  endsAt: string;
  renewsAt: string | null;
  usagePercent: number;
  adminNote: string | null;
};

export type SubscriptionCounts = Record<SubscriptionStatus, number>;

export type SubscriptionsListParams = {
  page: number;
  perPage: number;
  status?: SubscriptionStatus;
  search?: string;
  userId?: string;
  planId?: string;
};

export type SubscriptionsListResult = {
  subscriptions: Subscription[];
  total: number;
  counts: SubscriptionCounts;
  page: number;
  perPage: number;
};

export type PlanOption = {
  id: string;
  name: string;
  isActive: boolean;
};

export type UserOption = {
  id: string;
  name: string;
  email: string;
};

export type CreateSubscriptionInput = {
  userId: string;
  planId: string;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  autoRenew: boolean;
};

export type ChangeSubscriptionPlanInput = {
  planId: string;
  billingCycle: BillingCycle;
};

export type ChangeSubscriptionPlanResult = {
  subscription: Subscription;
  prorationDifference: number;
};

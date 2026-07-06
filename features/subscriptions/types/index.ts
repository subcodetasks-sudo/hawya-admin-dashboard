export type PlanKey = "starter" | "pro" | "business" | "enterprise";

export type BillingCycle = "monthly" | "yearly";

export type SubscriptionStatus = "active" | "pending" | "expired" | "cancelled";

export type Subscription = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerInitials: string;
  planKey: PlanKey;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startDate: string;
  renewalDate: string | null;
  usagePercent: number;
};

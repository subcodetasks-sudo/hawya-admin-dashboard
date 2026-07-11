import { queryOptions } from "@tanstack/react-query";

import { apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { subscriptionKeys } from "@/features/subscriptions/query-keys";
import type {
  BillingCycle,
  ChangeSubscriptionPlanInput,
  ChangeSubscriptionPlanResult,
  CreateSubscriptionInput,
  PlanOption,
  Subscription,
  SubscriptionCounts,
  SubscriptionsListParams,
  SubscriptionsListResult,
  SubscriptionStatus,
  UserOption,
} from "@/features/subscriptions/types";

type SubscriptionResponse = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan_id: string;
  plan_name: string;
  billing_cycle: BillingCycle;
  status: SubscriptionStatus;
  price: number;
  currency: string;
  auto_renew: boolean;
  started_at: string;
  ends_at: string;
  renews_at: string | null;
  usage_percent: number;
  admin_note: string | null;
};

function mapSubscription(data: SubscriptionResponse): Subscription {
  return {
    id: data.id,
    userId: data.user_id,
    userName: data.user_name,
    userEmail: data.user_email,
    planId: data.plan_id,
    planName: data.plan_name,
    billingCycle: data.billing_cycle,
    status: data.status,
    price: data.price,
    currency: data.currency,
    autoRenew: data.auto_renew,
    startedAt: data.started_at,
    endsAt: data.ends_at,
    renewsAt: data.renews_at,
    usagePercent: data.usage_percent,
    adminNote: data.admin_note,
  };
}

type SubscriptionsListResponse = {
  subscriptions: SubscriptionResponse[];
  total: number;
  counts: SubscriptionCounts;
  page: number;
  per_page: number;
};

export async function fetchSubscriptions(
  params: SubscriptionsListParams,
): Promise<SubscriptionsListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    per_page: String(params.perPage),
  });

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.userId) {
    query.set("user_id", params.userId);
  }

  if (params.planId) {
    query.set("plan_id", params.planId);
  }

  const data = await apiGet<SubscriptionsListResponse>(`/admin/subscriptions?${query.toString()}`);

  return {
    subscriptions: data.subscriptions.map(mapSubscription),
    total: data.total,
    counts: data.counts,
    page: data.page,
    perPage: data.per_page,
  };
}

export function subscriptionsListQueryOptions(params: SubscriptionsListParams) {
  return queryOptions({
    queryKey: subscriptionKeys.list(params),
    queryFn: () => fetchSubscriptions(params),
  });
}

export async function fetchSubscriptionDetail(id: string): Promise<Subscription> {
  const data = await apiGet<SubscriptionResponse>(`/admin/subscriptions/${id}`);
  return mapSubscription(data);
}

export function subscriptionDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => fetchSubscriptionDetail(id),
    enabled: Boolean(id),
  });
}

export async function createSubscription(input: CreateSubscriptionInput): Promise<Subscription> {
  const data = await apiPost<SubscriptionResponse>("/admin/subscriptions", {
    user_id: input.userId,
    plan_id: input.planId,
    billing_cycle: input.billingCycle,
    status: input.status,
    auto_renew: input.autoRenew,
  });

  return mapSubscription(data);
}

export async function suspendSubscription(id: string): Promise<Subscription> {
  const data = await apiPost<SubscriptionResponse>(`/admin/subscriptions/${id}/suspend`, {});
  return mapSubscription(data);
}

export async function renewSubscription(id: string): Promise<Subscription> {
  const data = await apiPost<SubscriptionResponse>(`/admin/subscriptions/${id}/renew`, {});
  return mapSubscription(data);
}

export async function cancelSubscription(id: string): Promise<Subscription> {
  const data = await apiPost<SubscriptionResponse>(`/admin/subscriptions/${id}/cancel`, {});
  return mapSubscription(data);
}

export async function grantSubscriptionDays(id: string, days: number): Promise<Subscription> {
  const data = await apiPost<SubscriptionResponse>(`/admin/subscriptions/${id}/grant-days`, {
    days,
  });
  return mapSubscription(data);
}

type ChangeSubscriptionPlanResponse = {
  subscription: SubscriptionResponse;
  proration_difference: number;
};

export async function changeSubscriptionPlan(
  id: string,
  input: ChangeSubscriptionPlanInput,
): Promise<ChangeSubscriptionPlanResult> {
  const data = await apiPost<ChangeSubscriptionPlanResponse>(
    `/admin/subscriptions/${id}/change-plan`,
    { plan_id: input.planId, billing_cycle: input.billingCycle },
  );

  return {
    subscription: mapSubscription(data.subscription),
    prorationDifference: data.proration_difference,
  };
}

export async function addSubscriptionNote(id: string, note: string): Promise<Subscription> {
  const data = await apiPatch<SubscriptionResponse>(`/admin/subscriptions/${id}/note`, { note });
  return mapSubscription(data);
}

type PlanOptionResponse = {
  id: string;
  name: string;
  is_active: boolean;
};

type PlanOptionsResponse = { plans: PlanOptionResponse[]; total: number };

export async function fetchPlanOptions(): Promise<PlanOption[]> {
  const data = await apiGet<PlanOptionsResponse>("/admin/plans");

  return data.plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    isActive: plan.is_active,
  }));
}

export const planOptionsQueryOptions = queryOptions({
  queryKey: subscriptionKeys.planOptions(),
  queryFn: fetchPlanOptions,
});

type UserOptionResponse = {
  id: string;
  display_name: string;
  email: string;
};

type UserOptionsResponse = { users: UserOptionResponse[]; total: number };

export async function searchUserOptions(search: string): Promise<UserOption[]> {
  const query = new URLSearchParams({ page: "1", per_page: "10" });

  if (search) {
    query.set("search", search);
  }

  const data = await apiGet<UserOptionsResponse>(`/admin/users?${query.toString()}`);

  return data.users.map((user) => ({
    id: user.id,
    name: user.display_name,
    email: user.email,
  }));
}

export function userOptionsQueryOptions(search: string) {
  return queryOptions({
    queryKey: subscriptionKeys.userOptions(search),
    queryFn: () => searchUserOptions(search),
  });
}

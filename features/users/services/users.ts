import { queryOptions } from "@tanstack/react-query";

import { apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { userKeys } from "@/features/users/query-keys";
import type {
  BanUserInput,
  CreateUserInput,
  PlanOption,
  UserDetail,
  UserFinancialStatus,
  UserNote,
  UsersListParams,
  UsersListResult,
  UserSubscription,
  UserSummary,
} from "@/features/users/types";

type UserSummaryResponse = {
  id: string;
  display_name: string;
  email: string;
  plan_name: string;
  is_active: boolean;
  is_verified: boolean;
  api_requests: number;
  created_at: string;
  last_login_at: string | null;
};

function mapUserSummary(data: UserSummaryResponse): UserSummary {
  return {
    id: data.id,
    displayName: data.display_name,
    email: data.email,
    planName: data.plan_name,
    isActive: data.is_active,
    isVerified: data.is_verified,
    apiRequests: data.api_requests,
    createdAt: data.created_at,
    lastLoginAt: data.last_login_at,
  };
}

type UsersListResponse = {
  users: UserSummaryResponse[];
  total: number;
  page: number;
  per_page: number;
};

export async function fetchUsers(params: UsersListParams): Promise<UsersListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    per_page: String(params.perPage),
  });

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.planId) {
    query.set("plan_id", params.planId);
  }

  const data = await apiGet<UsersListResponse>(`/admin/users?${query.toString()}`);

  return {
    users: data.users.map(mapUserSummary),
    total: data.total,
    page: data.page,
    perPage: data.per_page,
  };
}

export function usersListQueryOptions(params: UsersListParams) {
  return queryOptions({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
  });
}

type UserSubscriptionResponse = {
  plan_name: string;
  billing_cycle: string;
  status: string;
  started_at: string;
  ends_at: string;
  renews_at: string;
};

function mapSubscription(data: UserSubscriptionResponse): UserSubscription {
  return {
    planName: data.plan_name,
    billingCycle: data.billing_cycle,
    status: data.status,
    startedAt: data.started_at,
    endsAt: data.ends_at,
    renewsAt: data.renews_at,
  };
}

type UserNoteResponse = {
  id: string;
  note: string;
  admin_id: string;
  created_at: string;
};

function mapNote(data: UserNoteResponse): UserNote {
  return {
    id: data.id,
    note: data.note,
    adminId: data.admin_id,
    createdAt: data.created_at,
  };
}

type UserDetailResponse = UserSummaryResponse & {
  language: string;
  total_projects: number;
  total_payments: number;
  subscription_months: number;
  usage: {
    api_requests: number;
    tokens: number;
    success_count: number;
    failed_count: number;
    limit: number;
    remaining: number;
    usage_percent: number;
  };
  current_subscription: UserSubscriptionResponse | null;
  past_subscriptions: UserSubscriptionResponse[];
  notes: UserNoteResponse[];
};

export async function fetchUserDetail(id: string): Promise<UserDetail> {
  const data = await apiGet<UserDetailResponse>(`/admin/users/${id}`);

  return {
    ...mapUserSummary(data),
    language: data.language,
    totalProjects: data.total_projects,
    totalPayments: data.total_payments,
    subscriptionMonths: data.subscription_months,
    usage: {
      apiRequests: data.usage.api_requests,
      tokens: data.usage.tokens,
      successCount: data.usage.success_count,
      failedCount: data.usage.failed_count,
      limit: data.usage.limit,
      remaining: data.usage.remaining,
      usagePercent: data.usage.usage_percent,
    },
    currentSubscription: data.current_subscription
      ? mapSubscription(data.current_subscription)
      : null,
    pastSubscriptions: data.past_subscriptions.map(mapSubscription),
    notes: data.notes.map(mapNote),
  };
}

export function userDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserDetail(id),
    enabled: Boolean(id),
  });
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
  queryKey: userKeys.plans(),
  queryFn: fetchPlanOptions,
});

export async function createUser(input: CreateUserInput): Promise<UserSummary> {
  const data = await apiPost<UserSummaryResponse>("/admin/users", {
    display_name: input.displayName,
    email: input.email,
    plan_id: input.planId,
    password: input.password,
    is_verified: input.isVerified,
  });

  return mapUserSummary(data);
}

export async function suspendUser(id: string): Promise<void> {
  await apiPatch(`/admin/users/${id}/suspend`);
}

export async function activateUser(id: string): Promise<void> {
  await apiPatch(`/admin/users/${id}/activate`);
}

export async function banUser(id: string, input: BanUserInput): Promise<void> {
  await apiPost(`/admin/users/${id}/ban`, {
    ban_type: input.banType,
    ...(input.until ? { until: input.until } : {}),
  });
}

export async function changeUserPlan(id: string, planId: string): Promise<void> {
  await apiPatch(`/admin/users/${id}/plan`, { plan_id: planId });
}

type ResetPasswordResponse = { user_id: string; temporary_password: string };

export async function resetUserPassword(id: string): Promise<string> {
  const data = await apiPost<ResetPasswordResponse>(`/admin/users/${id}/reset-password`, {});
  return data.temporary_password;
}

export async function addUserNote(id: string, note: string): Promise<UserNote> {
  const data = await apiPost<UserNoteResponse>(`/admin/users/${id}/notes`, { note });
  return mapNote(data);
}

type UserFinancialStatusResponse = {
  user_id: string;
  status: string;
  outstanding_amount: number;
  last_payment_at: string | null;
};

export async function fetchUserFinancialStatus(id: string): Promise<UserFinancialStatus> {
  const data = await apiGet<UserFinancialStatusResponse>(`/admin/financial/users/${id}/status`);

  return {
    userId: data.user_id,
    status: data.status,
    outstandingAmount: data.outstanding_amount,
    lastPaymentAt: data.last_payment_at,
  };
}

export function userFinancialStatusQueryOptions(id: string) {
  return queryOptions({
    queryKey: userKeys.financialStatus(id),
    queryFn: () => fetchUserFinancialStatus(id),
    enabled: Boolean(id),
  });
}

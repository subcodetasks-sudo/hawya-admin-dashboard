import { queryOptions } from "@tanstack/react-query";

import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api-client";
import { planKeys } from "@/features/plans/query-keys";
import type { DiscountType, DiscountScope, Plan, PlanInput } from "@/features/plans/types";

type PlanFeaturesResponse = {
  requests_limit: number;
  api_token_limit: number;
  max_websites: number;
  crawling_enabled: boolean;
  support_priority: string;
};

type PlanResponse = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_projects: number;
  features: PlanFeaturesResponse;
  discount_type: DiscountType | null;
  discount_value: number | null;
  discount_scope: DiscountScope | null;
  is_active: boolean;
  subscribers: number;
  created_at: string;
};

function mapPlan(data: PlanResponse): Plan {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    priceMonthly: data.price_monthly,
    priceYearly: data.price_yearly,
    maxProjects: data.max_projects,
    features: {
      requestsLimit: data.features.requests_limit,
      apiTokenLimit: data.features.api_token_limit,
      maxWebsites: data.features.max_websites,
      crawlingEnabled: data.features.crawling_enabled,
      supportPriority: data.features.support_priority,
    },
    discount:
      data.discount_type && data.discount_scope && data.discount_value != null
        ? { type: data.discount_type, value: data.discount_value, scope: data.discount_scope }
        : null,
    isActive: data.is_active,
    subscribers: data.subscribers,
    createdAt: data.created_at,
  };
}

type PlansListResponse = { plans: PlanResponse[]; total: number };

export async function fetchPlans(): Promise<Plan[]> {
  const data = await apiGet<PlansListResponse>("/admin/plans");
  return data.plans.map(mapPlan);
}

export const plansListQueryOptions = queryOptions({
  queryKey: planKeys.lists(),
  queryFn: fetchPlans,
});

function buildPlanRequestBody(input: PlanInput) {
  return {
    name: input.name,
    description: input.description,
    price_monthly: input.priceMonthly,
    auto_yearly: input.autoYearly,
    max_projects: input.maxProjects,
    features: {
      requests_limit: input.features.requestsLimit,
      api_token_limit: input.features.apiTokenLimit,
      max_websites: input.features.maxWebsites,
      crawling_enabled: input.features.crawlingEnabled,
      support_priority: input.features.supportPriority,
    },
    is_active: input.isActive,
    ...(input.discount
      ? {
          discount_type: input.discount.type,
          discount_value: input.discount.value,
          discount_scope: input.discount.scope,
        }
      : {}),
  };
}

export async function createPlan(input: PlanInput): Promise<Plan> {
  const data = await apiPost<PlanResponse>("/admin/plans", buildPlanRequestBody(input));
  return mapPlan(data);
}

export async function updatePlan(id: string, input: PlanInput): Promise<Plan> {
  const body: Record<string, unknown> = buildPlanRequestBody(input);

  if (!input.discount) {
    body.clear_fields = ["discount_type", "discount_value", "discount_scope"];
  }

  const data = await apiPut<PlanResponse>(`/admin/plans/${id}`, body);
  return mapPlan(data);
}

export async function deletePlan(id: string): Promise<void> {
  await apiDelete(`/admin/plans/${id}`);
}

export async function updatePlanStatus(id: string, isActive: boolean): Promise<Plan> {
  const data = await apiPatch<PlanResponse>(`/admin/plans/${id}/status`, { is_active: isActive });
  return mapPlan(data);
}

export async function duplicatePlan(id: string): Promise<Plan> {
  const data = await apiPost<PlanResponse>(`/admin/plans/${id}/duplicate`, {});
  return mapPlan(data);
}

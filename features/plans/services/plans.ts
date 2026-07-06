import { queryOptions } from "@tanstack/react-query";

import { planKeys } from "@/features/plans/query-keys";
import type { Plan, PlanInput } from "@/features/plans/types";

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

let mockPlans: Plan[] = [
  {
    id: "plan_starter",
    name: "Starter",
    description: "مثال للأفراد والمشاريع الصغيرة",
    monthlyPrice: 29,
    annualPrice: 290,
    currency: "USD",
    subscribers: 1_247,
    status: "active",
    createdAt: new Date(2024, 0, 15).toISOString(),
    limits: {
      tokensPerMonth: 100_000,
      apiRequestsPerMonth: 10_000,
      projects: 3,
      storageGb: 5,
      teamMembers: 1,
      connectedSites: 1,
    },
    features: [
      { id: "prioritySupport", labelKey: "prioritySupport", enabled: false },
      { id: "advancedAnalytics", labelKey: "advancedAnalytics", enabled: false },
      { id: "teamMembers", labelKey: "teamMembers", enabled: false },
      { id: "customIntegrations", labelKey: "customIntegrations", enabled: false },
      { id: "claudeCrawling", labelKey: "claudeCrawling", enabled: false },
      { id: "auditLogs", labelKey: "auditLogs", enabled: false },
    ],
  },
  {
    id: "plan_pro",
    name: "Pro",
    description: "للفرق النامية والشركات",
    monthlyPrice: 79,
    annualPrice: 790,
    currency: "USD",
    subscribers: 3_891,
    status: "active",
    createdAt: new Date(2024, 0, 15).toISOString(),
    limits: {
      tokensPerMonth: 1_000_000,
      apiRequestsPerMonth: 100_000,
      projects: 10,
      storageGb: 50,
      teamMembers: 5,
      connectedSites: 3,
    },
    features: [
      { id: "prioritySupport", labelKey: "prioritySupport", enabled: true },
      { id: "advancedAnalytics", labelKey: "advancedAnalytics", enabled: true },
      { id: "teamMembers", labelKey: "teamMembers", enabled: true },
      { id: "customIntegrations", labelKey: "customIntegrations", enabled: false },
      { id: "claudeCrawling", labelKey: "claudeCrawling", enabled: true },
      { id: "auditLogs", labelKey: "auditLogs", enabled: false },
    ],
  },
  {
    id: "plan_business",
    name: "Business",
    description: "ميزات متقدمة للمؤسسات الكبيرة",
    monthlyPrice: 199,
    annualPrice: 1_990,
    currency: "USD",
    subscribers: 892,
    status: "active",
    createdAt: new Date(2024, 2, 1).toISOString(),
    limits: {
      tokensPerMonth: 5_000_000,
      apiRequestsPerMonth: 500_000,
      projects: null,
      storageGb: 200,
      teamMembers: 20,
      connectedSites: 10,
    },
    features: [
      { id: "prioritySupport", labelKey: "prioritySupport", enabled: true },
      { id: "advancedAnalytics", labelKey: "advancedAnalytics", enabled: true },
      { id: "teamMembers", labelKey: "teamMembers", enabled: true },
      { id: "customIntegrations", labelKey: "customIntegrations", enabled: true },
      { id: "claudeCrawling", labelKey: "claudeCrawling", enabled: true },
      { id: "auditLogs", labelKey: "auditLogs", enabled: true },
    ],
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    description: "حلول مخصصة للعملاء المؤسسيين",
    monthlyPrice: 499,
    annualPrice: 4_990,
    currency: "USD",
    subscribers: 234,
    status: "active",
    createdAt: new Date(2024, 2, 1).toISOString(),
    limits: {
      tokensPerMonth: null,
      apiRequestsPerMonth: null,
      projects: null,
      storageGb: null,
      teamMembers: null,
      connectedSites: null,
    },
    features: [
      { id: "prioritySupport", labelKey: "prioritySupport", enabled: true },
      { id: "advancedAnalytics", labelKey: "advancedAnalytics", enabled: true },
      { id: "teamMembers", labelKey: "teamMembers", enabled: true },
      { id: "customIntegrations", labelKey: "customIntegrations", enabled: true },
      { id: "claudeCrawling", labelKey: "claudeCrawling", enabled: true },
      { id: "auditLogs", labelKey: "auditLogs", enabled: true },
    ],
  },
  {
    id: "plan_legacy",
    name: "Legacy",
    description: "خطة موقوفة للعملاء الحاليين",
    monthlyPrice: 19,
    annualPrice: 190,
    currency: "USD",
    subscribers: 312,
    status: "inactive",
    createdAt: new Date(2023, 7, 10).toISOString(),
    limits: {
      tokensPerMonth: 50_000,
      apiRequestsPerMonth: 5_000,
      projects: 1,
      storageGb: 2,
      teamMembers: 1,
      connectedSites: 1,
    },
    features: [
      { id: "prioritySupport", labelKey: "prioritySupport", enabled: false },
      { id: "advancedAnalytics", labelKey: "advancedAnalytics", enabled: false },
      { id: "teamMembers", labelKey: "teamMembers", enabled: false },
      { id: "customIntegrations", labelKey: "customIntegrations", enabled: false },
      { id: "claudeCrawling", labelKey: "claudeCrawling", enabled: false },
      { id: "auditLogs", labelKey: "auditLogs", enabled: false },
    ],
  },
];

export async function fetchPlans(): Promise<Plan[]> {
  return delay([...mockPlans]);
}

export const plansListQueryOptions = queryOptions({
  queryKey: planKeys.lists(),
  queryFn: fetchPlans,
});

export async function createPlan(input: PlanInput): Promise<Plan> {
  const plan: Plan = {
    id: `plan_${Date.now()}`,
    subscribers: 0,
    createdAt: new Date().toISOString(),
    ...input,
  };
  mockPlans = [plan, ...mockPlans];
  return delay(plan);
}

export async function updatePlan(id: string, input: PlanInput): Promise<Plan> {
  mockPlans = mockPlans.map((plan) => (plan.id === id ? { ...plan, ...input } : plan));
  const updated = mockPlans.find((plan) => plan.id === id);

  if (!updated) {
    throw new Error(`Plan not found: ${id}`);
  }

  return delay(updated);
}

export async function deletePlan(id: string): Promise<void> {
  mockPlans = mockPlans.filter((plan) => plan.id !== id);
  return delay(undefined);
}

export async function duplicatePlan(id: string): Promise<Plan> {
  const source = mockPlans.find((plan) => plan.id === id);

  if (!source) {
    throw new Error(`Plan not found: ${id}`);
  }

  const copy: Plan = {
    ...source,
    id: `plan_${Date.now()}`,
    name: `${source.name} Copy`,
    subscribers: 0,
    createdAt: new Date().toISOString(),
  };
  mockPlans = [...mockPlans, copy];
  return delay(copy);
}

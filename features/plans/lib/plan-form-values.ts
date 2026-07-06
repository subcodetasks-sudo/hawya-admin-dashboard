import type { Plan, PlanFeature, PlanLimits, PlanStatus } from "@/features/plans/types";

export type PlanLimitsFormValues = Record<keyof PlanLimits, string>;

export type PlanFormValues = {
  name: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  currency: string;
  limits: PlanLimitsFormValues;
  features: PlanFeature[];
  status: PlanStatus;
};

const DEFAULT_LIMITS: PlanLimitsFormValues = {
  tokensPerMonth: "",
  apiRequestsPerMonth: "",
  projects: "",
  storageGb: "",
  teamMembers: "",
  connectedSites: "",
};

export const DEFAULT_FEATURES: PlanFeature[] = [
  { id: "prioritySupport", labelKey: "prioritySupport", enabled: true },
  { id: "advancedAnalytics", labelKey: "advancedAnalytics", enabled: true },
  { id: "teamMembers", labelKey: "teamMembers", enabled: true },
  { id: "customIntegrations", labelKey: "customIntegrations", enabled: false },
  { id: "claudeCrawling", labelKey: "claudeCrawling", enabled: true },
  { id: "auditLogs", labelKey: "auditLogs", enabled: false },
];

const DEFAULT_FORM_VALUES: PlanFormValues = {
  name: "",
  description: "",
  monthlyPrice: "0",
  annualPrice: "0",
  currency: "USD",
  limits: DEFAULT_LIMITS,
  features: DEFAULT_FEATURES,
  status: "active",
};

function limitsToFormValues(limits: PlanLimits): PlanLimitsFormValues {
  const toValue = (value: number | null) => (value === null ? "" : String(value));

  return {
    tokensPerMonth: toValue(limits.tokensPerMonth),
    apiRequestsPerMonth: toValue(limits.apiRequestsPerMonth),
    projects: toValue(limits.projects),
    storageGb: toValue(limits.storageGb),
    teamMembers: toValue(limits.teamMembers),
    connectedSites: toValue(limits.connectedSites),
  };
}

export function formValuesToLimits(values: PlanLimitsFormValues): PlanLimits {
  const parse = (value: string) => (value.trim() === "" ? null : Number(value));

  return {
    tokensPerMonth: parse(values.tokensPerMonth),
    apiRequestsPerMonth: parse(values.apiRequestsPerMonth),
    projects: parse(values.projects),
    storageGb: parse(values.storageGb),
    teamMembers: parse(values.teamMembers),
    connectedSites: parse(values.connectedSites),
  };
}

export function buildFormValues(plan?: Plan): PlanFormValues {
  if (!plan) {
    return DEFAULT_FORM_VALUES;
  }

  return {
    name: plan.name,
    description: plan.description,
    monthlyPrice: String(plan.monthlyPrice),
    annualPrice: String(plan.annualPrice),
    currency: plan.currency,
    limits: limitsToFormValues(plan.limits),
    features: plan.features,
    status: plan.status,
  };
}

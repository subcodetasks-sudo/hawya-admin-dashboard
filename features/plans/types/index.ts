export type PlanStatus = "active" | "inactive";

export type PlanStatusFilter = "all" | PlanStatus;

export type PresetFeatureKey =
  | "prioritySupport"
  | "advancedAnalytics"
  | "teamMembers"
  | "customIntegrations"
  | "claudeCrawling"
  | "auditLogs";

export type PlanFeature = {
  id: string;
  labelKey?: PresetFeatureKey;
  customLabel?: string;
  enabled: boolean;
};

export type PlanLimits = {
  tokensPerMonth: number | null;
  apiRequestsPerMonth: number | null;
  projects: number | null;
  storageGb: number | null;
  teamMembers: number | null;
  connectedSites: number | null;
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  subscribers: number;
  status: PlanStatus;
  createdAt: string;
  limits: PlanLimits;
  features: PlanFeature[];
};

export type PlanInput = {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  status: PlanStatus;
  limits: PlanLimits;
  features: PlanFeature[];
};

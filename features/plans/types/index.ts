export type PlanStatusFilter = "all" | "active" | "inactive";

export type DiscountType = "percent" | "fixed";

export type DiscountScope = "month" | "year";

export type SupportPriority = "community" | "email" | "priority" | "dedicated";

export type PlanFeatures = {
  displayName: string;
  requestsLimit: number | null;
  apiTokenLimit: number | null;
  maxWebsites: number | null;
  crawlingEnabled: boolean;
  supportPriority: string;
  highlights: string[];
};

export type PlanDiscount = {
  type: DiscountType;
  value: number;
  scope: DiscountScope;
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  maxProjects: number;
  features: PlanFeatures;
  // Raw features object as returned by the backend, kept so unknown/extra
  // keys survive a round-trip through the edit form instead of being dropped.
  featuresRaw: Record<string, unknown> | null;
  discount: PlanDiscount | null;
  isActive: boolean;
  subscribers: number;
  createdAt: string;
};

export type PlanInput = {
  name: string;
  description: string;
  priceMonthly: number;
  autoYearly: boolean;
  maxProjects: number;
  features: PlanFeatures;
  featuresRaw: Record<string, unknown> | null;
  discount: PlanDiscount | null;
  isActive: boolean;
};

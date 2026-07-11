export type PlanStatusFilter = "all" | "active" | "inactive";

export type DiscountType = "percent" | "fixed";

export type DiscountScope = "month" | "year";

export type PlanFeatures = {
  requestsLimit: number;
  apiTokenLimit: number;
  maxWebsites: number;
  crawlingEnabled: boolean;
  supportPriority: string;
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
  discount: PlanDiscount | null;
  isActive: boolean;
};

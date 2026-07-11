import type { DiscountScope, DiscountType, Plan, PlanInput } from "@/features/plans/types";

export type PlanFormValues = {
  name: string;
  description: string;
  priceMonthly: string;
  autoYearly: boolean;
  maxProjects: string;
  requestsLimit: string;
  apiTokenLimit: string;
  maxWebsites: string;
  crawlingEnabled: boolean;
  supportPriority: string;
  discountEnabled: boolean;
  discountType: DiscountType;
  discountValue: string;
  discountScope: DiscountScope;
  isActive: boolean;
};

const DEFAULT_FORM_VALUES: PlanFormValues = {
  name: "",
  description: "",
  priceMonthly: "0",
  autoYearly: true,
  maxProjects: "1",
  requestsLimit: "0",
  apiTokenLimit: "0",
  maxWebsites: "1",
  crawlingEnabled: false,
  supportPriority: "",
  discountEnabled: false,
  discountType: "percent",
  discountValue: "",
  discountScope: "year",
  isActive: true,
};

export function buildFormValues(plan?: Plan): PlanFormValues {
  if (!plan) {
    return DEFAULT_FORM_VALUES;
  }

  return {
    name: plan.name,
    description: plan.description,
    priceMonthly: String(plan.priceMonthly),
    autoYearly: true,
    maxProjects: String(plan.maxProjects),
    requestsLimit: String(plan.features.requestsLimit),
    apiTokenLimit: String(plan.features.apiTokenLimit),
    maxWebsites: String(plan.features.maxWebsites),
    crawlingEnabled: plan.features.crawlingEnabled,
    supportPriority: plan.features.supportPriority,
    discountEnabled: plan.discount !== null,
    discountType: plan.discount?.type ?? "percent",
    discountValue: plan.discount ? String(plan.discount.value) : "",
    discountScope: plan.discount?.scope ?? "year",
    isActive: plan.isActive,
  };
}

export function formValuesToInput(values: PlanFormValues): PlanInput {
  return {
    name: values.name,
    description: values.description,
    priceMonthly: Number(values.priceMonthly) || 0,
    autoYearly: values.autoYearly,
    maxProjects: Number(values.maxProjects) || 0,
    features: {
      requestsLimit: Number(values.requestsLimit) || 0,
      apiTokenLimit: Number(values.apiTokenLimit) || 0,
      maxWebsites: Number(values.maxWebsites) || 0,
      crawlingEnabled: values.crawlingEnabled,
      supportPriority: values.supportPriority.trim(),
    },
    discount: values.discountEnabled
      ? {
          type: values.discountType,
          value: Number(values.discountValue) || 0,
          scope: values.discountScope,
        }
      : null,
    isActive: values.isActive,
  };
}

import type {
  DiscountScope,
  DiscountType,
  Plan,
  PlanInput,
  SupportPriority,
} from "@/features/plans/types";

export type PlanFormValues = {
  name: string;
  description: string;
  priceMonthly: string;
  autoYearly: boolean;
  maxProjects: string;
  displayName: string;
  requestsLimit: string;
  apiTokenLimit: string;
  maxWebsites: string;
  crawlingEnabled: boolean;
  supportPriority: SupportPriority;
  highlights: string[];
  discountEnabled: boolean;
  discountType: DiscountType;
  discountValue: string;
  discountScope: DiscountScope;
  isActive: boolean;
  // Extra/unknown `features` keys from the loaded plan, not editable in the
  // form but carried through so saving doesn't wipe them. See buildFeaturesPayload.
  featuresRaw: Record<string, unknown> | null;
};

const DEFAULT_FORM_VALUES: PlanFormValues = {
  name: "",
  description: "",
  priceMonthly: "0",
  autoYearly: true,
  maxProjects: "1",
  displayName: "",
  requestsLimit: "",
  apiTokenLimit: "",
  maxWebsites: "",
  crawlingEnabled: true,
  supportPriority: "community",
  highlights: [],
  discountEnabled: false,
  discountType: "percent",
  discountValue: "",
  discountScope: "year",
  isActive: true,
  featuresRaw: null,
};

function numberToInputValue(value: number | null): string {
  return value === null ? "" : String(value);
}

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
    displayName: plan.features.displayName,
    requestsLimit: numberToInputValue(plan.features.requestsLimit),
    apiTokenLimit: numberToInputValue(plan.features.apiTokenLimit),
    maxWebsites: numberToInputValue(plan.features.maxWebsites),
    crawlingEnabled: plan.features.crawlingEnabled,
    supportPriority: (plan.features.supportPriority || "community") as SupportPriority,
    highlights: plan.features.highlights,
    discountEnabled: plan.discount !== null,
    discountType: plan.discount?.type ?? "percent",
    discountValue: plan.discount ? String(plan.discount.value) : "",
    discountScope: plan.discount?.scope ?? "year",
    isActive: plan.isActive,
    featuresRaw: plan.featuresRaw,
  };
}

function parseNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : Number(trimmed) || 0;
}

export function formValuesToInput(values: PlanFormValues): PlanInput {
  return {
    name: values.name,
    description: values.description,
    priceMonthly: Number(values.priceMonthly) || 0,
    autoYearly: values.autoYearly,
    maxProjects: Number(values.maxProjects) || 0,
    features: {
      displayName: values.displayName.trim(),
      requestsLimit: parseNullableNumber(values.requestsLimit),
      apiTokenLimit: parseNullableNumber(values.apiTokenLimit),
      maxWebsites: parseNullableNumber(values.maxWebsites),
      crawlingEnabled: values.crawlingEnabled,
      supportPriority: values.supportPriority,
      highlights: values.highlights.map((line) => line.trim()).filter((line) => line !== ""),
    },
    featuresRaw: values.featuresRaw,
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

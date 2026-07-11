import type { SubscriptionsListParams } from "@/features/subscriptions/types";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  lists: () => [...subscriptionKeys.all, "list"] as const,
  list: (params: SubscriptionsListParams) => [...subscriptionKeys.lists(), params] as const,
  details: () => [...subscriptionKeys.all, "detail"] as const,
  detail: (id: string) => [...subscriptionKeys.details(), id] as const,
  planOptions: () => [...subscriptionKeys.all, "plan-options"] as const,
  userOptions: (search: string) => [...subscriptionKeys.all, "user-options", search] as const,
};

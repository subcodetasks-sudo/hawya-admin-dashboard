import { queryOptions } from "@tanstack/react-query";

import { subscriptionKeys } from "@/features/subscriptions/query-keys";
import type { Subscription } from "@/features/subscriptions/types";

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

const mockSubscriptions: Subscription[] = [
  {
    id: "sub_sarah_chen",
    customerName: "Sarah Chen",
    customerEmail: "sarah.chen@techcorp.io",
    customerInitials: "SC",
    planKey: "pro",
    billingCycle: "monthly",
    status: "active",
    startDate: new Date(2024, 0, 15).toISOString(),
    renewalDate: new Date(2025, 0, 15).toISOString(),
    usagePercent: 87,
  },
  {
    id: "sub_marcus_williams",
    customerName: "Marcus Williams",
    customerEmail: "m.williams@startup.co",
    customerInitials: "MW",
    planKey: "business",
    billingCycle: "yearly",
    status: "active",
    startDate: new Date(2024, 1, 3).toISOString(),
    renewalDate: new Date(2025, 1, 3).toISOString(),
    usagePercent: 64,
  },
  {
    id: "sub_james_kim",
    customerName: "James Kim",
    customerEmail: "james.kim@aiventures.com",
    customerInitials: "JK",
    planKey: "enterprise",
    billingCycle: "yearly",
    status: "active",
    startDate: new Date(2024, 0, 30).toISOString(),
    renewalDate: new Date(2025, 0, 30).toISOString(),
    usagePercent: 91,
  },
  {
    id: "sub_thomas_muller",
    customerName: "Thomas Muller",
    customerEmail: "t.muller@enterprise.de",
    customerInitials: "TM",
    planKey: "business",
    billingCycle: "yearly",
    status: "active",
    startDate: new Date(2024, 1, 18).toISOString(),
    renewalDate: new Date(2025, 1, 18).toISOString(),
    usagePercent: 78,
  },
  {
    id: "sub_li_wei",
    customerName: "Li Wei",
    customerEmail: "li.wei@cloudtech.cn",
    customerInitials: "LW",
    planKey: "pro",
    billingCycle: "yearly",
    status: "active",
    startDate: new Date(2024, 2, 8).toISOString(),
    renewalDate: new Date(2025, 2, 8).toISOString(),
    usagePercent: 67,
  },
  {
    id: "sub_elena_rodriguez",
    customerName: "Elena Rodriguez",
    customerEmail: "elena@designstudio.es",
    customerInitials: "ER",
    planKey: "starter",
    billingCycle: "monthly",
    status: "pending",
    startDate: new Date(2024, 2, 22).toISOString(),
    renewalDate: new Date(2025, 2, 22).toISOString(),
    usagePercent: 32,
  },
  {
    id: "sub_aisha_okonkwo",
    customerName: "Aisha Okonkwo",
    customerEmail: "aisha@creative.ng",
    customerInitials: "AO",
    planKey: "starter",
    billingCycle: "monthly",
    status: "expired",
    startDate: new Date(2024, 4, 5).toISOString(),
    renewalDate: null,
    usagePercent: 0,
  },
  {
    id: "sub_priya_patel",
    customerName: "Priya Patel",
    customerEmail: "priya@dataflow.in",
    customerInitials: "PP",
    planKey: "starter",
    billingCycle: "monthly",
    status: "cancelled",
    startDate: new Date(2024, 3, 10).toISOString(),
    renewalDate: null,
    usagePercent: 45,
  },
];

export async function fetchSubscriptions(): Promise<Subscription[]> {
  return delay([...mockSubscriptions]);
}

export const subscriptionsListQueryOptions = queryOptions({
  queryKey: subscriptionKeys.lists(),
  queryFn: fetchSubscriptions,
});

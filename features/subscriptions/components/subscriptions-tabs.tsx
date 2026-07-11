"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subscriptionsListQueryOptions } from "@/features/subscriptions/services/subscriptions";
import type { SubscriptionsListParams, SubscriptionStatus } from "@/features/subscriptions/types";
import { toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_TABS: SubscriptionStatus[] = ["active", "pending", "expired", "suspended", "cancelled"];

type Props = {
  status: SubscriptionStatus;
  onStatusChange: (status: SubscriptionStatus) => void;
  params: SubscriptionsListParams;
};

export default function SubscriptionsTabs({ status, onStatusChange, params }: Props) {
  const t = useTranslations("Subscriptions");
  const locale = useLocale();
  // Counts reflect the overall breakdown regardless of the active status tab,
  // so this query intentionally omits `status` (a distinct cache entry from
  // the table's query, kept in sync with the same search/plan filters).
  const { data } = useQuery(
    subscriptionsListQueryOptions({
      page: 1,
      perPage: 1,
      search: params.search,
      userId: params.userId,
      planId: params.planId,
    }),
  );

  const counts: Record<SubscriptionStatus, number> = {
    active: 0,
    pending: 0,
    expired: 0,
    cancelled: 0,
    suspended: 0,
    ...data?.counts,
  };

  return (
    <Tabs
      value={status}
      onValueChange={(value) => onStatusChange(value as SubscriptionStatus)}
      className="px-4 overflow-scroll md:overflow-hidden"
    >
      <TabsList variant="line" className="h-auto gap-4 py-3">
        {STATUS_TABS.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="gap-2 px-1 py-3 data-active:text-primary after:bg-primary"
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                status === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {toLocaleDigits(String(counts[tab]), locale)}
            </span>
            {t(`tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

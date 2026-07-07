"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subscriptionsListQueryOptions } from "@/features/subscriptions/services/subscriptions";
import type { SubscriptionStatus } from "@/features/subscriptions/types";
import { toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_TABS: SubscriptionStatus[] = ["active", "pending", "expired", "cancelled"];

type Props = {
  status: SubscriptionStatus;
  onStatusChange: (status: SubscriptionStatus) => void;
};

export default function SubscriptionsTabs({ status, onStatusChange }: Props) {
  const t = useTranslations("Subscriptions");
  const locale = useLocale();
  const { data } = useQuery(subscriptionsListQueryOptions);

  const counts: Record<SubscriptionStatus, number> = {
    active: 0,
    pending: 0,
    expired: 0,
    cancelled: 0,
  };

  for (const subscription of data ?? []) {
    counts[subscription.status] += 1;
  }

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

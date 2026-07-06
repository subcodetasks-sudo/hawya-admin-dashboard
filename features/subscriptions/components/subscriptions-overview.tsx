"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import SubscriptionsTable from "@/features/subscriptions/components/subscriptions-table";
import SubscriptionsTabs from "@/features/subscriptions/components/subscriptions-tabs";
import SubscriptionsToolbar from "@/features/subscriptions/components/subscriptions-toolbar";
import type { SubscriptionStatus } from "@/features/subscriptions/types";

export default function SubscriptionsOverview() {
  const t = useTranslations("Subscriptions");
  const [status, setStatus] = useState<SubscriptionStatus>("active");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="overflow-hidden flex flex-col gap-7">
        <div className="border-b">
          <SubscriptionsTabs status={status} onStatusChange={setStatus} />
        </div>
        <div className="bg-card ring-1 ring-foreground/10 rounded-xl">
        <SubscriptionsToolbar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
        <SubscriptionsTable searchQuery={searchQuery} statusFilter={status} />
        </div>
      </div>
    </div>
  );
}

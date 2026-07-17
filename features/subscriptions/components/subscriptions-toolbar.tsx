"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { downloadCsv } from "@/lib/csv-export";
import {
  planOptionsQueryOptions,
  subscriptionsListQueryOptions,
} from "@/features/subscriptions/services/subscriptions";
import type { SubscriptionsListParams } from "@/features/subscriptions/types";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  planFilter: string;
  onPlanFilterChange: (value: string) => void;
  listParams: SubscriptionsListParams;
};

export default function SubscriptionsToolbar({
  searchQuery,
  onSearchQueryChange,
  planFilter,
  onPlanFilterChange,
  listParams,
}: Props) {
  const t = useTranslations("Subscriptions");
  const { data: plans } = useQuery(planOptionsQueryOptions);
  const { data } = useQuery(subscriptionsListQueryOptions(listParams));

  function handleExport() {
    const subscriptions = data?.subscriptions ?? [];
    const header = [
      "user_name",
      "user_email",
      "plan_name",
      "billing_cycle",
      "status",
      "price",
      "currency",
      "auto_renew",
      "started_at",
      "renews_at",
      "usage_percent",
    ];
    const rows = subscriptions.map((subscription) => [
      subscription.userName,
      subscription.userEmail,
      subscription.planName,
      subscription.billingCycle,
      subscription.status,
      String(subscription.price),
      subscription.currency,
      String(subscription.autoRenew),
      subscription.startedAt,
      subscription.renewsAt ?? "",
      String(subscription.usagePercent),
    ]);
    // Exports only the currently loaded page — the list endpoint is
    // server-paginated and there is no "export all" endpoint yet.
    downloadCsv([header, ...rows], "subscriptions.csv");
  }

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-4 border-b">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("toolbar.searchPlaceholder")}
          className="ps-8"
        />
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter data-icon="inline-start" />
              {t("toolbar.filter")}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <p className="px-1 pb-1 text-xs text-muted-foreground">
              {t("toolbar.filterPlanLabel")}
            </p>
            <RadioGroup value={planFilter} onValueChange={onPlanFilterChange}>
              <div className="flex items-center gap-2 px-1 py-1">
                <RadioGroupItem value="all" id="subscription-plan-filter-all" />
                <Label htmlFor="subscription-plan-filter-all">{t("toolbar.planAll")}</Label>
              </div>
              {(plans ?? []).map((plan) => (
                <div key={plan.id} className="flex items-center gap-2 px-1 py-1">
                  <RadioGroupItem value={plan.id} id={`subscription-plan-filter-${plan.id}`} />
                  <Label htmlFor={`subscription-plan-filter-${plan.id}`}>{plan.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={handleExport}>
          <Download data-icon="inline-start" />
          {t("toolbar.export")}
        </Button>
      </div>
    </div>
  );
}

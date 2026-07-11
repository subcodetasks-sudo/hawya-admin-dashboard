"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import CreateSubscriptionDialog from "@/features/subscriptions/components/create-subscription-dialog";
import SubscriptionsPagination from "@/features/subscriptions/components/subscriptions-pagination";
import SubscriptionsTable from "@/features/subscriptions/components/subscriptions-table";
import SubscriptionsTabs from "@/features/subscriptions/components/subscriptions-tabs";
import SubscriptionsToolbar from "@/features/subscriptions/components/subscriptions-toolbar";
import { useDebouncedValue } from "@/features/subscriptions/hooks/use-debounced-value";
import type { SubscriptionsListParams, SubscriptionStatus } from "@/features/subscriptions/types";

const PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 350;

export default function SubscriptionsOverview() {
  const t = useTranslations("Subscriptions");
  const [status, setStatus] = useState<SubscriptionStatus>("active");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const search = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  function handleStatusChange(next: SubscriptionStatus) {
    setStatus(next);
    setPage(1);
  }

  function handleSearchQueryChange(value: string) {
    setSearchInput(value);
    setPage(1);
  }

  function handlePlanFilterChange(value: string) {
    setPlanFilter(value);
    setPage(1);
  }

  const params: SubscriptionsListParams = {
    page,
    perPage: PER_PAGE,
    status,
    search: search.trim() || undefined,
    planId: planFilter === "all" ? undefined : planFilter,
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <CreateSubscriptionDialog
          trigger={
            <Button>
              <PlusCircle data-icon="inline-start" />
              {t("createSubscription")}
            </Button>
          }
        />
      </div>

      <div className="overflow-hidden flex flex-col gap-7">
        <div className="border-b">
          <SubscriptionsTabs status={status} onStatusChange={handleStatusChange} params={params} />
        </div>
        <div className="bg-card ring-1 ring-foreground/10 rounded-xl">
          <SubscriptionsToolbar
            searchQuery={searchInput}
            onSearchQueryChange={handleSearchQueryChange}
            planFilter={planFilter}
            onPlanFilterChange={handlePlanFilterChange}
            listParams={params}
          />
          <SubscriptionsTable params={params} />
          <SubscriptionsPagination params={params} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

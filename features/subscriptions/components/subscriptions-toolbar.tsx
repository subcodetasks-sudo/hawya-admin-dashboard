"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscriptionsListQueryOptions } from "@/features/subscriptions/services/subscriptions";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export default function SubscriptionsToolbar({ searchQuery, onSearchQueryChange }: Props) {
  const t = useTranslations("Subscriptions");
  const { data } = useQuery(subscriptionsListQueryOptions);

  function handleExport() {
    const subscriptions = data ?? [];
    const header = [
      "customerName",
      "customerEmail",
      "plan",
      "billingCycle",
      "status",
      "startDate",
      "renewalDate",
      "usagePercent",
    ];
    const rows = subscriptions.map((subscription) => [
      subscription.customerName,
      subscription.customerEmail,
      subscription.planKey,
      subscription.billingCycle,
      subscription.status,
      subscription.startDate,
      subscription.renewalDate ?? "",
      String(subscription.usagePercent),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "subscriptions.csv";
    link.click();
    URL.revokeObjectURL(url);
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
      <Button variant="outline" onClick={handleExport}>
        <Download data-icon="inline-start" />
        {t("toolbar.export")}
      </Button>
    </div>
  );
}

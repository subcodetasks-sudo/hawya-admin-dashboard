"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { plansListQueryOptions } from "@/features/plans/services/plans";
import type { PlanStatusFilter } from "@/features/plans/types";

const STATUS_FILTERS: PlanStatusFilter[] = ["all", "active", "inactive"];

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: PlanStatusFilter;
  onStatusFilterChange: (value: PlanStatusFilter) => void;
};

export default function PlansToolbar({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  const t = useTranslations("Plans");
  const { data } = useQuery(plansListQueryOptions);

  function handleExport() {
    const plans = data ?? [];
    const header = [
      "name",
      "description",
      "priceMonthly",
      "priceYearly",
      "subscribers",
      "status",
      "createdAt",
    ];
    const rows = plans.map((plan) => [
      plan.name,
      plan.description,
      String(plan.priceMonthly),
      String(plan.priceYearly),
      String(plan.subscribers),
      plan.isActive ? "active" : "inactive",
      plan.createdAt,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "plans.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-t-2xl px-4 py-3 border border-foreground/10">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter data-icon="inline-start" />
            {t("toolbar.filter")}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56">
          <RadioGroup
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as PlanStatusFilter)}
          >
            {STATUS_FILTERS.map((value) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={`status-filter-${value}`} />
                <Label htmlFor={`status-filter-${value}`}>{t(`status.${value}`)}</Label>
              </div>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>

      <Button variant="outline" onClick={handleExport}>
        <Download data-icon="inline-start" />
        {t("toolbar.export")}
      </Button>

      <div className="relative flex-1">
        <Search className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("toolbar.searchPlaceholder")}
          className="ps-8"
        />
      </div>
    </div>
  );
}

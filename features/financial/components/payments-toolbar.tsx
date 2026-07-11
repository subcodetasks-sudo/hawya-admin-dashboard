"use client";

import { Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PaymentStatus } from "@/features/financial/types";

const STATUS_OPTIONS: PaymentStatus[] = ["paid", "pending", "failed", "refunded"];

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: PaymentStatus | "all";
  onStatusFilterChange: (value: PaymentStatus | "all") => void;
};

export default function PaymentsToolbar({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  const t = useTranslations("Financial");

  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-4">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("payments.toolbar.searchPlaceholder")}
          className="ps-8"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter data-icon="inline-start" />
            {t("payments.toolbar.filter")}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56">
          <p className="px-1 pb-1 text-xs text-muted-foreground">
            {t("payments.toolbar.filterStatusLabel")}
          </p>
          <RadioGroup value={statusFilter} onValueChange={onStatusFilterChange}>
            <div className="flex items-center gap-2 px-1 py-1">
              <RadioGroupItem value="all" id="payment-status-all" />
              <Label htmlFor="payment-status-all">{t("payments.toolbar.statusAll")}</Label>
            </div>
            {STATUS_OPTIONS.map((status) => (
              <div key={status} className="flex items-center gap-2 px-1 py-1">
                <RadioGroupItem value={status} id={`payment-status-${status}`} />
                <Label htmlFor={`payment-status-${status}`}>
                  {t(`payments.status.${status}`)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
}

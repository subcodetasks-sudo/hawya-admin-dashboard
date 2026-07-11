"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { testimonialsListQueryOptions } from "@/features/testimonials/services/testimonials";
import type { TestimonialListParams, TestimonialStatusFilter } from "@/features/testimonials/types";
import { toLocaleDigits } from "@/lib/format";

const STATUS_FILTERS: TestimonialStatusFilter[] = ["all", "pending", "approved", "rejected"];

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: TestimonialStatusFilter;
  onStatusFilterChange: (value: TestimonialStatusFilter) => void;
  params: TestimonialListParams;
};

export default function TestimonialsToolbar({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  params,
}: Props) {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const { data } = useQuery(testimonialsListQueryOptions(params));

  return (
    <div className="flex items-center gap-3">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("toolbar.searchPlaceholder")}
          className="ps-8"
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(value) => onStatusFilterChange(value as TestimonialStatusFilter)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_FILTERS.map((value) => (
            <SelectItem key={value} value={value}>
              {data ? `${t(`status.${value}`)} (${toLocaleDigits(String(data.counts[value]), locale)})` : t(`status.${value}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

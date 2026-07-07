"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import TestimonialsGrid from "@/features/testimonials/components/testimonials-grid";
import TestimonialsRatingBreakdown from "@/features/testimonials/components/testimonials-rating-breakdown";
import TestimonialsRatingSummary from "@/features/testimonials/components/testimonials-rating-summary";
import TestimonialsToolbar from "@/features/testimonials/components/testimonials-toolbar";
import type { TestimonialStatusFilter } from "@/features/testimonials/types";

export default function TestimonialsOverview() {
  const t = useTranslations("Testimonials");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TestimonialStatusFilter>("all");

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        <TestimonialsRatingBreakdown className="md:col-span-2" />
        <TestimonialsRatingSummary />
      </div>

      <TestimonialsToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <TestimonialsGrid searchQuery={searchQuery} statusFilter={statusFilter} />
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import TestimonialCard from "@/features/testimonials/components/testimonial-card";
import { testimonialsListQueryOptions } from "@/features/testimonials/services/testimonials";
import type { TestimonialListParams } from "@/features/testimonials/types";

type Props = {
  params: TestimonialListParams;
};

export default function TestimonialsGrid({ params }: Props) {
  const t = useTranslations("Testimonials");
  const { data, isLoading, isError } = useQuery(testimonialsListQueryOptions(params));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-xl bg-card py-8 text-center text-sm text-destructive ring-1 ring-foreground/10">
        {t("grid.loadError")}
      </p>
    );
  }

  const reviews = data?.reviews ?? [];

  if (reviews.length === 0) {
    return (
      <p className="rounded-xl bg-card py-8 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
        {t("grid.empty")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {reviews.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
}

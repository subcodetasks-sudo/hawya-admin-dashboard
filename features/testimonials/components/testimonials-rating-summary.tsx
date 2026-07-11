"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TestimonialRatingStars from "@/features/testimonials/components/testimonial-rating-stars";
import { testimonialsListQueryOptions } from "@/features/testimonials/services/testimonials";
import type { TestimonialListParams } from "@/features/testimonials/types";
import { formatNumber, toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  params: TestimonialListParams;
  className?: string;
};

export default function TestimonialsRatingSummary({ params, className }: Props) {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(testimonialsListQueryOptions(params));

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="sr-only">{t("summary.overall.title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : isError || !data ? (
          <p className="text-sm text-destructive">{t("summary.loadError")}</p>
        ) : (
          <>
            <span className="text-4xl font-semibold tabular-nums">
              {toLocaleDigits(data.stats.average.toFixed(1), locale)}
            </span>
            <TestimonialRatingStars rating={Math.round(data.stats.average)} iconClassName="size-5" />
            <span className="text-sm text-muted-foreground">
              {t("summary.overall.totalReviews", { count: formatNumber(data.stats.total, locale) })}
            </span>
          </>
        )}
      </CardContent>
    </Card>
  );
}

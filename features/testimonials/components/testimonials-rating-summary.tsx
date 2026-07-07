"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TestimonialRatingStars from "@/features/testimonials/components/testimonial-rating-stars";
import { testimonialsListQueryOptions } from "@/features/testimonials/services/testimonials";
import { formatNumber, toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function TestimonialsRatingSummary({ className }: Props) {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const { data } = useQuery(testimonialsListQueryOptions);
  const testimonials = data ?? [];

  const total = testimonials.length;
  const average =
    total > 0 ? testimonials.reduce((sum, item) => sum + item.rating, 0) / total : 0;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="sr-only">{t("summary.overall.title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <span className="text-4xl font-semibold tabular-nums">
          {toLocaleDigits(average.toFixed(1), locale)}
        </span>
        <TestimonialRatingStars rating={Math.round(average)} iconClassName="size-5" />
        <span className="text-sm text-muted-foreground">
          {t("summary.overall.totalReviews", { count: formatNumber(total, locale) })}
        </span>
      </CardContent>
    </Card>
  );
}

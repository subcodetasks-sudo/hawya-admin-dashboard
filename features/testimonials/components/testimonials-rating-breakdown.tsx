"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { testimonialsListQueryOptions } from "@/features/testimonials/services/testimonials";
import { toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const STAR_LEVELS = [5, 4, 3, 2, 1];

type Props = {
  className?: string;
};

export default function TestimonialsRatingBreakdown({ className }: Props) {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const { data } = useQuery(testimonialsListQueryOptions);
  const testimonials = data ?? [];

  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const testimonial of testimonials) {
    counts[testimonial.rating] = (counts[testimonial.rating] ?? 0) + 1;
  }
  const total = testimonials.length;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("summary.ratingBreakdown.title")}</CardTitle>
        <CardDescription>{t("summary.ratingBreakdown.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {STAR_LEVELS.map((level) => (
          <div key={level} className="flex items-center gap-3">
            <span className="w-4 shrink-0 text-sm tabular-nums text-muted-foreground">
              {toLocaleDigits(String(level), locale)}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${total > 0 ? (counts[level] / total) * 100 : 0}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-end text-sm tabular-nums text-muted-foreground">
              {toLocaleDigits(String(counts[level]), locale)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

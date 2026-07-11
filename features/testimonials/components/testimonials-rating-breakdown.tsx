"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { testimonialsListQueryOptions } from "@/features/testimonials/services/testimonials";
import type { TestimonialListParams } from "@/features/testimonials/types";
import { toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const STAR_LEVELS = [5, 4, 3, 2, 1] as const;

type Props = {
  params: TestimonialListParams;
  className?: string;
};

export default function TestimonialsRatingBreakdown({ params, className }: Props) {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(testimonialsListQueryOptions(params));

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("summary.ratingBreakdown.title")}</CardTitle>
        <CardDescription>{t("summary.ratingBreakdown.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-4 w-full" />)
        ) : isError || !data ? (
          <p className="text-sm text-destructive">{t("summary.loadError")}</p>
        ) : (
          STAR_LEVELS.map((level) => {
            const count = data.stats.histogram[level] ?? 0;
            const total = data.stats.total;

            return (
              <div key={level} className="flex items-center gap-3">
                <span className="w-4 shrink-0 text-sm tabular-nums text-muted-foreground">
                  {toLocaleDigits(String(level), locale)}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-end text-sm tabular-nums text-muted-foreground">
                  {toLocaleDigits(String(count), locale)}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

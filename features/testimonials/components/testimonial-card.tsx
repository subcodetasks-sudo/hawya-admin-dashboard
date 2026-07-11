"use client";

import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import TestimonialPlanBadge from "@/features/testimonials/components/testimonial-plan-badge";
import TestimonialRatingStars from "@/features/testimonials/components/testimonial-rating-stars";
import TestimonialRowActions from "@/features/testimonials/components/testimonial-row-actions";
import TestimonialStatusBadge from "@/features/testimonials/components/testimonial-status-badge";
import type { Testimonial } from "@/features/testimonials/types";
import { avatarColorFor } from "@/lib/avatar-color";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { toLocaleDigits } from "@/lib/format";

type Props = {
  testimonial: Testimonial;
};

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function TestimonialCard({ testimonial }: Props) {
  const locale = useLocale();
  const t = useTranslations("Testimonials");
  const dateLocale = getDateFnsLocale(locale);

  const formattedDate = toLocaleDigits(
    format(new Date(testimonial.createdAt), "d MMMM yyyy", { locale: dateLocale }),
    locale,
  );

  return (
    <Card className="gap-3">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <TestimonialPlanBadge planName={testimonial.planName} />
          <TestimonialStatusBadge status={testimonial.status} />
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className={avatarColorFor(testimonial.id)}>
              {initialsFrom(testimonial.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-medium">{testimonial.displayName}</p>
              {testimonial.isAnonymous && (
                <Badge variant="outline" className="shrink-0">
                  {t("card.anonymous")}
                </Badge>
              )}
            </div>
            <TestimonialRatingStars rating={testimonial.rating} />
          </div>
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">{testimonial.text}</p>
      </CardContent>
      <CardFooter className="justify-between border-t-0 bg-transparent pt-0">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <TestimonialRowActions testimonial={testimonial} />
      </CardFooter>
    </Card>
  );
}

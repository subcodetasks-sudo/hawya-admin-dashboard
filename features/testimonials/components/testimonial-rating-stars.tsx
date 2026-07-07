"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  className?: string;
  iconClassName?: string;
};

export default function TestimonialRatingStars({ rating, className, iconClassName }: Props) {
  const t = useTranslations("Testimonials");

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <span className="sr-only">{t("ratingLabel", { rating })}</span>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            "size-3.5",
            index < rating ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30",
            iconClassName,
          )}
        />
      ))}
    </div>
  );
}

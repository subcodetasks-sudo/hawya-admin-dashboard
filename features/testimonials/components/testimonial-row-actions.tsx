"use client";

import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function TestimonialRowActions() {
  const t = useTranslations("Testimonials");

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon-sm" aria-label={t("rowActions.delete")}>
        <Trash2 />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label={t("rowActions.reject")}>
        <ThumbsDown />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label={t("rowActions.approve")}>
        <ThumbsUp />
      </Button>
    </div>
  );
}

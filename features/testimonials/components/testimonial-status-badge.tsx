"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { TestimonialStatus } from "@/features/testimonials/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<TestimonialStatus, string> = {
  pending: "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400",
  approved: "border-transparent bg-success/10 text-success",
  rejected: "border-transparent bg-destructive/10 text-destructive",
};

type Props = {
  status: TestimonialStatus;
};

export default function TestimonialStatusBadge({ status }: Props) {
  const t = useTranslations("Testimonials");

  return <Badge className={cn(STATUS_STYLES[status])}>{t(`status.${status}`)}</Badge>;
}

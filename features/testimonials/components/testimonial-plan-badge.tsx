"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { TestimonialPlanKey } from "@/features/testimonials/types";
import { cn } from "@/lib/utils";

const PLAN_STYLES: Record<TestimonialPlanKey, string> = {
  starter: "border-transparent bg-secondary text-secondary-foreground",
  pro: "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400",
  business: "border-transparent bg-violet-500/10 text-violet-600 dark:text-violet-400",
  enterprise: "border-transparent bg-foreground text-background",
};

type Props = {
  plan: TestimonialPlanKey;
};

export default function TestimonialPlanBadge({ plan }: Props) {
  const t = useTranslations("Dashboard");

  return <Badge className={cn(PLAN_STYLES[plan])}>{t(`plans.${plan}`)}</Badge>;
}

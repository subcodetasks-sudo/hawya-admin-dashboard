"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { SubscriptionStatus } from "@/features/subscriptions/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<SubscriptionStatus, string> = {
  active: "border-transparent bg-success/10 text-success",
  pending: "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400",
  expired: "border-transparent bg-muted text-muted-foreground",
  cancelled: "border-transparent bg-destructive/10 text-destructive",
  suspended: "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

type Props = {
  status: SubscriptionStatus;
};

export default function SubscriptionStatusBadge({ status }: Props) {
  const t = useTranslations("Subscriptions");

  return <Badge className={cn(STATUS_STYLES[status])}>{t(`status.${status}`)}</Badge>;
}

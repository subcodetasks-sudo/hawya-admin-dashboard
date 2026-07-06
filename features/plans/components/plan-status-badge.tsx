"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PlanStatus } from "@/features/plans/types";

type Props = {
  status: PlanStatus;
};

export default function PlanStatusBadge({ status }: Props) {
  const t = useTranslations("Plans");

  return (
    <Badge
      className={cn(
        "border-transparent",
        status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
      )}
    >
      {t(`status.${status}`)}
    </Badge>
  );
}

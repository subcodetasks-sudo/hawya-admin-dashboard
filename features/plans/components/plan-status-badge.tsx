"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  isActive: boolean;
};

export default function PlanStatusBadge({ isActive }: Props) {
  const t = useTranslations("Plans");

  return (
    <Badge
      className={cn(
        "border-transparent",
        isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
      )}
    >
      {t(isActive ? "status.active" : "status.inactive")}
    </Badge>
  );
}

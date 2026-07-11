"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  isActive: boolean;
};

export default function UserStatusBadge({ isActive }: Props) {
  const t = useTranslations("Users");

  return (
    <Badge
      className={cn(
        isActive
          ? "border-transparent bg-success/10 text-success"
          : "border-transparent bg-destructive/10 text-destructive",
      )}
    >
      {t(isActive ? "status.active" : "status.inactive")}
    </Badge>
  );
}

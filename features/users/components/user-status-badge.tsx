"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "@/features/users/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<UserStatus, string> = {
  active: "border-transparent bg-success/10 text-success",
  suspended: "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400",
  blocked: "border-transparent bg-destructive/10 text-destructive",
};

type Props = {
  status: UserStatus;
};

export default function UserStatusBadge({ status }: Props) {
  const t = useTranslations("Users");

  return <Badge className={cn(STATUS_STYLES[status])}>{t(`status.${status}`)}</Badge>;
}

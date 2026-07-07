"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { ApiUserStatus } from "@/features/claude-usage/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ApiUserStatus, string> = {
  active: "border-transparent bg-success/10 text-success",
  limitExceeded: "border-transparent bg-destructive/10 text-destructive",
};

type Props = {
  status: ApiUserStatus;
};

export default function ApiUserStatusBadge({ status }: Props) {
  const t = useTranslations("ClaudeUsage");

  return <Badge className={cn(STATUS_STYLES[status])}>{t(`status.${status}`)}</Badge>;
}

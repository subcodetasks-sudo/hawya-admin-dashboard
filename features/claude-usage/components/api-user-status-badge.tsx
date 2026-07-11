"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const KNOWN_STATUS_STYLES: Record<string, string> = {
  normal: "border-transparent bg-success/10 text-success",
  near_limit: "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const FALLBACK_STATUS_STYLE = "border-transparent bg-destructive/10 text-destructive";

type Props = {
  status: string;
};

export default function ApiUserStatusBadge({ status }: Props) {
  const t = useTranslations("ClaudeUsage");

  return (
    <Badge className={cn(KNOWN_STATUS_STYLES[status] ?? FALLBACK_STATUS_STYLE)}>
      {t.has(`status.${status}`) ? t(`status.${status}`) : status}
    </Badge>
  );
}

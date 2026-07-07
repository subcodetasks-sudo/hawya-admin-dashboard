"use client";

import { format } from "date-fns";
import { Copy, RefreshCw, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ApiKey } from "@/features/settings/types";

type Props = {
  apiKey: ApiKey;
  onCopy: (apiKey: ApiKey) => void;
  onRegenerate: (apiKey: ApiKey) => void;
  onDelete: (apiKey: ApiKey) => void;
  disabled?: boolean;
};

export default function ApiKeyItem({
  apiKey,
  onCopy,
  onRegenerate,
  onDelete,
  disabled = false,
}: Props) {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const createdAt = toLocaleDigits(
    format(new Date(apiKey.createdAt), "d MMMM yyyy", { locale: dateLocale }),
    locale,
  );

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 p-4 ring-1 ring-border/60">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">
            {t(`apiKeys.environments.${apiKey.environment}`)}
          </span>
          <Badge
            className={cn(
              "border-transparent",
              apiKey.status === "active"
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground",
            )}
          >
            {t(`apiKeys.${apiKey.status}`)}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {t("apiKeys.createdAt", { date: createdAt })}
        </span>
      </div>

      <span
        dir="ltr"
        className="hidden shrink-0 font-mono text-sm tracking-wide text-muted-foreground sm:inline"
      >
        {apiKey.maskedKey}
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={t("apiKeys.actions.copy")}
          disabled={disabled}
          onClick={() => onCopy(apiKey)}
        >
          <Copy />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={t("apiKeys.actions.regenerate")}
          disabled={disabled}
          onClick={() => onRegenerate(apiKey)}
        >
          <RefreshCw />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={t("apiKeys.actions.delete")}
          disabled={disabled}
          onClick={() => onDelete(apiKey)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

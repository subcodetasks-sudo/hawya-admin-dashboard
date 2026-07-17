"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { userFinancialStatusQueryOptions } from "@/features/users/services/users";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency, toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const AT_RISK_KEYWORDS = ["risk", "overdue", "delinquent", "suspend"];

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();

  if (AT_RISK_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "border-transparent bg-destructive/10 text-destructive";
  }

  return "border-transparent bg-success/10 text-success";
}

function humanizeStatus(status: string) {
  return status
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

type Props = {
  userId: string;
};

export default function UserFinancialStatus({ userId }: Props) {
  const t = useTranslations("Users");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(userFinancialStatusQueryOptions(userId));

  function formatDate(value: string) {
    return toLocaleDigits(format(new Date(value), "d MMMM yyyy", { locale: dateLocale }), locale);
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="px-1 text-sm font-semibold">{t("detail.financial.title")}</h3>

      {isLoading ? (
        <Skeleton className="h-16 rounded-lg" />
      ) : isError || !data ? (
        <p className="text-sm text-destructive">{t("detail.financial.loadError")}</p>
      ) : (
        <div className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{t("detail.financial.status")}</span>
            <Badge className={cn(statusBadgeClass(data.status))}>
              {humanizeStatus(data.status)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {t("detail.financial.outstandingAmount")}
            </span>
            <span className="font-medium tabular-nums">
              {formatCurrency(data.outstandingAmount, "USD", locale)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {t("detail.financial.lastPayment")}
            </span>
            <span className="font-medium">
              {data.lastPaymentAt ? formatDate(data.lastPaymentAt) : t("detail.financial.never")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

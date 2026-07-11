"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { recentPaymentsQueryOptions } from "@/features/dashboard/services/dashboard";
import type { PaymentStatus } from "@/features/dashboard/types";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency, toLocaleDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

const STATUS_STYLES: Record<PaymentStatus, string> = {
  paid: "border-transparent bg-success/10 text-success",
  pending: "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400",
  failed: "border-transparent bg-destructive/10 text-destructive",
  refunded: "border-transparent bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export default function RecentPaymentsTable() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(recentPaymentsQueryOptions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("payments.title")}</CardTitle>
        <CardDescription>{t("payments.subtitle")}</CardDescription>
        <CardAction>
          <Link
            href="/financial"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("payments.viewAll")}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-destructive">
            {t("payments.title")} — {t("payments.loadError")}
          </p>
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("payments.noData")}</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>{payment.customerInitials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {payment.customerName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {payment.planName} ·{" "}
                      {toLocaleDigits(
                        format(new Date(payment.date), "d MMMM yyyy", {
                          locale: dateLocale,
                        }),
                        locale,
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrency(payment.amount, payment.currency, locale)}
                  </span>
                  <Badge className={cn(STATUS_STYLES[payment.status])}>
                    {t(`payments.status.${payment.status}`)}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

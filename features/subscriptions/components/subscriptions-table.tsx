"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SubscriptionPlanBadge from "@/features/subscriptions/components/subscription-plan-badge";
import SubscriptionRowActions from "@/features/subscriptions/components/subscription-row-actions";
import SubscriptionStatusBadge from "@/features/subscriptions/components/subscription-status-badge";
import SubscriptionUsageMeter from "@/features/subscriptions/components/subscription-usage-meter";
import { subscriptionsListQueryOptions } from "@/features/subscriptions/services/subscriptions";
import type { SubscriptionsListParams } from "@/features/subscriptions/types";
import { avatarColorFor } from "@/lib/avatar-color";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency, toLocaleDigits } from "@/lib/format";

const COLUMN_COUNT = 8;

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

type Props = {
  params: SubscriptionsListParams;
};

export default function SubscriptionsTable({ params }: Props) {
  const t = useTranslations("Subscriptions");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(subscriptionsListQueryOptions(params));

  function formatDate(value: string) {
    return toLocaleDigits(
      format(new Date(value), "d MMMM yyyy", { locale: dateLocale }),
      locale,
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-4 text-start">{t("table.customer")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.plan")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.billing")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.price")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.status")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.renewal")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.usage")}</TableHead>
          <TableHead className="w-10 px-2" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell colSpan={COLUMN_COUNT} className="px-4 py-3">
                <Skeleton className="h-10 w-full" />
              </TableCell>
            </TableRow>
          ))
        ) : isError || !data ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={COLUMN_COUNT}
              className="px-4 py-8 text-center text-sm text-destructive"
            >
              {t("table.loadError")}
            </TableCell>
          </TableRow>
        ) : data.subscriptions.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={COLUMN_COUNT}
              className="px-4 py-8 text-center text-sm text-muted-foreground"
            >
              {t("table.empty")}
            </TableCell>
          </TableRow>
        ) : (
          data.subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className={avatarColorFor(subscription.id)}>
                      {initialsFrom(subscription.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{subscription.userName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {subscription.userEmail}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <SubscriptionPlanBadge plan={subscription.planName} />
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {t(`billing.${subscription.billingCycle}`)}
              </TableCell>
              <TableCell className="px-4 py-3 tabular-nums">
                {formatCurrency(subscription.price, subscription.currency, locale)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <SubscriptionStatusBadge status={subscription.status} />
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {subscription.renewsAt ? formatDate(subscription.renewsAt) : t("noRenewal")}
              </TableCell>
              <TableCell className="px-4 py-3">
                <SubscriptionUsageMeter value={subscription.usagePercent} locale={locale} />
              </TableCell>
              <TableCell className="px-2 py-3">
                <SubscriptionRowActions subscription={subscription} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

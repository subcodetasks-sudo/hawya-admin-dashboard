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
import type { SubscriptionStatus } from "@/features/subscriptions/types";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { toLocaleDigits } from "@/lib/format";

const AVATAR_PALETTE = [
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  "bg-teal-500/15 text-teal-700 dark:text-teal-400",
  "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
];

function avatarColorFor(seed: string) {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % AVATAR_PALETTE.length;
  }
  return AVATAR_PALETTE[hash];
}

type Props = {
  searchQuery: string;
  statusFilter: SubscriptionStatus;
};

export default function SubscriptionsTable({ searchQuery, statusFilter }: Props) {
  const t = useTranslations("Subscriptions");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(subscriptionsListQueryOptions);

  const subscriptions = (data ?? []).filter((subscription) => {
    const matchesStatus = subscription.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      subscription.customerName.toLowerCase().includes(query) ||
      subscription.customerEmail.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

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
          <TableHead className="px-4 text-start">{t("table.status")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.startDate")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.renewal")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.usage")}</TableHead>
          <TableHead className="w-10 px-2" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell colSpan={8} className="px-4 py-3">
                <Skeleton className="h-10 w-full" />
              </TableCell>
            </TableRow>
          ))
        ) : isError ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={8} className="px-4 py-8 text-center text-sm text-destructive">
              {t("table.loadError")}
            </TableCell>
          </TableRow>
        ) : subscriptions.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={8}
              className="px-4 py-8 text-center text-sm text-muted-foreground"
            >
              {t("table.empty")}
            </TableCell>
          </TableRow>
        ) : (
          subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className={avatarColorFor(subscription.id)}>
                      {subscription.customerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {subscription.customerName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {subscription.customerEmail}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <SubscriptionPlanBadge plan={subscription.planKey} />
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {t(`billing.${subscription.billingCycle}`)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <SubscriptionStatusBadge status={subscription.status} />
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {formatDate(subscription.startDate)}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {subscription.renewalDate ? formatDate(subscription.renewalDate) : t("noRenewal")}
              </TableCell>
              <TableCell className="px-4 py-3">
                <SubscriptionUsageMeter value={subscription.usagePercent} locale={locale} />
              </TableCell>
              <TableCell className="px-2 py-3">
                <SubscriptionRowActions />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

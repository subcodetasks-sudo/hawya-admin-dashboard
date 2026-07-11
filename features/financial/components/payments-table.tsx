"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaymentStatusBadge from "@/features/financial/components/payment-status-badge";
import { paymentsListQueryOptions } from "@/features/financial/services/financial";
import type { PaymentsListParams } from "@/features/financial/types";
import { avatarColorFor } from "@/lib/avatar-color";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency, toLocaleDigits } from "@/lib/format";

const COLUMN_COUNT = 7;

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

type Props = {
  params: PaymentsListParams;
  searchQuery: string;
};

export default function PaymentsTable({ params, searchQuery }: Props) {
  const t = useTranslations("Financial");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(paymentsListQueryOptions(params));

  const payments = useMemo(() => {
    const list = data?.payments ?? [];
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return list;
    }

    return list.filter(
      (payment) =>
        payment.userName.toLowerCase().includes(query) ||
        payment.reference.toLowerCase().includes(query),
    );
  }, [data, searchQuery]);

  function formatDate(value: string) {
    return toLocaleDigits(format(new Date(value), "d MMMM yyyy", { locale: dateLocale }), locale);
  }

  function handleCopyReference(reference: string) {
    navigator.clipboard.writeText(reference);
    toast.success(t("payments.referenceCopied"));
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-4 text-start">{t("payments.table.reference")}</TableHead>
          <TableHead className="px-4 text-start">{t("payments.table.customer")}</TableHead>
          <TableHead className="px-4 text-start">{t("payments.table.plan")}</TableHead>
          <TableHead className="px-4 text-start">{t("payments.table.amount")}</TableHead>
          <TableHead className="px-4 text-start">{t("payments.table.paymentMethod")}</TableHead>
          <TableHead className="px-4 text-start">{t("payments.table.date")}</TableHead>
          <TableHead className="px-4 text-start">{t("payments.table.status")}</TableHead>
          <TableHead className="w-10 px-2" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell colSpan={COLUMN_COUNT + 1} className="px-4 py-3">
                <Skeleton className="h-10 w-full" />
              </TableCell>
            </TableRow>
          ))
        ) : isError || !data ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={COLUMN_COUNT + 1}
              className="px-4 py-8 text-center text-sm text-destructive"
            >
              {t("payments.table.loadError")}
            </TableCell>
          </TableRow>
        ) : payments.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={COLUMN_COUNT + 1}
              className="px-4 py-8 text-center text-sm text-muted-foreground"
            >
              {t("payments.table.empty")}
            </TableCell>
          </TableRow>
        ) : (
          payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {payment.reference}
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className={avatarColorFor(payment.userId || payment.id)}>
                      {initialsFrom(payment.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="truncate text-sm font-medium">{payment.userName}</p>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">{payment.planName}</TableCell>
              <TableCell className="px-4 py-3 font-medium tabular-nums">
                {formatCurrency(payment.amount, payment.currency, locale)}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {payment.paymentMethod}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {formatDate(payment.date)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <PaymentStatusBadge status={payment.status} />
              </TableCell>
              <TableCell className="px-2 py-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  aria-label={t("payments.copyReference")}
                  onClick={() => handleCopyReference(payment.reference)}
                >
                  <Copy />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download } from "lucide-react";
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
import { useDownloadInvoice } from "@/features/financial/hooks/use-download-invoice";
import { invoicesListQueryOptions } from "@/features/financial/services/financial";
import type { Invoice, InvoicesListParams } from "@/features/financial/types";
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
  params: InvoicesListParams;
};

export default function InvoicesTable({ params }: Props) {
  const t = useTranslations("Financial");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(invoicesListQueryOptions(params));
  const downloadInvoice = useDownloadInvoice();

  const invoices = data?.invoices ?? [];

  function formatDate(value: string) {
    return toLocaleDigits(format(new Date(value), "d MMMM yyyy", { locale: dateLocale }), locale);
  }

  function handleDownload(invoice: Invoice) {
    downloadInvoice.mutate(
      { id: invoice.id, filename: invoice.number },
      {
        onError: () => {
          toast.error(t("invoices.downloadError"));
        },
      },
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-4 text-start">{t("invoices.table.number")}</TableHead>
          <TableHead className="px-4 text-start">{t("invoices.table.customer")}</TableHead>
          <TableHead className="px-4 text-start">{t("invoices.table.plan")}</TableHead>
          <TableHead className="px-4 text-start">{t("invoices.table.amount")}</TableHead>
          <TableHead className="px-4 text-start">{t("invoices.table.date")}</TableHead>
          <TableHead className="px-4 text-start">{t("invoices.table.status")}</TableHead>
          <TableHead className="w-10 px-2" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
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
              {t("invoices.table.loadError")}
            </TableCell>
          </TableRow>
        ) : invoices.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={COLUMN_COUNT + 1}
              className="px-4 py-8 text-center text-sm text-muted-foreground"
            >
              {t("invoices.table.empty")}
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {invoice.number}
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className={avatarColorFor(invoice.userId || invoice.id)}>
                      {initialsFrom(invoice.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="truncate text-sm font-medium">{invoice.userName}</p>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {invoice.planName ?? t("invoices.table.noPlan")}
              </TableCell>
              <TableCell className="px-4 py-3 font-medium tabular-nums">
                {formatCurrency(invoice.amount, invoice.currency, locale, {
                  maximumFractionDigits: 0,
                })}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {formatDate(invoice.issuedAt)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <PaymentStatusBadge status={invoice.status} />
              </TableCell>
              <TableCell className="px-2 py-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  aria-label={t("invoices.download")}
                  disabled={downloadInvoice.isPending}
                  onClick={() => handleDownload(invoice)}
                >
                  <Download />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

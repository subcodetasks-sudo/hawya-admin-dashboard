"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auditLogQueryOptions } from "@/features/settings/services/settings";
import type { AuditLogListParams } from "@/features/settings/types";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { toLocaleDigits } from "@/lib/format";

const COLUMN_COUNT = 4;

type Props = {
  params: AuditLogListParams;
};

export default function AuditLogTable({ params }: Props) {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(auditLogQueryOptions(params));

  function formatDate(value: string) {
    return toLocaleDigits(
      format(new Date(value), "d MMMM yyyy, HH:mm", { locale: dateLocale }),
      locale,
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-4 text-start">{t("auditLog.table.action")}</TableHead>
          <TableHead className="px-4 text-start">{t("auditLog.table.target")}</TableHead>
          <TableHead className="px-4 text-start">{t("auditLog.table.admin")}</TableHead>
          <TableHead className="px-4 text-start">{t("auditLog.table.date")}</TableHead>
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
              {t("auditLog.table.loadError")}
            </TableCell>
          </TableRow>
        ) : data.logs.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={COLUMN_COUNT}
              className="px-4 py-8 text-center text-sm text-muted-foreground"
            >
              {t("auditLog.table.empty")}
            </TableCell>
          </TableRow>
        ) : (
          data.logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{log.action}</span>
                  {log.detail ? (
                    <span className="text-xs text-muted-foreground">{log.detail}</span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm">{log.targetType}</span>
                  <span dir="ltr" className="text-start font-mono text-xs text-muted-foreground">
                    {log.targetId}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <span dir="ltr" className="text-start font-mono text-xs text-muted-foreground">
                  {log.adminId}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {formatDate(log.createdAt)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

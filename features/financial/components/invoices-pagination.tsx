"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { invoicesListQueryOptions } from "@/features/financial/services/financial";
import type { InvoicesListParams } from "@/features/financial/types";
import { formatNumber } from "@/lib/format";

type Props = {
  params: InvoicesListParams;
  onPageChange: (page: number) => void;
};

export default function InvoicesPagination({ params, onPageChange }: Props) {
  const t = useTranslations("Financial");
  const locale = useLocale();
  const { data, isLoading } = useQuery(invoicesListQueryOptions(params));

  if (isLoading || !data || data.total === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.perPage));

  return (
    <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {t("invoices.pagination.pageOf", {
          page: formatNumber(data.page, locale),
          totalPages: formatNumber(totalPages, locale),
        })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={data.page <= 1}
          onClick={() => onPageChange(data.page - 1)}
        >
          <ChevronLeft data-icon="inline-start" />
          {t("invoices.pagination.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={data.page >= totalPages}
          onClick={() => onPageChange(data.page + 1)}
        >
          {t("invoices.pagination.next")}
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}

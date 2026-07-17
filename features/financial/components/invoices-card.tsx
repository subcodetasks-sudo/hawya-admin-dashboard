"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvoicesPagination from "@/features/financial/components/invoices-pagination";
import InvoicesTable from "@/features/financial/components/invoices-table";

const PER_PAGE = 10;

export default function InvoicesCard() {
  const t = useTranslations("Financial");
  const [page, setPage] = useState(1);

  const params = { page, perPage: PER_PAGE };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("invoices.title")}</CardTitle>
        <CardDescription>{t("invoices.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 ring-1 ring-border/80 rounded-b-xl">
        <InvoicesTable params={params} />
        <InvoicesPagination params={params} onPageChange={setPage} />
      </CardContent>
    </Card>
  );
}

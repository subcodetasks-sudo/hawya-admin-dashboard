"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentsPagination from "@/features/financial/components/payments-pagination";
import PaymentsTable from "@/features/financial/components/payments-table";
import PaymentsToolbar from "@/features/financial/components/payments-toolbar";
import type { PaymentStatus } from "@/features/financial/types";

const PER_PAGE = 10;

export default function PaymentsCard() {
  const t = useTranslations("Financial");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");

  function handleStatusFilterChange(value: PaymentStatus | "all") {
    setStatusFilter(value);
    setPage(1);
  }

  const params = {
    page,
    perPage: PER_PAGE,
    status: statusFilter === "all" ? undefined : statusFilter,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("payments.title")}</CardTitle>
        <CardDescription>{t("payments.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 ring-1 ring-border/80 rounded-b-xl">
        <PaymentsToolbar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />
        <PaymentsTable params={params} searchQuery={searchQuery} />
        <PaymentsPagination params={params} onPageChange={setPage} />
      </CardContent>
    </Card>
  );
}

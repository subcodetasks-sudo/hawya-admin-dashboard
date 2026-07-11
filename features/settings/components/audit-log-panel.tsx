"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import AuditLogPagination from "@/features/settings/components/audit-log-pagination";
import AuditLogTable from "@/features/settings/components/audit-log-table";

const PER_PAGE = 10;

export default function AuditLogPanel() {
  const t = useTranslations("Settings");
  const [page, setPage] = useState(1);

  const params = { page, perPage: PER_PAGE };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="border-b border-border/70 px-5 py-4 md:px-6">
        <h2 className="text-sm font-semibold text-foreground">{t("auditLog.sectionTitle")}</h2>
      </div>
      <AuditLogTable params={params} />
      <AuditLogPagination params={params} onPageChange={setPage} />
    </div>
  );
}

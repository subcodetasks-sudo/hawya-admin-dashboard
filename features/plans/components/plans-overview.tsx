"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import PlanFormDialog from "@/features/plans/components/plan-form-dialog";
import PlansTable from "@/features/plans/components/plans-table";
import PlansToolbar from "@/features/plans/components/plans-toolbar";
import type { PlanStatusFilter } from "@/features/plans/types";

export default function PlansOverview() {
  const t = useTranslations("Plans");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlanStatusFilter>("all");

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <PlanFormDialog
          mode="create"
          trigger={
            <Button>
              <Plus data-icon="inline-start" />
              {t("createPlan")}
            </Button>
          }
        />
      </div>
      <div className="flex flex-col">
        <PlansToolbar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <PlansTable searchQuery={searchQuery} statusFilter={statusFilter} />
      </div>
    </div>
  );
}

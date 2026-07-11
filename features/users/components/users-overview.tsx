"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import CreateUserDialog from "@/features/users/components/create-user-dialog";
import UsersPagination from "@/features/users/components/users-pagination";
import UsersTable from "@/features/users/components/users-table";
import UsersToolbar from "@/features/users/components/users-toolbar";

const PER_PAGE = 10;

export default function UsersOverview() {
  const t = useTranslations("Users");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  function handleSearchQueryChange(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  function handlePlanFilterChange(value: string) {
    setPlanFilter(value);
    setPage(1);
  }

  const params = {
    page,
    perPage: PER_PAGE,
    search: searchQuery.trim() || undefined,
    planId: planFilter === "all" ? undefined : planFilter,
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <CreateUserDialog
          trigger={
            <Button>
              <UserPlus data-icon="inline-start" />
              {t("createUser")}
            </Button>
          }
        />
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <UsersToolbar
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          planFilter={planFilter}
          onPlanFilterChange={handlePlanFilterChange}
          listParams={params}
        />
        <UsersTable params={params} />
        <UsersPagination params={params} onPageChange={setPage} />
      </div>
    </div>
  );
}

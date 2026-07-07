"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import InviteUserDialog from "@/features/users/components/invite-user-dialog";
import UsersTable from "@/features/users/components/users-table";
import UsersToolbar from "@/features/users/components/users-toolbar";
import type { UserPlanFilter, UserStatusFilter } from "@/features/users/types";

export default function UsersOverview() {
  const t = useTranslations("Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("all");
  const [planFilter, setPlanFilter] = useState<UserPlanFilter>("all");

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <InviteUserDialog
          trigger={
            <Button>
              <UserPlus data-icon="inline-start" />
              {t("inviteUser")}
            </Button>
          }
        />
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <UsersToolbar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          planFilter={planFilter}
          onPlanFilterChange={setPlanFilter}
        />
        <UsersTable
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          planFilter={planFilter}
        />
      </div>
    </div>
  );
}

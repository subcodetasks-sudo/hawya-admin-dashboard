"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { planOptionsQueryOptions, usersListQueryOptions } from "@/features/users/services/users";
import type { UsersListParams } from "@/features/users/types";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  planFilter: string;
  onPlanFilterChange: (value: string) => void;
  listParams: UsersListParams;
};

export default function UsersToolbar({
  searchQuery,
  onSearchQueryChange,
  planFilter,
  onPlanFilterChange,
  listParams,
}: Props) {
  const t = useTranslations("Users");
  const { data: plans } = useQuery(planOptionsQueryOptions);
  const { data } = useQuery(usersListQueryOptions(listParams));

  function handleExport() {
    const users = data?.users ?? [];
    const header = [
      "display_name",
      "email",
      "plan_name",
      "is_active",
      "is_verified",
      "api_requests",
      "created_at",
      "last_login_at",
    ];
    const rows = users.map((user) => [
      user.displayName,
      user.email,
      user.planName,
      String(user.isActive),
      String(user.isVerified),
      String(user.apiRequests),
      user.createdAt,
      user.lastLoginAt ?? "",
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // Exports only the currently loaded page — the list endpoint is
    // server-paginated and there is no "export all" endpoint yet.
    link.download = "users.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-4 border-b">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder={t("toolbar.searchPlaceholder")}
          className="ps-8"
        />
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter data-icon="inline-start" />
              {t("toolbar.filter")}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <p className="px-1 pb-1 text-xs text-muted-foreground">
              {t("toolbar.filterPlanLabel")}
            </p>
            <RadioGroup value={planFilter} onValueChange={onPlanFilterChange}>
              <div className="flex items-center gap-2 px-1 py-1">
                <RadioGroupItem value="all" id="plan-filter-all" />
                <Label htmlFor="plan-filter-all">{t("toolbar.planAll")}</Label>
              </div>
              {(plans ?? []).map((plan) => (
                <div key={plan.id} className="flex items-center gap-2 px-1 py-1">
                  <RadioGroupItem value={plan.id} id={`plan-filter-${plan.id}`} />
                  <Label htmlFor={`plan-filter-${plan.id}`}>{plan.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={handleExport}>
          <Download data-icon="inline-start" />
          {t("toolbar.export")}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { usersListQueryOptions } from "@/features/users/services/users";
import type { UserPlanFilter, UserStatusFilter } from "@/features/users/types";

const STATUS_FILTERS: UserStatusFilter[] = ["all", "active", "suspended", "blocked"];
const PLAN_FILTERS: UserPlanFilter[] = ["all", "starter", "pro", "business", "enterprise"];

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: UserStatusFilter;
  onStatusFilterChange: (value: UserStatusFilter) => void;
  planFilter: UserPlanFilter;
  onPlanFilterChange: (value: UserPlanFilter) => void;
};

export default function UsersToolbar({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  planFilter,
  onPlanFilterChange,
}: Props) {
  const t = useTranslations("Users");
  const tDashboard = useTranslations("Dashboard");
  const { data } = useQuery(usersListQueryOptions);

  function handleExport() {
    const users = data ?? [];
    const header = [
      "name",
      "email",
      "plan",
      "status",
      "apiUsage",
      "signupDate",
      "lastLoginAt",
    ];
    const rows = users.map((user) => [
      user.name,
      user.email,
      user.planKey,
      user.status,
      String(user.apiUsage),
      user.signupDate,
      user.lastLoginAt,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
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
              {t("toolbar.filterStatusLabel")}
            </p>
            <RadioGroup
              value={statusFilter}
              onValueChange={(value) => onStatusFilterChange(value as UserStatusFilter)}
            >
              {STATUS_FILTERS.map((value) => (
                <div key={value} className="flex items-center gap-2 px-1 py-1">
                  <RadioGroupItem value={value} id={`status-filter-${value}`} />
                  <Label htmlFor={`status-filter-${value}`}>{t(`status.${value}`)}</Label>
                </div>
              ))}
            </RadioGroup>

            <Separator className="my-1" />

            <p className="px-1 pb-1 text-xs text-muted-foreground">
              {t("toolbar.filterPlanLabel")}
            </p>
            <RadioGroup
              value={planFilter}
              onValueChange={(value) => onPlanFilterChange(value as UserPlanFilter)}
            >
              {PLAN_FILTERS.map((value) => (
                <div key={value} className="flex items-center gap-2 px-1 py-1">
                  <RadioGroupItem value={value} id={`plan-filter-${value}`} />
                  <Label htmlFor={`plan-filter-${value}`}>
                    {value === "all" ? t("status.all") : tDashboard(`plans.${value}`)}
                  </Label>
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

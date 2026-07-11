"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ApiUserPlanBadge from "@/features/claude-usage/components/api-user-plan-badge";
import ApiUserStatusBadge from "@/features/claude-usage/components/api-user-status-badge";
import ApiUserUsageMeter from "@/features/claude-usage/components/api-user-usage-meter";
import { topApiUsersQueryOptions } from "@/features/claude-usage/services/claude-usage";
import { avatarColorFor } from "@/lib/avatar-color";
import { formatNumber } from "@/lib/format";

// `/admin/usage/top-users` doesn't return a cost field yet — the Cost column
// is dropped until the backend adds one. Keep in sync if it ever does.
const COLUMN_COUNT = 6;

export default function TopApiUsersTable() {
  const t = useTranslations("ClaudeUsage");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery(topApiUsersQueryOptions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("table.title")}</CardTitle>
        <CardDescription>{t("table.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 ring-1 ring-border/80 rounded-b-xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 text-start">{t("table.user")}</TableHead>
              <TableHead className="px-4 text-start">{t("table.plan")}</TableHead>
              <TableHead className="px-4 text-start">{t("table.requests")}</TableHead>
              <TableHead className="px-4 text-start">{t("table.tokens")}</TableHead>
              {/* <TableHead className="px-4 text-start">{t("table.cost")}</TableHead> */}
              <TableHead className="px-4 text-start">{t("table.usage")}</TableHead>
              <TableHead className="px-4 text-start">{t("table.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
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
                  {t("table.loadError")}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  {t("table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className={avatarColorFor(user.id)}>
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <p className="truncate text-sm font-medium">{user.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <ApiUserPlanBadge plan={user.planName} />
                  </TableCell>
                  <TableCell className="px-4 py-3 tabular-nums">
                    {formatNumber(user.requests, locale)}
                  </TableCell>
                  <TableCell className="px-4 py-3 tabular-nums">
                    {formatNumber(user.tokens, locale, {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    })}
                  </TableCell>
                  {/* <TableCell className="px-4 py-3 tabular-nums">
                    {formatCurrency(user.cost, user.currency, locale)}
                  </TableCell> */}
                  <TableCell className="px-4 py-3">
                    <ApiUserUsageMeter value={user.usagePercent} locale={locale} />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <ApiUserStatusBadge status={user.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

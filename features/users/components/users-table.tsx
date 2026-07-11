"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserPlanBadge from "@/features/users/components/user-plan-badge";
import UserRowActions from "@/features/users/components/user-row-actions";
import UserStatusBadge from "@/features/users/components/user-status-badge";
import { formatRelativeTime } from "@/features/users/lib/relative-time";
import { usersListQueryOptions } from "@/features/users/services/users";
import type { UsersListParams } from "@/features/users/types";
import { avatarColorFor } from "@/lib/avatar-color";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatNumber, toLocaleDigits } from "@/lib/format";

const COLUMN_COUNT = 7;

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

type Props = {
  params: UsersListParams;
};

export default function UsersTable({ params }: Props) {
  const t = useTranslations("Users");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(usersListQueryOptions(params));

  function formatDate(value: string) {
    return toLocaleDigits(
      format(new Date(value), "d MMMM yyyy", { locale: dateLocale }),
      locale,
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-4 text-start">{t("table.user")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.plan")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.status")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.apiUsage")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.signupDate")}</TableHead>
          <TableHead className="px-4 text-start">{t("table.lastLogin")}</TableHead>
          <TableHead className="w-10 px-2" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
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
        ) : data.users.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={COLUMN_COUNT}
              className="px-4 py-8 text-center text-sm text-muted-foreground"
            >
              {t("table.empty")}
            </TableCell>
          </TableRow>
        ) : (
          data.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className={avatarColorFor(user.id)}>
                      {initialsFrom(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <UserPlanBadge plan={user.planName} />
              </TableCell>
              <TableCell className="px-4 py-3">
                <UserStatusBadge isActive={user.isActive} />
              </TableCell>
              <TableCell className="px-4 py-3 tabular-nums">
                {formatNumber(user.apiRequests, locale)}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt, locale) : t("table.never")}
              </TableCell>
              <TableCell className="px-2 py-3">
                <UserRowActions user={user} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

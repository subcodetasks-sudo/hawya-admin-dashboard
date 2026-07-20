"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminMeQueryOptions } from "@/features/account/services/account";
import type { AdminRole } from "@/features/account/types";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { toLocaleDigits } from "@/lib/format";

const ROLE_BADGE_VARIANT: Record<AdminRole, "default" | "secondary" | "outline"> = {
  super_admin: "default",
  admin: "secondary",
  support: "outline",
};

export default function AccountProfileCard() {
  const t = useTranslations("Account.profile");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(adminMeQueryOptions());

  function formatDate(value: string | null) {
    if (!value) {
      return t("lastLoginNever");
    }
    return toLocaleDigits(format(new Date(value), "d MMMM yyyy, HH:mm", { locale: dateLocale }), locale);
  }

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold">{t("sectionTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ) : isError || !data ? (
          <p className="py-6 text-center text-sm text-destructive">{t("loadError")}</p>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback>{data.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{data.display_name}</span>
                <span dir="ltr" className="text-start text-sm text-muted-foreground">
                  {data.email}
                </span>
              </div>
              <Badge variant={ROLE_BADGE_VARIANT[data.role]} className="ms-auto">
                {t(`roles.${data.role}`)}
              </Badge>
            </div>

            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground">{t("lastLogin")}</dt>
                <dd>{formatDate(data.last_login_at)}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground">{t("memberSince")}</dt>
                <dd>{formatDate(data.created_at)}</dd>
              </div>
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

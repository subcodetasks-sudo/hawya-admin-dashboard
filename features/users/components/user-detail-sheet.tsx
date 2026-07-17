"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import UserDetailActions from "@/features/users/components/user-detail-actions";
import UserDetailNotes from "@/features/users/components/user-detail-notes";
import UserFinancialStatus from "@/features/users/components/user-financial-status";
import UserPlanBadge from "@/features/users/components/user-plan-badge";
import UserStatusBadge from "@/features/users/components/user-status-badge";
import { formatRelativeTime } from "@/features/users/lib/relative-time";
import { userDetailQueryOptions } from "@/features/users/services/users";
import { avatarColorFor } from "@/lib/avatar-color";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatNumber, toLocaleDigits } from "@/lib/format";

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

type Props = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserDetailSheet({ userId, open, onOpenChange }: Props) {
  const t = useTranslations("Users");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({ ...userDetailQueryOptions(userId), enabled: open });

  function formatDate(value: string) {
    return toLocaleDigits(
      format(new Date(value), "d MMMM yyyy", { locale: dateLocale }),
      locale,
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>{t("detail.title")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))}
              </div>
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
            </div>
          ) : isError || !user ? (
            <p className="text-sm text-destructive">{t("detail.loadError")}</p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarFallback className={avatarColorFor(user.id)}>
                      {initialsFrom(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <UserPlanBadge plan={user.planName} />
                  <UserStatusBadge isActive={user.isActive} />
                  <Badge
                    className={
                      user.isVerified
                        ? "border-transparent bg-secondary text-secondary-foreground"
                        : "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }
                  >
                    {t(user.isVerified ? "verification.verified" : "verification.unverified")}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">
                    {t("detail.stats.lastLogin")}
                  </span>
                  <span className="text-sm font-medium">
                    {user.lastLoginAt
                      ? formatRelativeTime(user.lastLoginAt, locale)
                      : t("table.never")}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">
                    {t("detail.stats.apiRequests")}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatNumber(user.apiRequests, locale)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">
                    {t("detail.stats.signupDate")}
                  </span>
                  <span className="text-sm font-medium">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">{t("detail.stats.plan")}</span>
                  <span className="text-sm font-medium">{user.planName}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">
                    {t("detail.stats.totalProjects")}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatNumber(user.totalProjects, locale)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">
                    {t("detail.stats.totalPayments")}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatNumber(user.totalPayments, locale)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">
                    {t("detail.stats.subscriptionMonths")}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatNumber(user.subscriptionMonths, locale)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">
                    {t("detail.stats.language")}
                  </span>
                  <span className="text-sm font-medium uppercase">{user.language}</span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="px-1 text-sm font-semibold">{t("detail.usage.title")}</h3>
                <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium tabular-nums">
                      {formatNumber(user.usage.apiRequests, locale)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("detail.usage.limit")}: {formatNumber(user.usage.limit, locale)}
                    </span>
                  </div>
                  <Progress value={Math.min(user.usage.usagePercent, 100)} />
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>
                      {t("detail.usage.tokens")}: {formatNumber(user.usage.tokens, locale)}
                    </span>
                    <span>
                      {t("detail.usage.remaining")}: {formatNumber(user.usage.remaining, locale)}
                    </span>
                    <span>
                      {t("detail.usage.successCount")}:{" "}
                      {formatNumber(user.usage.successCount, locale)}
                    </span>
                    <span>
                      {t("detail.usage.failedCount")}:{" "}
                      {formatNumber(user.usage.failedCount, locale)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="px-1 text-sm font-semibold">{t("detail.subscription.title")}</h3>
                {user.currentSubscription ? (
                  <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{user.currentSubscription.planName}</span>
                      <Badge className="border-transparent bg-secondary text-secondary-foreground">
                        {user.currentSubscription.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("detail.subscription.billingCycle")}: {user.currentSubscription.billingCycle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("detail.subscription.startedAt")}:{" "}
                      {formatDate(user.currentSubscription.startedAt)}
                      {" · "}
                      {t("detail.subscription.endsAt")}:{" "}
                      {formatDate(user.currentSubscription.endsAt)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("detail.subscription.empty")}</p>
                )}
              </div>

              {user.pastSubscriptions.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <h3 className="px-1 text-sm font-semibold">
                    {t("detail.pastSubscriptions.title")}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {user.pastSubscriptions.map((subscription, index) => (
                      <div
                        key={`${subscription.planName}-${index}`}
                        className="rounded-lg border border-border p-3 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{subscription.planName}</span>
                          <span className="text-xs text-muted-foreground">
                            {subscription.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(subscription.startedAt)} – {formatDate(subscription.endsAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <Separator />

              <UserFinancialStatus userId={user.id} />

              <Separator />

              <UserDetailActions user={user} />

              <Separator />

              <UserDetailNotes userId={user.id} notes={user.notes} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

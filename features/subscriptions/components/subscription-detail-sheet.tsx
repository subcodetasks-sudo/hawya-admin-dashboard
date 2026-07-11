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
import SubscriptionDetailActions from "@/features/subscriptions/components/subscription-detail-actions";
import SubscriptionDetailNote from "@/features/subscriptions/components/subscription-detail-note";
import SubscriptionPlanBadge from "@/features/subscriptions/components/subscription-plan-badge";
import SubscriptionStatusBadge from "@/features/subscriptions/components/subscription-status-badge";
import { subscriptionDetailQueryOptions } from "@/features/subscriptions/services/subscriptions";
import { avatarColorFor } from "@/lib/avatar-color";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatCurrency, toLocaleDigits } from "@/lib/format";

function initialsFrom(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

type Props = {
  subscriptionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SubscriptionDetailSheet({ subscriptionId, open, onOpenChange }: Props) {
  const t = useTranslations("Subscriptions");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const {
    data: subscription,
    isLoading,
    isError,
  } = useQuery({ ...subscriptionDetailQueryOptions(subscriptionId), enabled: open });

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
          ) : isError || !subscription ? (
            <p className="text-sm text-destructive">{t("detail.loadError")}</p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarFallback className={avatarColorFor(subscription.id)}>
                      {initialsFrom(subscription.userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{subscription.userName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {subscription.userEmail}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SubscriptionPlanBadge plan={subscription.planName} />
                  <SubscriptionStatusBadge status={subscription.status} />
                  <Badge
                    className={
                      subscription.autoRenew
                        ? "border-transparent bg-success/10 text-success"
                        : "border-transparent bg-secondary text-secondary-foreground"
                    }
                  >
                    {t(subscription.autoRenew ? "detail.autoRenewOn" : "detail.autoRenewOff")}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">{t("table.billing")}</span>
                  <span className="text-sm font-medium">
                    {t(`billing.${subscription.billingCycle}`)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">{t("table.price")}</span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrency(subscription.price, subscription.currency, locale)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">{t("table.startDate")}</span>
                  <span className="text-sm font-medium">{formatDate(subscription.startedAt)}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">{t("detail.endsAt")}</span>
                  <span className="text-sm font-medium">{formatDate(subscription.endsAt)}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
                  <span className="text-xs text-muted-foreground">{t("table.renewal")}</span>
                  <span className="text-sm font-medium">
                    {subscription.renewsAt ? formatDate(subscription.renewsAt) : t("noRenewal")}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <h3 className="px-1 text-sm font-semibold">{t("table.usage")}</h3>
                <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
                  <Progress value={Math.min(subscription.usagePercent, 100)} />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {toLocaleDigits(`${subscription.usagePercent}%`, locale)}
                  </span>
                </div>
              </div>

              <Separator />

              <SubscriptionDetailActions subscription={subscription} />

              <Separator />

              <SubscriptionDetailNote subscription={subscription} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SubscriptionDetailSheet from "@/features/subscriptions/components/subscription-detail-sheet";
import {
  useCancelSubscription,
  useRenewSubscription,
  useSuspendSubscription,
} from "@/features/subscriptions/hooks/use-subscription-mutations";
import type { Subscription } from "@/features/subscriptions/types";

type Props = {
  subscription: Subscription;
};

export default function SubscriptionRowActions({ subscription }: Props) {
  const t = useTranslations("Subscriptions");
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const suspendSubscription = useSuspendSubscription();
  const renewSubscription = useRenewSubscription();
  const cancelSubscription = useCancelSubscription();

  function handleSuspend() {
    suspendSubscription.mutate(subscription.id, {
      onSuccess: () => toast.success(t("toasts.suspended")),
      onError: () => toast.error(t("toasts.error")),
    });
  }

  function handleRenew() {
    renewSubscription.mutate(subscription.id, {
      onSuccess: () => toast.success(t("toasts.renewed")),
      onError: () => toast.error(t("toasts.error")),
    });
  }

  function handleCancel() {
    cancelSubscription.mutate(subscription.id, {
      onSuccess: () => {
        toast.success(t("toasts.cancelled"));
        setCancelDialogOpen(false);
      },
      onError: () => toast.error(t("toasts.error")),
    });
  }

  const canSuspend = subscription.status === "active" || subscription.status === "pending";
  const canRenew = subscription.status === "suspended" || subscription.status === "expired";
  const canCancel = subscription.status !== "cancelled";

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={t("rowActions.viewDetails")}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setDetailOpen(true)}>
            {t("rowActions.viewDetails")}
          </DropdownMenuItem>
          {canSuspend ? (
            <DropdownMenuItem disabled={suspendSubscription.isPending} onSelect={handleSuspend}>
              {t("rowActions.suspend")}
            </DropdownMenuItem>
          ) : null}
          {canRenew ? (
            <DropdownMenuItem disabled={renewSubscription.isPending} onSelect={handleRenew}>
              {t("rowActions.renew")}
            </DropdownMenuItem>
          ) : null}
          {canCancel ? (
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                setCancelDialogOpen(true);
              }}
            >
              {t("rowActions.cancelSubscription")}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cancelDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("cancelDialog.description", { name: subscription.userName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancelDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={cancelSubscription.isPending}
              onClick={handleCancel}
            >
              {t("cancelDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SubscriptionDetailSheet
        subscriptionId={subscription.id}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

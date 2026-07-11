"use client";

import { useState } from "react";
import { CalendarPlus, RefreshCcw, Repeat, ShieldAlert, UserX } from "lucide-react";
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
import ChangePlanDialog from "@/features/subscriptions/components/change-plan-dialog";
import GrantDaysDialog from "@/features/subscriptions/components/grant-days-dialog";
import {
  useCancelSubscription,
  useRenewSubscription,
  useSuspendSubscription,
} from "@/features/subscriptions/hooks/use-subscription-mutations";
import type { Subscription } from "@/features/subscriptions/types";

type Props = {
  subscription: Subscription;
};

export default function SubscriptionDetailActions({ subscription }: Props) {
  const t = useTranslations("Subscriptions");
  const [grantDaysOpen, setGrantDaysOpen] = useState(false);
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const suspendSubscription = useSuspendSubscription();
  const renewSubscription = useRenewSubscription();
  const cancelSubscription = useCancelSubscription();

  const canSuspend = subscription.status === "active" || subscription.status === "pending";
  const canRenew = subscription.status === "suspended" || subscription.status === "expired";
  const canCancel = subscription.status !== "cancelled";

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

  return (
    <div className="flex flex-col gap-1">
      <h3 className="px-1 text-sm font-semibold">{t("detail.actionsTitle")}</h3>

      <Button
        variant="ghost"
        className="h-auto w-full justify-start gap-2 py-2.5"
        onClick={() => setGrantDaysOpen(true)}
      >
        <CalendarPlus />
        {t("detail.actions.grantDays")}
      </Button>

      <Button
        variant="ghost"
        className="h-auto w-full justify-start gap-2 py-2.5"
        onClick={() => setChangePlanOpen(true)}
      >
        <Repeat />
        {t("detail.actions.changePlan")}
      </Button>

      {canRenew ? (
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-2 py-2.5 text-success hover:text-success"
          disabled={renewSubscription.isPending}
          onClick={handleRenew}
        >
          <RefreshCcw />
          {t("detail.actions.renew")}
        </Button>
      ) : null}

      {canSuspend ? (
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-2 py-2.5 text-amber-600 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-400"
          disabled={suspendSubscription.isPending}
          onClick={handleSuspend}
        >
          <UserX />
          {t("detail.actions.suspend")}
        </Button>
      ) : null}

      {canCancel ? (
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-2 py-2.5 text-destructive hover:text-destructive"
          onClick={() => setCancelDialogOpen(true)}
        >
          <ShieldAlert />
          {t("detail.actions.cancel")}
        </Button>
      ) : null}

      <GrantDaysDialog
        subscriptionId={subscription.id}
        open={grantDaysOpen}
        onOpenChange={setGrantDaysOpen}
      />

      <ChangePlanDialog
        subscription={subscription}
        open={changePlanOpen}
        onOpenChange={setChangePlanOpen}
      />

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
    </div>
  );
}

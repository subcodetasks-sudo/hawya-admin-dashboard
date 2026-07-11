"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, KeyRound, ShieldAlert, UserCheck, UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import BanUserDialog from "@/features/users/components/ban-user-dialog";
import {
  useActivateUser,
  useChangeUserPlan,
  useResetUserPassword,
  useSuspendUser,
} from "@/features/users/hooks/use-user-mutations";
import { planOptionsQueryOptions } from "@/features/users/services/users";
import type { UserDetail } from "@/features/users/types";

type Props = {
  user: UserDetail;
};

export default function UserDetailActions({ user }: Props) {
  const t = useTranslations("Users");
  const { data: plans } = useQuery(planOptionsQueryOptions);

  const [planPopoverOpen, setPlanPopoverOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);

  const changePlan = useChangeUserPlan();
  const resetPassword = useResetUserPassword();
  const suspendUser = useSuspendUser();
  const activateUser = useActivateUser();

  function handleAssignPlan(planId: string) {
    setPlanPopoverOpen(false);
    changePlan.mutate(
      { id: user.id, planId },
      { onSuccess: () => toast.success(t("toasts.planAssigned")) },
    );
  }

  function handleResetPassword() {
    resetPassword.mutate(user.id, {
      onSuccess: (password) => setTemporaryPassword(password),
    });
  }

  function handleSuspend() {
    suspendUser.mutate(user.id, { onSuccess: () => toast.success(t("toasts.suspended")) });
  }

  function handleActivate() {
    activateUser.mutate(user.id, { onSuccess: () => toast.success(t("toasts.reactivated")) });
  }

  return (
    <div className="flex flex-col gap-1">
      <h3 className="px-1 text-sm font-semibold">{t("detail.actionsTitle")}</h3>

      <Popover open={planPopoverOpen} onOpenChange={setPlanPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-auto w-full justify-start gap-2 py-2.5">
            <CreditCard />
            {t("detail.actions.assignPlan")}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56">
          <p className="px-1 pb-1 text-xs text-muted-foreground">{t("detail.assignPlanLabel")}</p>
          <div className="flex flex-col">
            {(plans ?? []).map((plan) => (
              <Button
                key={plan.id}
                variant="ghost"
                size="sm"
                className="justify-start"
                disabled={changePlan.isPending}
                onClick={() => handleAssignPlan(plan.id)}
              >
                {plan.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        className="h-auto w-full justify-start gap-2 py-2.5 text-success hover:text-success"
        disabled={resetPassword.isPending}
        onClick={handleResetPassword}
      >
        <KeyRound />
        {t("detail.actions.resetPassword")}
      </Button>

      <Button
        variant="ghost"
        className="h-auto w-full justify-start gap-2 py-2.5 text-success hover:text-success disabled:opacity-40"
        disabled={user.isActive || activateUser.isPending}
        onClick={handleActivate}
      >
        <UserCheck />
        {t("detail.actions.reactivate")}
      </Button>

      <Button
        variant="ghost"
        className="h-auto w-full justify-start gap-2 py-2.5 text-success hover:text-success disabled:opacity-40"
        disabled={!user.isActive || suspendUser.isPending}
        onClick={handleSuspend}
      >
        <UserX />
        {t("detail.actions.suspend")}
      </Button>

      <Button
        variant="ghost"
        className="h-auto w-full justify-start gap-2 py-2.5 text-destructive hover:text-destructive"
        onClick={() => setBanDialogOpen(true)}
      >
        <ShieldAlert />
        {t("detail.actions.ban")}
      </Button>

      <BanUserDialog
        userId={user.id}
        userName={user.displayName}
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
      />

      <Dialog
        open={Boolean(temporaryPassword)}
        onOpenChange={(next) => !next && setTemporaryPassword(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("detail.resetPasswordDialog.title")}</DialogTitle>
            <DialogDescription>{t("detail.resetPasswordDialog.description")}</DialogDescription>
          </DialogHeader>
          <p className="select-all rounded-md bg-muted px-3 py-2 font-mono text-sm">
            {temporaryPassword}
          </p>
          <DialogFooter>
            <Button onClick={() => setTemporaryPassword(null)}>
              {t("detail.resetPasswordDialog.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

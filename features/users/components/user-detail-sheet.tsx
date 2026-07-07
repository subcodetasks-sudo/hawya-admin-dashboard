"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CreditCard, KeyRound, ShieldAlert, UserCheck, UserX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import UserPlanBadge from "@/features/users/components/user-plan-badge";
import UserStatusBadge from "@/features/users/components/user-status-badge";
import {
  useAssignUserPlan,
  useBlockUser,
  useReactivateUser,
  useResetUserPassword,
  useSaveUserAdminNote,
  useSuspendUser,
} from "@/features/users/hooks/use-user-mutations";
import { formatRelativeTime } from "@/features/users/lib/relative-time";
import type { User, UserPlanKey } from "@/features/users/types";
import { avatarColorFor } from "@/lib/avatar-color";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatNumber, toLocaleDigits } from "@/lib/format";

const PLAN_OPTIONS: UserPlanKey[] = ["starter", "pro", "business", "enterprise"];

type Props = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserDetailSheet({ user, open, onOpenChange }: Props) {
  const t = useTranslations("Users");
  const tDashboard = useTranslations("Dashboard");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);

  const [note, setNote] = useState(user.adminNotes);
  const [prevUserId, setPrevUserId] = useState(user.id);
  const [planPopoverOpen, setPlanPopoverOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);

  if (user.id !== prevUserId) {
    setPrevUserId(user.id);
    setNote(user.adminNotes);
  }

  const assignPlan = useAssignUserPlan();
  const resetPassword = useResetUserPassword();
  const suspendUser = useSuspendUser();
  const reactivateUser = useReactivateUser();
  const blockUser = useBlockUser();
  const saveNote = useSaveUserAdminNote();

  function handleAssignPlan(planKey: UserPlanKey) {
    setPlanPopoverOpen(false);
    assignPlan.mutate(
      { id: user.id, planKey },
      { onSuccess: () => toast.success(t("toasts.planAssigned")) },
    );
  }

  function handleResetPassword() {
    resetPassword.mutate(user.id, {
      onSuccess: () => toast.success(t("toasts.passwordReset")),
    });
  }

  function handleSuspend() {
    suspendUser.mutate(user.id, {
      onSuccess: () => toast.success(t("toasts.suspended")),
    });
  }

  function handleReactivate() {
    reactivateUser.mutate(user.id, {
      onSuccess: () => toast.success(t("toasts.reactivated")),
    });
  }

  function handleBlock() {
    blockUser.mutate(user.id, {
      onSuccess: () => toast.success(t("toasts.blocked")),
    });
  }

  function handleSaveNote() {
    saveNote.mutate(
      { id: user.id, note },
      { onSuccess: () => toast.success(t("toasts.noteSaved")) },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{t("detail.title")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback className={avatarColorFor(user.id)}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserPlanBadge plan={user.planKey} />
              <UserStatusBadge status={user.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">
                {t("detail.stats.lastLogin")}
              </span>
              <span className="text-sm font-medium">
                {formatRelativeTime(user.lastLoginAt, locale)}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">
                {t("detail.stats.apiRequests")}
              </span>
              <span className="text-sm font-medium tabular-nums">
                {formatNumber(user.apiUsage, locale)}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">
                {t("detail.stats.signupDate")}
              </span>
              <span className="text-sm font-medium">
                {toLocaleDigits(
                  format(new Date(user.signupDate), "d MMMM yyyy", { locale: dateLocale }),
                  locale,
                )}
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
              <span className="text-xs text-muted-foreground">{t("detail.stats.plan")}</span>
              <span className="text-sm font-medium">{tDashboard(`plans.${user.planKey}`)}</span>
            </div>
          </div>

          <Separator />

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
                <p className="px-1 pb-1 text-xs text-muted-foreground">
                  {t("detail.assignPlanLabel")}
                </p>
                <RadioGroup
                  value={user.planKey}
                  onValueChange={(value) => handleAssignPlan(value as UserPlanKey)}
                >
                  {PLAN_OPTIONS.map((plan) => (
                    <div key={plan} className="flex items-center gap-2 px-1 py-1">
                      <RadioGroupItem value={plan} id={`assign-plan-${plan}`} />
                      <Label htmlFor={`assign-plan-${plan}`}>{tDashboard(`plans.${plan}`)}</Label>
                    </div>
                  ))}
                </RadioGroup>
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
              disabled={user.status !== "active" || suspendUser.isPending}
              onClick={handleSuspend}
            >
              <UserX />
              {t("detail.actions.suspend")}
            </Button>

            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-2 py-2.5 text-success hover:text-success disabled:opacity-40"
              disabled={user.status === "active" || reactivateUser.isPending}
              onClick={handleReactivate}
            >
              <UserCheck />
              {t("detail.actions.reactivate")}
            </Button>

            <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto w-full justify-start gap-2 py-2.5 text-destructive hover:text-destructive disabled:opacity-40"
                  disabled={user.status === "blocked"}
                >
                  <ShieldAlert />
                  {t("detail.actions.block")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("detail.blockDialog.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("detail.blockDialog.description", { name: user.name })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("detail.blockDialog.cancel")}</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleBlock}>
                    {t("detail.blockDialog.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <Label htmlFor="user-admin-notes">{t("detail.notesLabel")}</Label>
            <Textarea
              id="user-admin-notes"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("detail.notesPlaceholder")}
              className="min-h-24"
            />
            <Button onClick={handleSaveNote} disabled={saveNote.isPending}>
              {t("detail.saveNote")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

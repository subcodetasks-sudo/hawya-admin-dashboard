"use client";

import { useState } from "react";
import { Eye, UserCheck, UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UserDetailSheet from "@/features/users/components/user-detail-sheet";
import { useActivateUser, useSuspendUser } from "@/features/users/hooks/use-user-mutations";
import type { UserSummary } from "@/features/users/types";

type Props = {
  user: UserSummary;
};

export default function UserRowActions({ user }: Props) {
  const t = useTranslations("Users");
  const [detailOpen, setDetailOpen] = useState(false);
  const suspendUser = useSuspendUser();
  const activateUser = useActivateUser();

  function handleToggleStatus() {
    if (user.isActive) {
      suspendUser.mutate(user.id, { onSuccess: () => toast.success(t("toasts.suspended")) });
    } else {
      activateUser.mutate(user.id, {
        onSuccess: () => toast.success(t("toasts.reactivated")),
      });
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("rowActions.view")}
            onClick={() => setDetailOpen(true)}
          >
            <Eye />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("rowActions.view")}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t(user.isActive ? "rowActions.suspend" : "rowActions.reactivate")}
            disabled={suspendUser.isPending || activateUser.isPending}
            onClick={handleToggleStatus}
          >
            {user.isActive ? <UserX /> : <UserCheck />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t(user.isActive ? "rowActions.suspend" : "rowActions.reactivate")}
        </TooltipContent>
      </Tooltip>

      <UserDetailSheet userId={user.id} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}

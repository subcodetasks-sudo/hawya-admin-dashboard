"use client";

import { useState } from "react";
import { Eye, Pencil, UserCheck, UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import EditUserDialog from "@/features/users/components/edit-user-dialog";
import UserDetailSheet from "@/features/users/components/user-detail-sheet";
import { useReactivateUser, useSuspendUser } from "@/features/users/hooks/use-user-mutations";
import type { User } from "@/features/users/types";

type Props = {
  user: User;
};

export default function UserRowActions({ user }: Props) {
  const t = useTranslations("Users");
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const suspendUser = useSuspendUser();
  const reactivateUser = useReactivateUser();

  function handleToggleStatus() {
    if (user.status === "active") {
      suspendUser.mutate(user.id, { onSuccess: () => toast.success(t("toasts.suspended")) });
    } else {
      reactivateUser.mutate(user.id, {
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
            aria-label={t("rowActions.edit")}
            onClick={() => setEditOpen(true)}
          >
            <Pencil />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("rowActions.edit")}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t(user.status === "active" ? "rowActions.suspend" : "rowActions.reactivate")}
            disabled={suspendUser.isPending || reactivateUser.isPending}
            onClick={handleToggleStatus}
          >
            {user.status === "active" ? <UserX /> : <UserCheck />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t(user.status === "active" ? "rowActions.suspend" : "rowActions.reactivate")}
        </TooltipContent>
      </Tooltip>

      <UserDetailSheet user={user} open={detailOpen} onOpenChange={setDetailOpen} />
      <EditUserDialog user={user} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}

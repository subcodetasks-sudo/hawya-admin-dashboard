"use client";

import { useState } from "react";
import { Copy, Pencil, Power, PowerOff, Trash2 } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PlanFormDialog from "@/features/plans/components/plan-form-dialog";
import {
  useDeletePlan,
  useDuplicatePlan,
  useUpdatePlanStatus,
} from "@/features/plans/hooks/use-plan-mutations";
import type { Plan } from "@/features/plans/types";

type Props = {
  plan: Plan;
};

export default function PlanRowActions({ plan }: Props) {
  const t = useTranslations("Plans");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deletePlanMutation = useDeletePlan();
  const duplicatePlanMutation = useDuplicatePlan();
  const updateStatusMutation = useUpdatePlanStatus();

  function handleToggleStatus() {
    updateStatusMutation.mutate(
      { id: plan.id, isActive: !plan.isActive },
      {
        onSuccess: () =>
          toast.success(t(plan.isActive ? "toasts.deactivated" : "toasts.activated")),
        onError: () => toast.error(t("toasts.error")),
      },
    );
  }

  function handleDuplicate() {
    duplicatePlanMutation.mutate(plan.id, {
      onSuccess: () => toast.success(t("toasts.duplicated")),
      onError: () => toast.error(t("toasts.error")),
    });
  }

  function handleDelete() {
    deletePlanMutation.mutate(plan.id, {
      onSuccess: () => {
        toast.success(t("toasts.deleted"));
        setDeleteOpen(false);
      },
      onError: () => toast.error(t("toasts.error")),
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
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
            aria-label={t(plan.isActive ? "rowActions.deactivate" : "rowActions.activate")}
            disabled={updateStatusMutation.isPending}
            onClick={handleToggleStatus}
          >
            {plan.isActive ? <PowerOff /> : <Power />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t(plan.isActive ? "rowActions.deactivate" : "rowActions.activate")}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("rowActions.duplicate")}
            disabled={duplicatePlanMutation.isPending}
            onClick={handleDuplicate}
          >
            <Copy />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("rowActions.duplicate")}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("rowActions.delete")}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t("rowActions.delete")}</TooltipContent>
      </Tooltip>

      <PlanFormDialog mode="edit" plan={plan} open={editOpen} onOpenChange={setEditOpen} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", { name: plan.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deletePlanMutation.isPending}
              onClick={handleDelete}
            >
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

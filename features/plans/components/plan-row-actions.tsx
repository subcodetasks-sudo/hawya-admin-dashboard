"use client";

import { useState } from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { useDeletePlan, useDuplicatePlan } from "@/features/plans/hooks/use-plan-mutations";
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
            aria-label={t("rowActions.duplicate")}
            disabled={duplicatePlanMutation.isPending}
            onClick={() => duplicatePlanMutation.mutate(plan.id)}
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
              onClick={() => deletePlanMutation.mutate(plan.id)}
            >
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

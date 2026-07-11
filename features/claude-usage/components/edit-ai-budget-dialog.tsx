"use client";

import { useState, type FormEvent } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateAiSettings } from "@/features/claude-usage/hooks/use-ai-settings-mutations";

type Props = {
  currentBudget: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditAiBudgetDialog({ currentBudget, open, onOpenChange }: Props) {
  const t = useTranslations("ClaudeUsage");
  const updateAiSettings = useUpdateAiSettings();

  const [budget, setBudget] = useState(String(currentBudget));
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setBudget(String(currentBudget));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const monthlyBudgetUsd = Number(budget);

    if (!Number.isFinite(monthlyBudgetUsd) || monthlyBudgetUsd < 0) {
      return;
    }

    updateAiSettings.mutate(
      { monthlyBudgetUsd },
      {
        onSuccess: () => {
          toast.success(t("aiBudget.savedToast"));
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>{t("aiBudget.editTitle")}</DialogTitle>
            <DialogDescription>{t("aiBudget.editDescription")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ai-monthly-budget">{t("aiBudget.budgetLabel")}</Label>
            <Input
              id="ai-monthly-budget"
              type="number"
              min={0}
              step="0.01"
              dir="ltr"
              className="text-start"
              required
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("aiBudget.cancel")}
            </Button>
            <Button type="submit" disabled={updateAiSettings.isPending}>
              {t("aiBudget.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { useUpdateAnthropicBalance } from "@/features/claude-usage/hooks/use-anthropic-balance-mutations";

type Props = {
  currentBalance: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditAnthropicBalanceDialog({
  currentBalance,
  open,
  onOpenChange,
}: Props) {
  const t = useTranslations("ClaudeUsage.anthropic");
  const updateBalance = useUpdateAnthropicBalance();

  const [balance, setBalance] = useState(String(currentBalance));
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setBalance(String(currentBalance));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const knownBalanceUsd = Number(balance);

    if (!Number.isFinite(knownBalanceUsd) || knownBalanceUsd < 0) {
      return;
    }

    updateBalance.mutate(
      { knownBalanceUsd },
      {
        onSuccess: () => {
          toast.success(t("balance.savedToast"));
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
            <DialogTitle>{t("balance.editTitle")}</DialogTitle>
            <DialogDescription>{t("balance.editDescription")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="anthropic-known-balance">{t("balance.balanceLabel")}</Label>
            <Input
              id="anthropic-known-balance"
              type="number"
              min={0}
              step="0.01"
              dir="ltr"
              className="text-start"
              required
              value={balance}
              onChange={(event) => setBalance(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("balance.cancel")}
            </Button>
            <Button type="submit" disabled={updateBalance.isPending}>
              {t("balance.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

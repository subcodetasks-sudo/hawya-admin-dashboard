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
import { useGrantSubscriptionDays } from "@/features/subscriptions/hooks/use-subscription-mutations";

type Props = {
  subscriptionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function GrantDaysDialog({ subscriptionId, open, onOpenChange }: Props) {
  const t = useTranslations("Subscriptions");
  const grantDays = useGrantSubscriptionDays();
  const [days, setDays] = useState("7");

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setDays("7");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedDays = Number(days);
    if (!parsedDays || parsedDays <= 0) {
      return;
    }

    grantDays.mutate(
      { id: subscriptionId, days: parsedDays },
      {
        onSuccess: () => {
          toast.success(t("toasts.daysGranted"));
          handleOpenChange(false);
        },
        onError: () => toast.error(t("toasts.error")),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>{t("detail.grantDaysDialog.title")}</DialogTitle>
            <DialogDescription>{t("detail.grantDaysDialog.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="grant-days-input">{t("detail.grantDaysDialog.daysLabel")}</Label>
            <Input
              id="grant-days-input"
              type="number"
              min={1}
              required
              value={days}
              onChange={(event) => setDays(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("detail.grantDaysDialog.cancel")}
            </Button>
            <Button type="submit" disabled={grantDays.isPending}>
              {t("detail.grantDaysDialog.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

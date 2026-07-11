"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubscriptionUserPicker from "@/features/subscriptions/components/subscription-user-picker";
import { useCreateSubscription } from "@/features/subscriptions/hooks/use-subscription-mutations";
import { planOptionsQueryOptions } from "@/features/subscriptions/services/subscriptions";
import type { BillingCycle, SubscriptionStatus, UserOption } from "@/features/subscriptions/types";

const STATUS_OPTIONS: SubscriptionStatus[] = ["active", "pending", "suspended", "expired", "cancelled"];

type Props = {
  trigger: ReactNode;
};

export default function CreateSubscriptionDialog({ trigger }: Props) {
  const t = useTranslations("Subscriptions");
  const createSubscription = useCreateSubscription();
  const { data: plans, isLoading: plansLoading } = useQuery(planOptionsQueryOptions);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserOption | null>(null);
  const [planId, setPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [status, setStatus] = useState<SubscriptionStatus>("active");
  const [autoRenew, setAutoRenew] = useState(true);

  function resetForm() {
    setUser(null);
    setPlanId("");
    setBillingCycle("monthly");
    setStatus("active");
    setAutoRenew(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !planId) {
      return;
    }

    createSubscription.mutate(
      { userId: user.id, planId, billingCycle, status, autoRenew },
      {
        onSuccess: () => {
          toast.success(t("toasts.created"));
          handleOpenChange(false);
        },
        onError: () => toast.error(t("toasts.error")),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>{t("create.title")}</DialogTitle>
            <DialogDescription>{t("create.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label>{t("create.userLabel")}</Label>
            <SubscriptionUserPicker value={user} onChange={setUser} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-subscription-plan">{t("create.planLabel")}</Label>
            <Select value={planId} onValueChange={setPlanId} required>
              <SelectTrigger id="create-subscription-plan" className="w-full">
                <SelectValue placeholder={plansLoading ? t("create.planLoading") : undefined} />
              </SelectTrigger>
              <SelectContent>
                {(plans ?? []).map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("detail.changePlanDialog.billingCycleLabel")}</Label>
            <RadioGroup
              value={billingCycle}
              onValueChange={(value) => setBillingCycle(value as BillingCycle)}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="monthly" id="create-subscription-monthly" />
                <Label htmlFor="create-subscription-monthly" className="font-normal">
                  {t("billing.monthly")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yearly" id="create-subscription-yearly" />
                <Label htmlFor="create-subscription-yearly" className="font-normal">
                  {t("billing.yearly")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-subscription-status">{t("create.statusLabel")}</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as SubscriptionStatus)}>
              <SelectTrigger id="create-subscription-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`status.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="create-subscription-auto-renew"
              checked={autoRenew}
              onCheckedChange={(checked) => setAutoRenew(checked === true)}
            />
            <Label htmlFor="create-subscription-auto-renew" className="font-normal">
              {t("create.autoRenewLabel")}
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("create.cancel")}
            </Button>
            <Button type="submit" disabled={createSubscription.isPending || !user || !planId}>
              {t("create.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

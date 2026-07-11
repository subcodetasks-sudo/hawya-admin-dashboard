"use client";

import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChangeSubscriptionPlan } from "@/features/subscriptions/hooks/use-subscription-mutations";
import { planOptionsQueryOptions } from "@/features/subscriptions/services/subscriptions";
import type { BillingCycle, Subscription } from "@/features/subscriptions/types";
import { formatCurrency } from "@/lib/format";

type Props = {
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ChangePlanDialog({ subscription, open, onOpenChange }: Props) {
  const t = useTranslations("Subscriptions");
  const locale = useLocale();
  const { data: plans, isLoading: plansLoading } = useQuery(planOptionsQueryOptions);
  const changePlan = useChangeSubscriptionPlan();

  const [planId, setPlanId] = useState(subscription.planId);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription.billingCycle);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setPlanId(subscription.planId);
      setBillingCycle(subscription.billingCycle);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!planId) {
      return;
    }

    changePlan.mutate(
      { id: subscription.id, input: { planId, billingCycle } },
      {
        onSuccess: (result) => {
          toast.success(
            t("toasts.planChanged", {
              amount: formatCurrency(result.prorationDifference, subscription.currency, locale),
            }),
          );
          onOpenChange(false);
        },
        onError: () => toast.error(t("toasts.error")),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>{t("detail.changePlanDialog.title")}</DialogTitle>
            <DialogDescription>{t("detail.changePlanDialog.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="change-plan-select">{t("detail.changePlanDialog.planLabel")}</Label>
            <Select value={planId} onValueChange={setPlanId} required>
              <SelectTrigger id="change-plan-select" className="w-full">
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
                <RadioGroupItem value="monthly" id="change-plan-monthly" />
                <Label htmlFor="change-plan-monthly" className="font-normal">
                  {t("billing.monthly")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yearly" id="change-plan-yearly" />
                <Label htmlFor="change-plan-yearly" className="font-normal">
                  {t("billing.yearly")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("detail.changePlanDialog.cancel")}
            </Button>
            <Button type="submit" disabled={changePlan.isPending || !planId}>
              {t("detail.changePlanDialog.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

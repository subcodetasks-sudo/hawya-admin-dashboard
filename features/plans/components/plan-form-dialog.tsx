"use client";

import { useState, type FormEvent, type ReactNode } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import PlanDiscountFields from "@/features/plans/components/plan-discount-fields";
import PlanFeaturesFields from "@/features/plans/components/plan-features-fields";
import PlanHighlightsFields from "@/features/plans/components/plan-highlights-fields";
import PlanUsageLimitsFields from "@/features/plans/components/plan-usage-limits-fields";
import { useCreatePlan, useUpdatePlan } from "@/features/plans/hooks/use-plan-mutations";
import { buildFormValues, formValuesToInput } from "@/features/plans/lib/plan-form-values";
import type { Plan } from "@/features/plans/types";

type Props = {
  mode: "create" | "edit";
  plan?: Plan;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function PlanFormDialog({ mode, plan, trigger, open: openProp, onOpenChange }: Props) {
  const t = useTranslations("Plans");
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = onOpenChange ?? setOpenState;
  const [values, setValues] = useState(() => buildFormValues(plan));
  const [prevOpen, setPrevOpen] = useState(open);
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const mutation = mode === "create" ? createPlan : updatePlan;

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setValues(buildFormValues(plan));
    }
  }

  function patchValues(patch: Partial<typeof values>) {
    setValues((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = formValuesToInput(values);
    const onSuccess = () => {
      toast.success(mode === "create" ? t("toasts.created") : t("toasts.updated"));
      setOpen(false);
    };
    const onError = () => toast.error(t("toasts.error"));

    if (mode === "create") {
      createPlan.mutate(input, { onSuccess, onError });
    } else if (plan) {
      updatePlan.mutate({ id: plan.id, input }, { onSuccess, onError });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? t("form.createTitle") : t("form.editTitle")}
            </DialogTitle>
            <DialogDescription>
              {mode === "create" ? t("form.createDescription") : t("form.editDescription")}
            </DialogDescription>
          </DialogHeader>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.generalInfo")}</h3>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-name">{t("form.fields.name.label")}</Label>
              <Input
                id="plan-name"
                required
                value={values.name}
                onChange={(event) => patchValues({ name: event.target.value })}
                placeholder={t("form.fields.name.placeholder")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-description">{t("form.fields.description.label")}</Label>
              <Textarea
                id="plan-description"
                value={values.description}
                onChange={(event) => patchValues({ description: event.target.value })}
                placeholder={t("form.fields.description.placeholder")}
              />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.pricing")}</h3>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-monthly-price">{t("form.fields.monthlyPrice")}</Label>
              <Input
                id="plan-monthly-price"
                inputMode="decimal"
                required
                value={values.priceMonthly}
                onChange={(event) =>
                  patchValues({ priceMonthly: event.target.value.replace(/[^0-9.]/g, "") })
                }
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <Label htmlFor="plan-auto-yearly">{t("form.fields.autoYearly")}</Label>
                <span className="text-xs text-muted-foreground">
                  {t("form.fields.autoYearlyHint")}
                </span>
              </div>
              <Switch
                id="plan-auto-yearly"
                checked={values.autoYearly}
                onCheckedChange={(autoYearly) => patchValues({ autoYearly })}
              />
            </div>
            {mode === "edit" && plan ? (
              <p className="text-xs text-muted-foreground">
                {t("form.fields.yearlyPrice")}: <span dir="ltr">${plan.priceYearly}</span>
              </p>
            ) : null}
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.limits")}</h3>
            <PlanUsageLimitsFields values={values} onChange={patchValues} />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.features")}</h3>
            <PlanFeaturesFields values={values} onChange={patchValues} />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.highlights")}</h3>
            <PlanHighlightsFields values={values} onChange={patchValues} />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.discount")}</h3>
            <PlanDiscountFields values={values} onChange={patchValues} />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.status")}</h3>
            <RadioGroup
              value={values.isActive ? "active" : "inactive"}
              onValueChange={(value) => patchValues({ isActive: value === "active" })}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="active" id="plan-status-active" />
                <Label htmlFor="plan-status-active">{t("form.statusOptions.active")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="inactive" id="plan-status-inactive" />
                <Label htmlFor="plan-status-inactive">{t("form.statusOptions.inactive")}</Label>
              </div>
            </RadioGroup>
          </section>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("form.cancel")}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mode === "create" ? t("form.submitCreate") : t("form.submitEdit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

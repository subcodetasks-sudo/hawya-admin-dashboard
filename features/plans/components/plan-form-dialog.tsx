"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PlanFeatureToggleList from "@/features/plans/components/plan-feature-toggle-list";
import PlanUsageLimitsFields from "@/features/plans/components/plan-usage-limits-fields";
import { useCreatePlan, useUpdatePlan } from "@/features/plans/hooks/use-plan-mutations";
import { buildFormValues, formValuesToLimits } from "@/features/plans/lib/plan-form-values";
import type { Plan, PlanStatus } from "@/features/plans/types";

const CURRENCIES = ["USD", "SAR", "EUR"] as const;

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = {
      name: values.name,
      description: values.description,
      monthlyPrice: Number(values.monthlyPrice) || 0,
      annualPrice: Number(values.annualPrice) || 0,
      currency: values.currency,
      status: values.status,
      limits: formValuesToLimits(values.limits),
      features: values.features,
    };
    const onSuccess = () => setOpen(false);

    if (mode === "create") {
      createPlan.mutate(input, { onSuccess });
    } else if (plan) {
      updatePlan.mutate({ id: plan.id, input }, { onSuccess });
    }
  }

  function addCustomFeature() {
    setValues((prev) => ({
      ...prev,
      features: [...prev.features, { id: `custom-${Date.now()}`, customLabel: "", enabled: true }],
    }));
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
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder={t("form.fields.name.placeholder")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-description">{t("form.fields.description.label")}</Label>
              <Textarea
                id="plan-description"
                value={values.description}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder={t("form.fields.description.placeholder")}
              />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.pricing")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="plan-monthly-price">{t("form.fields.monthlyPrice")}</Label>
                <Input
                  id="plan-monthly-price"
                  inputMode="decimal"
                  value={values.monthlyPrice}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      monthlyPrice: event.target.value.replace(/[^0-9.]/g, ""),
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="plan-annual-price">{t("form.fields.annualPrice")}</Label>
                <Input
                  id="plan-annual-price"
                  inputMode="decimal"
                  value={values.annualPrice}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      annualPrice: event.target.value.replace(/[^0-9.]/g, ""),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-currency">{t("form.fields.currency")}</Label>
              <Select
                value={values.currency}
                onValueChange={(currency) => setValues((prev) => ({ ...prev, currency }))}
              >
                <SelectTrigger id="plan-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.usageLimits")}</h3>
            <PlanUsageLimitsFields
              limits={values.limits}
              onChange={(limits) => setValues((prev) => ({ ...prev, limits }))}
            />
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{t("form.sections.features")}</h3>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0"
                onClick={addCustomFeature}
              >
                <Plus className="size-3.5" data-icon="inline-start" />
                {t("form.addFeature")}
              </Button>
            </div>
            <PlanFeatureToggleList
              features={values.features}
              onChange={(features) => setValues((prev) => ({ ...prev, features }))}
            />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("form.sections.status")}</h3>
            <RadioGroup
              value={values.status}
              onValueChange={(status) =>
                setValues((prev) => ({ ...prev, status: status as PlanStatus }))
              }
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

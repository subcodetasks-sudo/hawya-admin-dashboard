"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { PlanFormValues } from "@/features/plans/lib/plan-form-values";
import type { DiscountScope, DiscountType } from "@/features/plans/types";

type Props = {
  values: PlanFormValues;
  onChange: (patch: Partial<PlanFormValues>) => void;
};

export default function PlanDiscountFields({ values, onChange }: Props) {
  const t = useTranslations("Plans");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="plan-discount-enabled">{t("form.discount.enable")}</Label>
        <Switch
          id="plan-discount-enabled"
          checked={values.discountEnabled}
          onCheckedChange={(discountEnabled) => onChange({ discountEnabled })}
        />
      </div>
      {values.discountEnabled ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="plan-discount-type">{t("form.discount.type")}</Label>
            <Select
              value={values.discountType}
              onValueChange={(discountType) =>
                onChange({ discountType: discountType as DiscountType })
              }
            >
              <SelectTrigger id="plan-discount-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">{t("form.discount.typePercent")}</SelectItem>
                <SelectItem value="fixed">{t("form.discount.typeFixed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="plan-discount-value">{t("form.discount.value")}</Label>
            <Input
              id="plan-discount-value"
              inputMode="decimal"
              required
              value={values.discountValue}
              onChange={(event) =>
                onChange({ discountValue: event.target.value.replace(/[^0-9.]/g, "") })
              }
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="plan-discount-scope">{t("form.discount.scope")}</Label>
            <Select
              value={values.discountScope}
              onValueChange={(discountScope) =>
                onChange({ discountScope: discountScope as DiscountScope })
              }
            >
              <SelectTrigger id="plan-discount-scope" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">{t("form.discount.scopeMonth")}</SelectItem>
                <SelectItem value="year">{t("form.discount.scopeYear")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}
    </div>
  );
}

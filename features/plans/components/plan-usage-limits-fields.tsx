"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PlanFormValues } from "@/features/plans/lib/plan-form-values";

type Props = {
  values: PlanFormValues;
  onChange: (patch: Partial<PlanFormValues>) => void;
};

export default function PlanUsageLimitsFields({ values, onChange }: Props) {
  const t = useTranslations("Plans");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="plan-maxProjects">{t("form.fields.maxProjects")}</Label>
      <Input
        id="plan-maxProjects"
        inputMode="numeric"
        required
        value={values.maxProjects}
        onChange={(event) =>
          onChange({ maxProjects: event.target.value.replace(/[^0-9]/g, "") })
        }
      />
    </div>
  );
}

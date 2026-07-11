"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PlanFormValues } from "@/features/plans/lib/plan-form-values";

const LIMIT_FIELD_KEYS = [
  "maxProjects",
  "requestsLimit",
  "apiTokenLimit",
  "maxWebsites",
] as const;

type Props = {
  values: PlanFormValues;
  onChange: (patch: Partial<PlanFormValues>) => void;
};

export default function PlanUsageLimitsFields({ values, onChange }: Props) {
  const t = useTranslations("Plans");

  return (
    <div className="grid grid-cols-2 gap-3">
      {LIMIT_FIELD_KEYS.map((key) => (
        <div key={key} className="flex flex-col gap-1.5">
          <Label htmlFor={`plan-${key}`}>{t(`form.fields.${key}`)}</Label>
          <Input
            id={`plan-${key}`}
            inputMode="numeric"
            required
            value={values[key]}
            onChange={(event) =>
              onChange({ [key]: event.target.value.replace(/[^0-9]/g, "") })
            }
          />
        </div>
      ))}
    </div>
  );
}

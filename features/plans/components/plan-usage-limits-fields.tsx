"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PlanLimitsFormValues } from "@/features/plans/lib/plan-form-values";

const LIMIT_FIELD_KEYS: (keyof PlanLimitsFormValues)[] = [
  "tokensPerMonth",
  "apiRequestsPerMonth",
  "projects",
  "storageGb",
  "teamMembers",
  "connectedSites",
];

type Props = {
  limits: PlanLimitsFormValues;
  onChange: (limits: PlanLimitsFormValues) => void;
};

export default function PlanUsageLimitsFields({ limits, onChange }: Props) {
  const t = useTranslations("Plans");

  return (
    <div className="grid grid-cols-2 gap-3">
      {LIMIT_FIELD_KEYS.map((key) => (
        <div key={key} className="flex flex-col gap-1.5">
          <Label htmlFor={`plan-limit-${key}`}>{t(`form.fields.${key}`)}</Label>
          <Input
            id={`plan-limit-${key}`}
            inputMode="numeric"
            value={limits[key]}
            onChange={(event) => onChange({ ...limits, [key]: event.target.value })}
            placeholder={t("form.unlimitedPlaceholder")}
          />
        </div>
      ))}
    </div>
  );
}

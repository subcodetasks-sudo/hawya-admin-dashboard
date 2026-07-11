"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PlanFormValues } from "@/features/plans/lib/plan-form-values";

type Props = {
  values: PlanFormValues;
  onChange: (patch: Partial<PlanFormValues>) => void;
};

export default function PlanSupportFields({ values, onChange }: Props) {
  const t = useTranslations("Plans");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="plan-crawling-enabled">{t("form.fields.crawlingEnabled")}</Label>
        <Switch
          id="plan-crawling-enabled"
          checked={values.crawlingEnabled}
          onCheckedChange={(crawlingEnabled) => onChange({ crawlingEnabled })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="plan-support-priority">{t("form.fields.supportPriority")}</Label>
        <Input
          id="plan-support-priority"
          value={values.supportPriority}
          onChange={(event) => onChange({ supportPriority: event.target.value })}
          placeholder={t("form.fields.supportPriorityPlaceholder")}
        />
      </div>
    </div>
  );
}

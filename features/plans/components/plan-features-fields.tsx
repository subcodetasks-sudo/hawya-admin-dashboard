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
import type { SupportPriority } from "@/features/plans/types";

const NULLABLE_LIMIT_FIELD_KEYS = ["requestsLimit", "apiTokenLimit", "maxWebsites"] as const;

const SUPPORT_PRIORITIES: SupportPriority[] = ["community", "email", "priority", "dedicated"];

type Props = {
  values: PlanFormValues;
  onChange: (patch: Partial<PlanFormValues>) => void;
};

export default function PlanFeaturesFields({ values, onChange }: Props) {
  const t = useTranslations("Plans");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="plan-displayName">{t("form.fields.displayName.label")}</Label>
        <Input
          id="plan-displayName"
          value={values.displayName}
          onChange={(event) => onChange({ displayName: event.target.value })}
          placeholder={t("form.fields.displayName.placeholder")}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="plan-crawling-enabled">{t("form.fields.crawlingEnabled")}</Label>
        <Switch
          id="plan-crawling-enabled"
          checked={values.crawlingEnabled}
          onCheckedChange={(crawlingEnabled) => onChange({ crawlingEnabled })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {NULLABLE_LIMIT_FIELD_KEYS.map((key) => (
          <div key={key} className="flex flex-col gap-1.5">
            <Label htmlFor={`plan-${key}`}>{t(`form.fields.${key}`)}</Label>
            <Input
              id={`plan-${key}`}
              inputMode="numeric"
              value={values[key]}
              onChange={(event) =>
                onChange({ [key]: event.target.value.replace(/[^0-9]/g, "") })
              }
              placeholder={t("form.fields.unlimitedPlaceholder")}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="plan-support-priority">{t("form.fields.supportPriority")}</Label>
        <Select
          value={values.supportPriority}
          onValueChange={(supportPriority) =>
            onChange({ supportPriority: supportPriority as SupportPriority })
          }
        >
          <SelectTrigger id="plan-support-priority" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUPPORT_PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {t(`form.supportPriorityOptions.${priority}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { PlanFeature } from "@/features/plans/types";

type Props = {
  features: PlanFeature[];
  onChange: (features: PlanFeature[]) => void;
};

export default function PlanFeatureToggleList({ features, onChange }: Props) {
  const t = useTranslations("Plans");

  function toggle(id: string, enabled: boolean) {
    onChange(features.map((feature) => (feature.id === id ? { ...feature, enabled } : feature)));
  }

  function updateLabel(id: string, customLabel: string) {
    onChange(
      features.map((feature) => (feature.id === id ? { ...feature, customLabel } : feature)),
    );
  }

  function remove(id: string) {
    onChange(features.filter((feature) => feature.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      {features.map((feature) => (
        <div key={feature.id} className="flex items-center justify-between gap-3">
          {feature.labelKey ? (
            <span className="text-sm">{t(`form.features.${feature.labelKey}`)}</span>
          ) : (
            <div className="flex flex-1 items-center gap-2">
              <Input
                value={feature.customLabel ?? ""}
                onChange={(event) => updateLabel(feature.id, event.target.value)}
                placeholder={t("form.customFeaturePlaceholder")}
                className="h-7"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={t("form.removeFeature")}
                onClick={() => remove(feature.id)}
              >
                <X />
              </Button>
            </div>
          )}
          <Switch
            checked={feature.enabled}
            onCheckedChange={(enabled) => toggle(feature.id, enabled)}
          />
        </div>
      ))}
    </div>
  );
}

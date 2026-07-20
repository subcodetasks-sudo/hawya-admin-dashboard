"use client";

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PlanFormValues } from "@/features/plans/lib/plan-form-values";

type Props = {
  values: PlanFormValues;
  onChange: (patch: Partial<PlanFormValues>) => void;
};

export default function PlanHighlightsFields({ values, onChange }: Props) {
  const t = useTranslations("Plans");
  const highlights = values.highlights;

  function updateHighlight(index: number, text: string) {
    onChange({ highlights: highlights.map((item, i) => (i === index ? text : item)) });
  }

  function removeHighlight(index: number) {
    onChange({ highlights: highlights.filter((_, i) => i !== index) });
  }

  function addHighlight() {
    onChange({ highlights: [...highlights, ""] });
  }

  function moveHighlight(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= highlights.length) return;

    const next = [...highlights];
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ highlights: next });
  }

  return (
    <div className="flex flex-col gap-3">
      <Label>{t("form.fields.highlights.label")}</Label>
      <div className="flex flex-col gap-2">
        {highlights.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t("form.fields.highlights.empty")}</p>
        ) : (
          highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <Input
                value={highlight}
                onChange={(event) => updateHighlight(index, event.target.value)}
                placeholder={t("form.fields.highlights.placeholder")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t("form.fields.highlights.moveUp")}
                disabled={index === 0}
                onClick={() => moveHighlight(index, -1)}
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t("form.fields.highlights.moveDown")}
                disabled={index === highlights.length - 1}
                onClick={() => moveHighlight(index, 1)}
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t("form.fields.highlights.remove")}
                onClick={() => removeHighlight(index)}
              >
                <X className="text-destructive" />
              </Button>
            </div>
          ))
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
        <Plus data-icon="inline-start" />
        {t("form.fields.highlights.add")}
      </Button>
    </div>
  );
}

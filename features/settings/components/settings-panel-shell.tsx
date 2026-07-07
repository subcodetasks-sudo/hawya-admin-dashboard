"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  onSave: () => void;
  onDiscard: () => void;
  isSaving?: boolean;
  isDirty?: boolean;
};

export default function SettingsPanelShell({
  children,
  onSave,
  onDiscard,
  isSaving = false,
}: Props) {
  const t = useTranslations("Settings");

  return (
    <div className="flex min-h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex flex-1 flex-col p-5 md:p-6">{children}</div>
      <div className="flex items-center justify-end gap-3 border-t border-border/70 px-5 py-4 md:px-6">
        <Button variant="outline" onClick={onDiscard} disabled={isSaving}>
          {t("discard")}
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
}

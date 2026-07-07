"use client";

import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import SettingsPanelShell from "@/features/settings/components/settings-panel-shell";

type Props = {
  icon: LucideIcon;
  title: string;
};

export default function SettingsComingSoon({ icon: Icon, title }: Props) {
  const t = useTranslations("Settings");

  function noop() {}

  return (
    <SettingsPanelShell onSave={noop} onDiscard={noop}>
      <Empty className="min-h-[200px] flex-1 p-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{t("comingSoon")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </SettingsPanelShell>
  );
}

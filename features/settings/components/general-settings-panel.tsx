"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import SettingsPanelShell from "@/features/settings/components/settings-panel-shell";
import SettingsToggleRow from "@/features/settings/components/settings-toggle-row";
import { useUpdateGeneralSettings } from "@/features/settings/hooks/use-settings-mutations";
import { generalSettingsQueryOptions } from "@/features/settings/services/settings";
import type {
  GeneralPreferenceKey,
  GeneralSettings,
} from "@/features/settings/types";

const CURRENCIES = ["USD", "SAR", "EUR"] as const;

const PREFERENCE_KEYS: GeneralPreferenceKey[] = [
  "enableRegistration",
  "requireEmailVerification",
  "allowFreeTrial",
  "maintenanceMode",
  "sendUsageSummaries",
];

export default function GeneralSettingsPanel() {
  const t = useTranslations("Settings");
  const { data, isLoading, isError } = useQuery(generalSettingsQueryOptions);
  const mutation = useUpdateGeneralSettings();

  const [synced, setSynced] = useState<GeneralSettings | null>(null);
  const [draft, setDraft] = useState<GeneralSettings | null>(null);

  if (data && data !== synced) {
    setSynced(data);
    setDraft(data);
  }

  if (isLoading) {
    return (
      <SettingsPanelShell>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </SettingsPanelShell>
    );
  }

  if (isError || !draft) {
    return (
      <SettingsPanelShell>
        <p className="py-6 text-center text-sm text-destructive">{t("general.loadError")}</p>
      </SettingsPanelShell>
    );
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(synced);

  function updateField<K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K],
  ) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function handleSave() {
    if (!draft) {
      return;
    }
    mutation.mutate(draft, {
      onSuccess: () => toast.success(t("savedToast")),
    });
  }

  function handleDiscard() {
    setDraft(synced);
  }

  return (
    <SettingsPanelShell
      onSave={handleSave}
      onDiscard={handleDiscard}
      isSaving={mutation.isPending}
      isDirty={isDirty}
    >
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">
          {t("general.sectionTitle")}
        </h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="platform-name">{t("general.platformName")}</Label>
          <Input
            id="platform-name"
            value={draft.platformName}
            onChange={(event) => updateField("platformName", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="support-email">{t("general.supportEmail")}</Label>
          <Input
            id="support-email"
            type="email"
            dir="ltr"
            className="text-start bg-input/10"
            value={draft.supportEmail}
            onChange={(event) => updateField("supportEmail", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="platform-url">{t("general.platformUrl")}</Label>
          <Input
            id="platform-url"
            type="url"
            dir="ltr"
            className="text-start"
            value={draft.platformUrl}
            onChange={(event) => updateField("platformUrl", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currency">{t("general.currency")}</Label>
          <Select
            value={draft.currency}
            onValueChange={(currency) => updateField("currency", currency)}
          >
            <SelectTrigger id="currency" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="mt-6 flex flex-col gap-1">
        <h2 className="mb-1 text-sm font-semibold text-foreground">
          {t("general.preferences")}
        </h2>
        <div className="flex flex-col divide-y divide-border/60">
          {PREFERENCE_KEYS.map((key) => (
            <SettingsToggleRow
              key={key}
              title={t(`general.prefs.${key}`)}
              checked={draft[key]}
              onCheckedChange={(checked) => updateField(key, checked)}
            />
          ))}
        </div>
      </section>
    </SettingsPanelShell>
  );
}

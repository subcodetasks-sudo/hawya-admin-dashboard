"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import SettingsPanelShell from "@/features/settings/components/settings-panel-shell";
import SettingsToggleRow from "@/features/settings/components/settings-toggle-row";
import { useUpdateSecuritySettings } from "@/features/settings/hooks/use-settings-mutations";
import { settingsQueryOptions } from "@/features/settings/services/settings";
import type {
  SecuritySettingKey,
  SecuritySettings,
} from "@/features/settings/types";

const SECURITY_KEYS: SecuritySettingKey[] = [
  "twoFactorAuth",
  "ipWhitelist",
  "auditLogging",
  "rateLimiting",
  "ddosProtection",
];

export default function SecuritySettingsPanel() {
  const t = useTranslations("Settings");
  const { data } = useQuery(settingsQueryOptions);
  const mutation = useUpdateSecuritySettings();

  const server = data?.security ?? null;
  const [synced, setSynced] = useState<SecuritySettings | null>(server);
  const [draft, setDraft] = useState<SecuritySettings | null>(server);

  if (server && server !== synced) {
    setSynced(server);
    setDraft(server);
  }

  if (!draft) {
    return null;
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(synced);

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
      <div className="flex flex-col divide-y divide-border/60">
        {SECURITY_KEYS.map((key) => (
          <SettingsToggleRow
            key={key}
            title={t(`security.${key}.title`)}
            description={t(`security.${key}.description`)}
            checked={draft[key]}
            onCheckedChange={(checked) =>
              setDraft((prev) => (prev ? { ...prev, [key]: checked } : prev))
            }
          />
        ))}
      </div>
    </SettingsPanelShell>
  );
}

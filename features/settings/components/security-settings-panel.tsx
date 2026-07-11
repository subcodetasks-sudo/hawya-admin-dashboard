"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import SettingsPanelShell from "@/features/settings/components/settings-panel-shell";
import SettingsToggleRow from "@/features/settings/components/settings-toggle-row";
import { useUpdateSecuritySettings } from "@/features/settings/hooks/use-settings-mutations";
import { securitySettingsQueryOptions } from "@/features/settings/services/settings";
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
  const { data, isLoading, isError } = useQuery(securitySettingsQueryOptions);
  const mutation = useUpdateSecuritySettings();

  const [synced, setSynced] = useState<SecuritySettings | null>(null);
  const [draft, setDraft] = useState<SecuritySettings | null>(null);

  if (data && data !== synced) {
    setSynced(data);
    setDraft(data);
  }

  if (isLoading) {
    return (
      <SettingsPanelShell>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </SettingsPanelShell>
    );
  }

  if (isError || !draft) {
    return (
      <SettingsPanelShell>
        <p className="py-6 text-center text-sm text-destructive">{t("security.loadError")}</p>
      </SettingsPanelShell>
    );
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

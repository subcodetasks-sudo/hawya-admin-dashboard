"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ApiKeyItem from "@/features/settings/components/api-key-item";
import SettingsPanelShell from "@/features/settings/components/settings-panel-shell";
import {
  useCreateApiKey,
  useDeleteApiKey,
  useRegenerateApiKey,
} from "@/features/settings/hooks/use-settings-mutations";
import { settingsQueryOptions } from "@/features/settings/services/settings";
import type { ApiKey } from "@/features/settings/types";

export default function ApiKeysPanel() {
  const t = useTranslations("Settings");
  const { data } = useQuery(settingsQueryOptions);
  const createKey = useCreateApiKey();
  const regenerateKey = useRegenerateApiKey();
  const deleteKey = useDeleteApiKey();

  const apiKeys = data?.apiKeys ?? [];
  const isBusy =
    createKey.isPending || regenerateKey.isPending || deleteKey.isPending;

  function noop() {}

  function handleCopy(apiKey: ApiKey) {
    navigator.clipboard?.writeText(apiKey.maskedKey).catch(() => undefined);
    toast.success(t("apiKeys.copiedToast"));
  }

  function handleRegenerate(apiKey: ApiKey) {
    regenerateKey.mutate(apiKey.id, {
      onSuccess: () => toast.success(t("apiKeys.regeneratedToast")),
    });
  }

  function handleDelete(apiKey: ApiKey) {
    deleteKey.mutate(apiKey.id, {
      onSuccess: () => toast.success(t("apiKeys.deletedToast")),
    });
  }

  function handleCreate() {
    createKey.mutate("development", {
      onSuccess: () => toast.success(t("apiKeys.createdToast")),
    });
  }

  return (
    <SettingsPanelShell onSave={noop} onDiscard={noop}>
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">
          {t("apiKeys.sectionTitle")}
        </h2>

        <div className="flex flex-col gap-3">
          {apiKeys.map((apiKey) => (
            <ApiKeyItem
              key={apiKey.id}
              apiKey={apiKey}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
              onDelete={handleDelete}
              disabled={isBusy}
            />
          ))}
        </div>

        <div className="flex justify-center pt-1">
          <Button onClick={handleCreate} disabled={isBusy}>
            <Plus data-icon="inline-start" />
            {t("apiKeys.createKey")}
          </Button>
        </div>
      </section>
    </SettingsPanelShell>
  );
}

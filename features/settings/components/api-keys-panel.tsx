"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import ApiKeyItem from "@/features/settings/components/api-key-item";
import ApiKeySecretDialog from "@/features/settings/components/api-key-secret-dialog";
import CreateApiKeyDialog from "@/features/settings/components/create-api-key-dialog";
import SettingsPanelShell from "@/features/settings/components/settings-panel-shell";
import {
  useDeleteApiKey,
  useRotateApiKey,
} from "@/features/settings/hooks/use-settings-mutations";
import { apiKeysQueryOptions } from "@/features/settings/services/settings";
import type { ApiKey, ApiKeyCreateResult } from "@/features/settings/types";

export default function ApiKeysPanel() {
  const t = useTranslations("Settings");
  const { data, isLoading, isError } = useQuery(apiKeysQueryOptions);
  const rotateKey = useRotateApiKey();
  const deleteKey = useDeleteApiKey();

  const [secretResult, setSecretResult] = useState<ApiKeyCreateResult | null>(null);

  const apiKeys = data ?? [];
  const isBusy = rotateKey.isPending || deleteKey.isPending;

  function handleRotate(apiKey: ApiKey) {
    rotateKey.mutate(apiKey.id, {
      onSuccess: (result) => {
        toast.success(t("apiKeys.rotatedToast"));
        setSecretResult(result);
      },
    });
  }

  function handleDelete(apiKey: ApiKey) {
    deleteKey.mutate(apiKey.id, {
      onSuccess: () => toast.success(t("apiKeys.deletedToast")),
    });
  }

  return (
    <SettingsPanelShell>
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-foreground">
            {t("apiKeys.sectionTitle")}
          </h2>
          <CreateApiKeyDialog
            disabled={isBusy}
            onCreated={(result) => {
              toast.success(t("apiKeys.createdToast"));
              setSecretResult(result);
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))
          ) : isError ? (
            <p className="py-6 text-center text-sm text-destructive">
              {t("apiKeys.loadError")}
            </p>
          ) : apiKeys.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t("apiKeys.empty")}
            </p>
          ) : (
            apiKeys.map((apiKey) => (
              <ApiKeyItem
                key={apiKey.id}
                apiKey={apiKey}
                onRotate={handleRotate}
                onDelete={handleDelete}
                disabled={isBusy}
              />
            ))
          )}
        </div>
      </section>

      <ApiKeySecretDialog result={secretResult} onClose={() => setSecretResult(null)} />
    </SettingsPanelShell>
  );
}

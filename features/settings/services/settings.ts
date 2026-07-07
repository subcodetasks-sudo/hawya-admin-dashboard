import { queryOptions } from "@tanstack/react-query";

import { settingsKeys } from "@/features/settings/query-keys";
import type {
  ApiKey,
  ApiKeyEnvironment,
  GeneralSettings,
  PlatformSettings,
  SecuritySettings,
} from "@/features/settings/types";

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

function randomKeyId() {
  return Math.random().toString(16).slice(2, 6);
}

let mockSettings: PlatformSettings = {
  general: {
    platformName: "Claude AI Platform",
    supportEmail: "support@claudeplatform.io",
    platformUrl: "https://claudeplatform.io",
    currency: "USD",
    enableRegistration: true,
    requireEmailVerification: true,
    allowFreeTrial: false,
    maintenanceMode: false,
    sendUsageSummaries: true,
  },
  security: {
    twoFactorAuth: true,
    ipWhitelist: false,
    auditLogging: true,
    rateLimiting: true,
    ddosProtection: true,
  },
  apiKeys: [
    {
      id: "key_prod",
      environment: "production",
      maskedKey: "sk-prod-••••••••4f2a",
      status: "active",
      createdAt: new Date(2024, 0, 15).toISOString(),
    },
    {
      id: "key_dev",
      environment: "development",
      maskedKey: "sk-dev-••••••••8b1c",
      status: "active",
      createdAt: new Date(2024, 2, 1).toISOString(),
    },
  ],
};

export async function fetchSettings(): Promise<PlatformSettings> {
  return delay({
    general: { ...mockSettings.general },
    security: { ...mockSettings.security },
    apiKeys: mockSettings.apiKeys.map((key) => ({ ...key })),
  });
}

export const settingsQueryOptions = queryOptions({
  queryKey: settingsKeys.detail(),
  queryFn: fetchSettings,
});

export async function updateGeneralSettings(
  input: GeneralSettings,
): Promise<GeneralSettings> {
  mockSettings = { ...mockSettings, general: { ...input } };
  return delay({ ...mockSettings.general });
}

export async function updateSecuritySettings(
  input: SecuritySettings,
): Promise<SecuritySettings> {
  mockSettings = { ...mockSettings, security: { ...input } };
  return delay({ ...mockSettings.security });
}

export async function createApiKey(
  environment: ApiKeyEnvironment,
): Promise<ApiKey> {
  const prefix = environment === "production" ? "sk-prod" : "sk-dev";
  const key: ApiKey = {
    id: `key_${Date.now()}`,
    environment,
    maskedKey: `${prefix}-••••••••${randomKeyId()}`,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  mockSettings = { ...mockSettings, apiKeys: [...mockSettings.apiKeys, key] };
  return delay(key);
}

export async function regenerateApiKey(id: string): Promise<ApiKey> {
  mockSettings = {
    ...mockSettings,
    apiKeys: mockSettings.apiKeys.map((key) => {
      if (key.id !== id) {
        return key;
      }
      const prefix = key.environment === "production" ? "sk-prod" : "sk-dev";
      return { ...key, maskedKey: `${prefix}-••••••••${randomKeyId()}` };
    }),
  };
  const updated = mockSettings.apiKeys.find((key) => key.id === id);

  if (!updated) {
    throw new Error(`API key not found: ${id}`);
  }

  return delay({ ...updated });
}

export async function deleteApiKey(id: string): Promise<void> {
  mockSettings = {
    ...mockSettings,
    apiKeys: mockSettings.apiKeys.filter((key) => key.id !== id),
  };
  return delay(undefined);
}

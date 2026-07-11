import { queryOptions } from "@tanstack/react-query";

import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api-client";
import { settingsKeys } from "@/features/settings/query-keys";
import type {
  ApiKey,
  ApiKeyCreateResult,
  AuditLogEntry,
  AuditLogListParams,
  AuditLogListResult,
  GeneralSettings,
  SecuritySettings,
} from "@/features/settings/types";

type GeneralSettingsResponse = {
  platform_name: string;
  support_email: string;
  platform_url: string;
  default_currency: string;
  user_registration_enabled: boolean;
  require_email_verification: boolean;
  allow_free_trial: boolean;
  maintenance_mode: boolean;
  send_usage_summaries: boolean;
};

function mapGeneralSettings(data: GeneralSettingsResponse): GeneralSettings {
  return {
    platformName: data.platform_name,
    supportEmail: data.support_email,
    platformUrl: data.platform_url,
    currency: data.default_currency,
    enableRegistration: data.user_registration_enabled,
    requireEmailVerification: data.require_email_verification,
    allowFreeTrial: data.allow_free_trial,
    maintenanceMode: data.maintenance_mode,
    sendUsageSummaries: data.send_usage_summaries,
  };
}

function buildGeneralSettingsBody(input: GeneralSettings): GeneralSettingsResponse {
  return {
    platform_name: input.platformName,
    support_email: input.supportEmail,
    platform_url: input.platformUrl,
    default_currency: input.currency,
    user_registration_enabled: input.enableRegistration,
    require_email_verification: input.requireEmailVerification,
    allow_free_trial: input.allowFreeTrial,
    maintenance_mode: input.maintenanceMode,
    send_usage_summaries: input.sendUsageSummaries,
  };
}

export async function fetchGeneralSettings(): Promise<GeneralSettings> {
  const data = await apiGet<GeneralSettingsResponse>("/admin/settings/general");
  return mapGeneralSettings(data);
}

export const generalSettingsQueryOptions = queryOptions({
  queryKey: settingsKeys.general(),
  queryFn: fetchGeneralSettings,
});

export async function updateGeneralSettings(input: GeneralSettings): Promise<GeneralSettings> {
  const data = await apiPut<GeneralSettingsResponse>(
    "/admin/settings/general",
    buildGeneralSettingsBody(input),
  );
  return mapGeneralSettings(data);
}

type SecuritySettingsResponse = {
  two_factor_required: boolean;
  ip_allowlist_enabled: boolean;
  audit_logging_enabled: boolean;
  rate_limiting_enabled: boolean;
  ddos_protection_enabled: boolean;
};

function mapSecuritySettings(data: SecuritySettingsResponse): SecuritySettings {
  return {
    twoFactorAuth: data.two_factor_required,
    ipWhitelist: data.ip_allowlist_enabled,
    auditLogging: data.audit_logging_enabled,
    rateLimiting: data.rate_limiting_enabled,
    ddosProtection: data.ddos_protection_enabled,
  };
}

function buildSecuritySettingsBody(input: SecuritySettings): SecuritySettingsResponse {
  return {
    two_factor_required: input.twoFactorAuth,
    ip_allowlist_enabled: input.ipWhitelist,
    audit_logging_enabled: input.auditLogging,
    rate_limiting_enabled: input.rateLimiting,
    ddos_protection_enabled: input.ddosProtection,
  };
}

export async function fetchSecuritySettings(): Promise<SecuritySettings> {
  const data = await apiGet<SecuritySettingsResponse>("/admin/settings/security");
  return mapSecuritySettings(data);
}

export const securitySettingsQueryOptions = queryOptions({
  queryKey: settingsKeys.security(),
  queryFn: fetchSecuritySettings,
});

export async function updateSecuritySettings(input: SecuritySettings): Promise<SecuritySettings> {
  const data = await apiPut<SecuritySettingsResponse>(
    "/admin/settings/security",
    buildSecuritySettingsBody(input),
  );
  return mapSecuritySettings(data);
}

type ApiKeyResponse = {
  id: string;
  name: string;
  masked: string;
  is_active: boolean;
  created_at: string;
  last_rotated_at: string | null;
};

function mapApiKey(data: ApiKeyResponse): ApiKey {
  return {
    id: data.id,
    name: data.name,
    masked: data.masked,
    isActive: data.is_active,
    createdAt: data.created_at,
    lastRotatedAt: data.last_rotated_at,
  };
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
  const data = await apiGet<ApiKeyResponse[]>("/admin/settings/api-keys");
  return data.map(mapApiKey);
}

export const apiKeysQueryOptions = queryOptions({
  queryKey: settingsKeys.apiKeys(),
  queryFn: fetchApiKeys,
});

type ApiKeyCreateResponse = { key: ApiKeyResponse; plaintext: string };

function mapApiKeyCreateResult(data: ApiKeyCreateResponse): ApiKeyCreateResult {
  return { key: mapApiKey(data.key), plaintext: data.plaintext };
}

export async function createApiKey(name: string): Promise<ApiKeyCreateResult> {
  const data = await apiPost<ApiKeyCreateResponse>("/admin/settings/api-keys", { name });
  return mapApiKeyCreateResult(data);
}

export async function rotateApiKey(id: string): Promise<ApiKeyCreateResult> {
  const data = await apiPost<ApiKeyCreateResponse>(`/admin/settings/api-keys/${id}/rotate`, {});
  return mapApiKeyCreateResult(data);
}

export async function deleteApiKey(id: string): Promise<void> {
  await apiDelete(`/admin/settings/api-keys/${id}`);
}

type AuditLogResponse = {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  detail: string | null;
  created_at: string;
};

type AuditLogListResponse = { logs: AuditLogResponse[]; total: number };

function mapAuditLogEntry(data: AuditLogResponse): AuditLogEntry {
  return {
    id: data.id,
    adminId: data.admin_id,
    action: data.action,
    targetType: data.target_type,
    targetId: data.target_id,
    detail: data.detail,
    createdAt: data.created_at,
  };
}

export async function fetchAuditLog(params: AuditLogListParams): Promise<AuditLogListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    per_page: String(params.perPage),
  });

  if (params.targetType) {
    query.set("target_type", params.targetType);
  }

  if (params.targetId) {
    query.set("target_id", params.targetId);
  }

  const data = await apiGet<AuditLogListResponse>(
    `/admin/settings/audit-log?${query.toString()}`,
  );

  return {
    logs: data.logs.map(mapAuditLogEntry),
    total: data.total,
    page: params.page,
    perPage: params.perPage,
  };
}

export function auditLogQueryOptions(params: AuditLogListParams) {
  return queryOptions({
    queryKey: settingsKeys.auditLog(params),
    queryFn: () => fetchAuditLog(params),
  });
}

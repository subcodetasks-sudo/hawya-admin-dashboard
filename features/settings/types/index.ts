export type SettingsTabId =
  | "general"
  // Hidden until /admin/settings/payment|email|roles APIs exist
  // | "payment"
  // | "email"
  | "apiKeys"
  | "security"
  | "auditLog";
  // | "roles";

export type GeneralSettings = {
  platformName: string;
  supportEmail: string;
  platformUrl: string;
  currency: string;
  enableRegistration: boolean;
  requireEmailVerification: boolean;
  allowFreeTrial: boolean;
  maintenanceMode: boolean;
  sendUsageSummaries: boolean;
};

export type GeneralPreferenceKey =
  | "enableRegistration"
  | "requireEmailVerification"
  | "allowFreeTrial"
  | "maintenanceMode"
  | "sendUsageSummaries";

export type SecuritySettings = {
  twoFactorAuth: boolean;
  ipWhitelist: boolean;
  auditLogging: boolean;
  rateLimiting: boolean;
  ddosProtection: boolean;
};

export type SecuritySettingKey = keyof SecuritySettings;

export type ApiKey = {
  id: string;
  name: string;
  masked: string;
  isActive: boolean;
  createdAt: string;
  lastRotatedAt: string | null;
};

export type ApiKeyCreateResult = {
  key: ApiKey;
  plaintext: string;
};

export type AuditLogEntry = {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  detail: string | null;
  createdAt: string;
};

export type AuditLogListParams = {
  page: number;
  perPage: number;
  targetType?: string;
  targetId?: string;
};

export type AuditLogListResult = {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  perPage: number;
};

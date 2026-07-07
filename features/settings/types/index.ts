export type SettingsTabId =
  | "general"
  | "payment"
  | "email"
  | "apiKeys"
  | "security"
  | "roles";

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

export type ApiKeyEnvironment = "production" | "development";

export type ApiKey = {
  id: string;
  environment: ApiKeyEnvironment;
  maskedKey: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type PlatformSettings = {
  general: GeneralSettings;
  security: SecuritySettings;
  apiKeys: ApiKey[];
};

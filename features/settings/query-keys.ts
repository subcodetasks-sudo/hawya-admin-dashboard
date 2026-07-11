import type { AuditLogListParams } from "@/features/settings/types";

export const settingsKeys = {
  all: ["settings"] as const,
  general: () => [...settingsKeys.all, "general"] as const,
  security: () => [...settingsKeys.all, "security"] as const,
  apiKeys: () => [...settingsKeys.all, "apiKeys"] as const,
  auditLogs: () => [...settingsKeys.all, "auditLog"] as const,
  auditLog: (params: AuditLogListParams) => [...settingsKeys.auditLogs(), params] as const,
};

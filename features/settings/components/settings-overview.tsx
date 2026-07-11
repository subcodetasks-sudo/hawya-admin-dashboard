"use client";

import { useState, type ReactNode } from "react";
import { CreditCard, Mail, UserCog } from "lucide-react";
import { useTranslations } from "next-intl";

import ApiKeysPanel from "@/features/settings/components/api-keys-panel";
import AuditLogPanel from "@/features/settings/components/audit-log-panel";
import GeneralSettingsPanel from "@/features/settings/components/general-settings-panel";
import SecuritySettingsPanel from "@/features/settings/components/security-settings-panel";
import SettingsComingSoon from "@/features/settings/components/settings-coming-soon";
import SettingsTabsNav from "@/features/settings/components/settings-tabs-nav";
import type { SettingsTabId } from "@/features/settings/types";

export default function SettingsOverview() {
  const t = useTranslations("Settings");
  const [activeTab, setActiveTab] = useState<SettingsTabId>("general");

  function renderPanel(tab: SettingsTabId): ReactNode {
    switch (tab) {
      case "general":
        return <GeneralSettingsPanel />;
      case "apiKeys":
        return <ApiKeysPanel />;
      case "security":
        return <SecuritySettingsPanel />;
      case "auditLog":
        return <AuditLogPanel />;
      case "payment":
        return <SettingsComingSoon icon={CreditCard} title={t("payment.title")} />;
      case "email":
        return <SettingsComingSoon icon={Mail} title={t("email.title")} />;
      case "roles":
        return <SettingsComingSoon icon={UserCog} title={t("roles.title")} />;
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-1 text-start">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <SettingsTabsNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="min-w-0 flex-1">{renderPanel(activeTab)}</div>
      </div>
    </div>
  );
}

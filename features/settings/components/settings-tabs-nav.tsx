"use client";

import {
  CreditCard,
  KeyRound,
  Mail,
  Settings,
  Shield,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { SettingsTabId } from "@/features/settings/types";

const TABS: { id: SettingsTabId; icon: LucideIcon }[] = [
  { id: "general", icon: Settings },
  { id: "payment", icon: CreditCard },
  { id: "email", icon: Mail },
  { id: "apiKeys", icon: KeyRound },
  { id: "security", icon: Shield },
  { id: "roles", icon: UserCog },
];

type Props = {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
};

export default function SettingsTabsNav({ activeTab, onTabChange }: Props) {
  const t = useTranslations("Settings");

  return (
    <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto pb-1 sm:w-52 sm:flex-col sm:overflow-visible sm:pb-0">
      {TABS.map(({ id, icon: Icon }) => {
        const isActive = id === activeTab;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{t(`tabs.${id}`)}</span>
          </button>
        );
      })}
    </nav>
  );
}

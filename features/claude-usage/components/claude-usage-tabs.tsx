"use client";

import { useTranslations } from "next-intl";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnthropicUsageTab from "@/features/claude-usage/components/anthropic-usage-tab";
import ClaudeUsageOverview from "@/features/claude-usage/components/claude-usage-overview";

export default function ClaudeUsageTabs() {
  const t = useTranslations("ClaudeUsage");

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
        <TabsTrigger value="anthropic">{t("tabs.anthropic")}</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="flex flex-col gap-4 md:gap-6 pt-4 md:pt-6">
        <ClaudeUsageOverview />
      </TabsContent>
      <TabsContent value="anthropic" className="flex flex-col gap-4 md:gap-6 pt-4 md:pt-6">
        <AnthropicUsageTab />
      </TabsContent>
    </Tabs>
  );
}

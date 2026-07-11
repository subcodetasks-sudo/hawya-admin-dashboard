import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations, setRequestLocale } from "next-intl/server";

import ClaudeUsageTabs from "@/features/claude-usage/components/claude-usage-tabs";
import {
  aiSettingsQueryOptions,
  requestsTrendQueryOptions,
  tokensTrendQueryOptions,
  topApiUsersQueryOptions,
  usageSummaryQueryOptions,
} from "@/features/claude-usage/services/claude-usage";
import {
  anthropicBalanceQueryOptions,
  anthropicUsageSummaryQueryOptions,
  anthropicWorkspacesQueryOptions,
} from "@/features/claude-usage/services/anthropic-usage";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ClaudeUsagePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ClaudeUsage");
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(usageSummaryQueryOptions),
    queryClient.prefetchQuery(tokensTrendQueryOptions),
    queryClient.prefetchQuery(requestsTrendQueryOptions),
    queryClient.prefetchQuery(topApiUsersQueryOptions),
    queryClient.prefetchQuery(aiSettingsQueryOptions),
    queryClient.prefetchQuery(anthropicUsageSummaryQueryOptions),
    queryClient.prefetchQuery(anthropicBalanceQueryOptions),
    queryClient.prefetchQuery(anthropicWorkspacesQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <ClaudeUsageTabs />
      </div>
    </HydrationBoundary>
  );
}

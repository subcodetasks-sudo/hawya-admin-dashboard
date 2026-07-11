import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations, setRequestLocale } from "next-intl/server";

import ClaudeUsageOverview from "@/features/claude-usage/components/claude-usage-overview";
import {
  aiSettingsQueryOptions,
  requestsTrendQueryOptions,
  tokensTrendQueryOptions,
  topApiUsersQueryOptions,
  usageSummaryQueryOptions,
} from "@/features/claude-usage/services/claude-usage";

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
        <ClaudeUsageOverview />
      </div>
    </HydrationBoundary>
  );
}

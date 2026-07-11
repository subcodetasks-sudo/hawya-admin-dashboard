import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import SettingsOverview from "@/features/settings/components/settings-overview";
import {
  apiKeysQueryOptions,
  generalSettingsQueryOptions,
  securitySettingsQueryOptions,
} from "@/features/settings/services/settings";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(generalSettingsQueryOptions),
    queryClient.prefetchQuery(securitySettingsQueryOptions),
    queryClient.prefetchQuery(apiKeysQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsOverview />
    </HydrationBoundary>
  );
}

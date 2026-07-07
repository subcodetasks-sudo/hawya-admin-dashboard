import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import SettingsOverview from "@/features/settings/components/settings-overview";
import { settingsQueryOptions } from "@/features/settings/services/settings";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(settingsQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsOverview />
    </HydrationBoundary>
  );
}

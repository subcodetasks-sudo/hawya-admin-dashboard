import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import PlansOverview from "@/features/plans/components/plans-overview";
import { plansListQueryOptions } from "@/features/plans/services/plans";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PlansPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(plansListQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlansOverview />
    </HydrationBoundary>
  );
}

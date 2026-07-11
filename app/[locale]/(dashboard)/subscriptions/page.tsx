import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import SubscriptionsOverview from "@/features/subscriptions/components/subscriptions-overview";
import { subscriptionsListQueryOptions } from "@/features/subscriptions/services/subscriptions";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SubscriptionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    subscriptionsListQueryOptions({ page: 1, perPage: 10, status: "active" }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubscriptionsOverview />
    </HydrationBoundary>
  );
}

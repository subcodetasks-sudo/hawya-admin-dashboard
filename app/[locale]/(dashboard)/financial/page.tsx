import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import FinancialOverview from "@/features/financial/components/financial-overview";
import {
  financialSummaryQueryOptions,
  paymentsListQueryOptions,
  revenueByPlanQueryOptions,
  revenueTrendQueryOptions,
} from "@/features/financial/services/financial";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FinancialPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(financialSummaryQueryOptions),
    queryClient.prefetchQuery(revenueByPlanQueryOptions),
    queryClient.prefetchQuery(revenueTrendQueryOptions(12)),
    queryClient.prefetchQuery(paymentsListQueryOptions({ page: 1, perPage: 10 })),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FinancialOverview />
    </HydrationBoundary>
  );
}

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations, setRequestLocale } from "next-intl/server";

import DashboardOverview from "@/features/dashboard/components/dashboard-overview";
import {
  dashboardStatsQueryOptions,
  platformStatsQueryOptions,
  recentPaymentsQueryOptions,
  revenueTrendQueryOptions,
  subscribersByPlanQueryOptions,
  usageTrendQueryOptions,
} from "@/features/dashboard/services/dashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardHomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Dashboard");
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(dashboardStatsQueryOptions),
    queryClient.prefetchQuery(platformStatsQueryOptions),
    queryClient.prefetchQuery(revenueTrendQueryOptions),
    queryClient.prefetchQuery(usageTrendQueryOptions),
    queryClient.prefetchQuery(subscribersByPlanQueryOptions),
    queryClient.prefetchQuery(recentPaymentsQueryOptions),
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
        <DashboardOverview />
      </div>
    </HydrationBoundary>
  );
}

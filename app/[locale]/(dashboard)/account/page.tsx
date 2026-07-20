import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import AccountOverview from "@/features/account/components/account-overview";
import { adminMeQueryOptions } from "@/features/account/services/account";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(adminMeQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountOverview />
    </HydrationBoundary>
  );
}

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import UsersOverview from "@/features/users/components/users-overview";
import { planOptionsQueryOptions, usersListQueryOptions } from "@/features/users/services/users";

type Props = {
  params: Promise<{ locale: string }>;
};

const INITIAL_PARAMS = { page: 1, perPage: 10 };

export default async function UsersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(usersListQueryOptions(INITIAL_PARAMS)),
    queryClient.prefetchQuery(planOptionsQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersOverview />
    </HydrationBoundary>
  );
}

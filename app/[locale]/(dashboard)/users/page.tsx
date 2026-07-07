import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import UsersOverview from "@/features/users/components/users-overview";
import { usersListQueryOptions } from "@/features/users/services/users";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function UsersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(usersListQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersOverview />
    </HydrationBoundary>
  );
}

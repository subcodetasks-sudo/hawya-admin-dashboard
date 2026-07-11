import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { setRequestLocale } from "next-intl/server";

import TestimonialsOverview from "@/features/testimonials/components/testimonials-overview";
import { testimonialsListQueryOptions } from "@/features/testimonials/services/testimonials";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TestimonialsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(testimonialsListQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TestimonialsOverview />
    </HydrationBoundary>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { PostsList } from "@/features/home/src/components/posts-list";
import { postsQueryOptions } from "@/features/home/src/queries/posts";
import { UploadDialog } from "@/features/uploads/components/upload-dialog";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(postsQueryOptions);

  return <h1>{t("title")}</h1>;
}

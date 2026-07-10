import { setRequestLocale } from "next-intl/server";

import LoginPage from "@/features/auth/components/login-page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4">
      <LoginPage />
    </div>
  );
}

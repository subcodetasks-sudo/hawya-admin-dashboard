"use client";

import { useTranslations } from "next-intl";

import AccountProfileCard from "@/features/account/components/account-profile-card";
import ChangeEmailForm from "@/features/account/components/change-email-form";
import ChangePasswordForm from "@/features/account/components/change-password-form";

export default function AccountOverview() {
  const t = useTranslations("Account");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-1 text-start">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <AccountProfileCard />
      <ChangePasswordForm />
      <ChangeEmailForm />
    </div>
  );
}

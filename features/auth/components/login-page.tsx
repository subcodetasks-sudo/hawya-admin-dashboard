"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import LoginForm from "./login-form";
import LoginHeroPanel from "./login-hero-panel";
import OtpForm from "./otp-form";

interface OtpStep {
  email: string;
  remember: boolean;
}

export default function LoginPage() {
  const t = useTranslations("Auth");
  const [otpStep, setOtpStep] = useState<OtpStep | null>(null);

  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-2xl lg:grid-cols-2">

      <div className="flex flex-col justify-center p-8 sm:p-12">
        {otpStep ? (
          <OtpForm
            email={otpStep.email}
            remember={otpStep.remember}
            onBack={() => setOtpStep(null)}
          />
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-2">
              <h2 className="text-3xl font-bold">{t("title")}</h2>
              <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>
            <LoginForm
              onOtpRequired={(email, remember) => setOtpStep({ email, remember })}
            />
          </>
        )}
      </div>

      <LoginHeroPanel />
    </div>
  );
}

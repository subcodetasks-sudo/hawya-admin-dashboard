"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";

import { useVerifyOtp } from "../hooks/use-verify-otp";
import { LoginError } from "../services/auth-service";

type AuthTranslator = ReturnType<typeof useTranslations<"Auth">>;

const OTP_SLOT_CLASS =
  "size-12 rounded-xl border text-lg font-semibold shadow-sm";

function buildOtpSchema(t: AuthTranslator) {
  return z.object({
    otp: z.string().length(6, t("otp.errors.otpInvalid")),
  });
}

type OtpFormValues = z.infer<ReturnType<typeof buildOtpSchema>>;

interface OtpFormProps {
  email: string;
  remember: boolean;
  onBack: () => void;
}

export default function OtpForm({ email, remember, onBack }: OtpFormProps) {
  const t = useTranslations("Auth");
  const verifyOtp = useVerifyOtp();
  const schema = buildOtpSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { otp: "" },
  });

  function onSubmit(values: OtpFormValues) {
    verifyOtp.reset();
    verifyOtp.mutate({ email, otp: values.otp, remember });
  }

  const serverErrorMessage =
    verifyOtp.error instanceof LoginError
      ? verifyOtp.error.message
      : verifyOtp.isError
        ? t("errors.generic")
        : null;

  return (
    <div className="flex flex-col gap-6" dir="ltr">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("otp.back")}
      </button>

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-7" />
        </span>
        <h2 className="text-2xl font-bold">{t("otp.title")}</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          {t("otp.instructionsPrefix")}{" "}
          <span dir="ltr" className="font-semibold text-foreground">
            {email}
          </span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col items-center gap-5"
      >
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              aria-invalid={Boolean(errors.otp)}
              dir="ltr"
              containerClassName="justify-center"
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className={OTP_SLOT_CLASS} />
                <InputOTPSlot index={1} className={OTP_SLOT_CLASS} />
                <InputOTPSlot index={2} className={OTP_SLOT_CLASS} />
                <InputOTPSlot index={3} className={OTP_SLOT_CLASS} />
                <InputOTPSlot index={4} className={OTP_SLOT_CLASS} />
                <InputOTPSlot index={5} className={OTP_SLOT_CLASS} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {errors.otp ? (
          <p className="text-sm text-destructive">{errors.otp.message}</p>
        ) : null}

        {serverErrorMessage ? (
          <p className="w-full rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            {serverErrorMessage}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={verifyOtp.isPending}
          className="h-12 w-full gap-2 rounded-full text-base"
        >
          {verifyOtp.isPending ? t("otp.submitting") : t("otp.submit")}
          {verifyOtp.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <ArrowLeft className="size-4 rtl:rotate-180" />
          )}
        </Button>
      </form>
    </div>
  );
}

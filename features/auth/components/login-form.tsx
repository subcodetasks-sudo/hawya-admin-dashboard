"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import { useLogin } from "../hooks/use-login";
import { LoginError } from "../services/auth-service";

type AuthTranslator = ReturnType<typeof useTranslations<"Auth">>;

function buildLoginSchema(t: AuthTranslator) {
  return z.object({
    email: z
      .string()
      .min(1, t("errors.emailRequired"))
      .email(t("errors.emailInvalid")),
    password: z.string().min(1, t("errors.passwordRequired")),
    remember: z.boolean(),
  });
}

type LoginFormValues = z.infer<ReturnType<typeof buildLoginSchema>>;

interface LoginFormProps {
  onOtpRequired: (email: string, remember: boolean) => void;
}

export default function LoginForm({ onOtpRequired }: LoginFormProps) {
  const t = useTranslations("Auth");
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const schema = buildLoginSchema(t);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  function onSubmit(values: LoginFormValues) {
    login.reset();
    login.mutate(values);
  }

  useEffect(() => {
    if (login.data?.otp_required) {
      onOtpRequired(login.data.email, getValues("remember"));
    }
  }, [login.data, onOtpRequired, getValues]);

  const serverErrorMessage =
    login.error instanceof LoginError
      ? login.error.message
      : login.isError
        ? t("errors.generic")
        : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          // dir="ltr"
          className="text-start"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t("passwordLabel")}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            className="text-start pe-10"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      {serverErrorMessage ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverErrorMessage}
        </p>
      ) : null}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Checkbox
                id="remember"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
          <Label htmlFor="remember" className="font-normal text-muted-foreground">
            {t("rememberMe")}
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={login.isPending}
        className="h-12 w-full gap-2 rounded-full text-base"
      >
        {login.isPending ? t("submitting") : t("submit")}
        {login.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <ArrowLeft className="size-4 rtl:rotate-180" />
        )}
      </Button>
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangeAdminPassword } from "@/features/account/hooks/use-account-mutations";
import { ApiError } from "@/lib/api-client";

type AccountTranslator = ReturnType<typeof useTranslations<"Account.password">>;

function buildChangePasswordSchema(t: AccountTranslator) {
  return z
    .object({
      current_password: z.string().min(1, t("errors.currentRequired")),
      new_password: z
        .string()
        .min(8, t("errors.newMinLength"))
        .regex(/\d/, t("errors.newRequiresDigit")),
      confirm_password: z.string().min(1, t("errors.confirmRequired")),
    })
    .refine((values) => values.new_password === values.confirm_password, {
      message: t("errors.confirmMismatch"),
      path: ["confirm_password"],
    })
    .refine((values) => values.new_password !== values.current_password, {
      message: t("errors.sameAsCurrent"),
      path: ["new_password"],
    });
}

type ChangePasswordFormValues = z.infer<ReturnType<typeof buildChangePasswordSchema>>;

const ERROR_CODE_KEYS: Record<string, string> = {
  wrong_current_password: "errors.wrongCurrentPassword",
  password_unchanged: "errors.passwordUnchanged",
};

type PasswordFieldProps = {
  id: string;
  label: string;
  autoComplete: string;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm<ChangePasswordFormValues>>["register"]>;
  showLabel: string;
  hideLabel: string;
};

function PasswordField({
  id,
  label,
  autoComplete,
  error,
  registration,
  showLabel,
  hideLabel,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          dir="ltr"
          className="text-start pe-10"
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? hideLabel : showLabel}
          className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export default function ChangePasswordForm() {
  const t = useTranslations("Account.password");
  const schema = buildChangePasswordSchema(t);
  const mutation = useChangeAdminPassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  function onSubmit(values: ChangePasswordFormValues) {
    mutation.mutate(
      { current_password: values.current_password, new_password: values.new_password },
      {
        onSuccess: () => {
          reset();
          toast.success(t("success"));
        },
        onError: (error) => {
          const code = error instanceof ApiError ? error.code : undefined;
          const key = code ? ERROR_CODE_KEYS[code] : undefined;

          if (key === "errors.wrongCurrentPassword") {
            setError("current_password", { message: t(key) });
            return;
          }

          const message = key ? t(key) : error instanceof ApiError ? error.message : t("errors.generic");
          toast.error(message);
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold">{t("sectionTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <PasswordField
            id="current-password"
            label={t("currentPassword")}
            autoComplete="current-password"
            error={errors.current_password?.message}
            registration={register("current_password")}
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
          />
          <PasswordField
            id="new-password"
            label={t("newPassword")}
            autoComplete="new-password"
            error={errors.new_password?.message}
            registration={register("new_password")}
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
          />
          <PasswordField
            id="confirm-password"
            label={t("confirmPassword")}
            autoComplete="new-password"
            error={errors.confirm_password?.message}
            registration={register("confirm_password")}
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t("submitting") : t("submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

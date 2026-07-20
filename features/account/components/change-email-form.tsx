"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { accountKeys } from "@/features/account/query-keys";
import { useChangeAdminEmail } from "@/features/account/hooks/use-account-mutations";
import { ApiError } from "@/lib/api-client";

type AccountTranslator = ReturnType<typeof useTranslations<"Account.email">>;

function buildChangeEmailSchema(t: AccountTranslator) {
  return z.object({
    new_email: z.string().min(1, t("errors.emailRequired")).email(t("errors.emailInvalid")),
    current_password: z.string().min(1, t("errors.currentPasswordRequired")),
  });
}

type ChangeEmailFormValues = z.infer<ReturnType<typeof buildChangeEmailSchema>>;

const ERROR_CODE_KEYS: Record<string, string> = {
  wrong_current_password: "errors.wrongCurrentPassword",
  email_unchanged: "errors.emailUnchanged",
  email_taken: "errors.emailTaken",
};

export default function ChangeEmailForm() {
  const t = useTranslations("Account.email");
  const schema = buildChangeEmailSchema(t);
  const queryClient = useQueryClient();
  const mutation = useChangeAdminEmail();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { new_email: "", current_password: "" },
  });

  function onSubmit(values: ChangeEmailFormValues) {
    mutation.mutate(values, {
      onSuccess: (data) => {
        reset();
        queryClient.setQueryData(accountKeys.me(), (previous: unknown) =>
          previous && typeof previous === "object" ? { ...previous, email: data.email } : previous,
        );
        toast.success(t("success"));
      },
      onError: (error) => {
        const code = error instanceof ApiError ? error.code : undefined;
        const key = code ? ERROR_CODE_KEYS[code] : undefined;

        if (key === "errors.wrongCurrentPassword") {
          setError("current_password", { message: t(key) });
          return;
        }
        if (key === "errors.emailUnchanged" || key === "errors.emailTaken") {
          setError("new_email", { message: t(key) });
          return;
        }

        const message = error instanceof ApiError ? error.message : t("errors.generic");
        toast.error(message);
      },
    });
  }

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold">{t("sectionTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-email">{t("newEmail")}</Label>
            <Input
              id="new-email"
              type="email"
              dir="ltr"
              className="text-start"
              autoComplete="email"
              aria-invalid={Boolean(errors.new_email)}
              {...register("new_email")}
            />
            {errors.new_email ? (
              <p className="text-sm text-destructive">{errors.new_email.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email-current-password">{t("currentPassword")}</Label>
            <div className="relative">
              <Input
                id="email-current-password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                className="text-start pe-10"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.current_password)}
                {...register("current_password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.current_password ? (
              <p className="text-sm text-destructive">{errors.current_password.message}</p>
            ) : null}
          </div>

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

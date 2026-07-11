"use client";

import { useMutation } from "@tanstack/react-query";

import { useRouter } from "@/i18n/navigation";

import { verifyOtp, type VerifyOtpRequest } from "../services/auth-service";
import { setSession } from "../services/session";

export interface VerifyOtpValues extends VerifyOtpRequest {
  remember: boolean;
}

export function useVerifyOtp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: VerifyOtpValues) =>
      verifyOtp({ email: values.email, otp: values.otp }),
    onSuccess: (data, variables) => {
      if (!data.access_token || !data.admin_id || !data.role) {
        return;
      }

      setSession(
        data.access_token,
        { adminId: data.admin_id, email: data.email, role: data.role },
        variables.remember,
      );
      router.replace("/home");
      router.refresh();
    },
  });
}

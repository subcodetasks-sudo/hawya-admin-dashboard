"use client";

import { useMutation } from "@tanstack/react-query";

import { useRouter } from "@/i18n/navigation";

import { loginAdmin, type LoginRequest } from "../services/auth-service";
import { setSession } from "../services/session";

export interface LoginFormValues extends LoginRequest {
  remember: boolean;
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: LoginFormValues) =>
      loginAdmin({ email: values.email, password: values.password }),
    onSuccess: (data, variables) => {
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

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSessionToken } from "@/features/auth/services/session";
import { accountKeys } from "@/features/account/query-keys";
import {
  changeAdminEmail,
  changeAdminPassword,
} from "@/features/account/services/account";

export function useChangeAdminPassword() {
  return useMutation({
    mutationFn: changeAdminPassword,
  });
}

export function useChangeAdminEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeAdminEmail,
    onSuccess: (data) => {
      updateSessionToken(data.access_token, { email: data.email });
      queryClient.invalidateQueries({ queryKey: accountKeys.me() });
    },
  });
}

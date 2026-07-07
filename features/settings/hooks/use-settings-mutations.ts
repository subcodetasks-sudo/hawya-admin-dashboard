"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { settingsKeys } from "@/features/settings/query-keys";
import {
  createApiKey,
  deleteApiKey,
  regenerateApiKey,
  updateGeneralSettings,
  updateSecuritySettings,
} from "@/features/settings/services/settings";

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGeneralSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.detail() }),
  });
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSecuritySettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.detail() }),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.detail() }),
  });
}

export function useRegenerateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateApiKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.detail() }),
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.detail() }),
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { claudeUsageKeys } from "@/features/claude-usage/query-keys";
import { updateAiSettings } from "@/features/claude-usage/services/claude-usage";

export function useUpdateAiSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAiSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: claudeUsageKeys.aiSettings() }),
  });
}

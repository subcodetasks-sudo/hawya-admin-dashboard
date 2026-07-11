"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { anthropicUsageKeys } from "@/features/claude-usage/query-keys";
import { updateAnthropicBalance } from "@/features/claude-usage/services/anthropic-usage";

export function useUpdateAnthropicBalance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAnthropicBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: anthropicUsageKeys.balance() });
      queryClient.invalidateQueries({ queryKey: anthropicUsageKeys.summary() });
    },
  });
}

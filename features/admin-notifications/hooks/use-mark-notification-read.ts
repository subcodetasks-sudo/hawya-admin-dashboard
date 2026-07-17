"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminNotificationKeys } from "@/features/admin-notifications/query-keys";
import { markNotificationRead } from "@/features/admin-notifications/services/admin-notifications";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminNotificationKeys.lists() }),
  });
}

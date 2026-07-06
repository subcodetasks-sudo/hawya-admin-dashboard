"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { planKeys } from "@/features/plans/query-keys";
import {
  createPlan,
  deletePlan,
  duplicatePlan,
  updatePlan,
} from "@/features/plans/services/plans";
import type { PlanInput } from "@/features/plans/types";

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planKeys.lists() }),
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PlanInput }) => updatePlan(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planKeys.lists() }),
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planKeys.lists() }),
  });
}

export function useDuplicatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicatePlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: planKeys.lists() }),
  });
}

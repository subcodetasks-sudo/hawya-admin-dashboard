"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { subscriptionKeys } from "@/features/subscriptions/query-keys";
import {
  addSubscriptionNote,
  cancelSubscription,
  changeSubscriptionPlan,
  createSubscription,
  grantSubscriptionDays,
  renewSubscription,
  suspendSubscription,
} from "@/features/subscriptions/services/subscriptions";
import type { ChangeSubscriptionPlanInput, CreateSubscriptionInput } from "@/features/subscriptions/types";

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) => createSubscription(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() }),
  });
}

export function useSuspendSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suspendSubscription(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}

export function useRenewSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => renewSubscription(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelSubscription(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}

export function useGrantSubscriptionDays() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) => grantSubscriptionDays(id, days),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}

export function useChangeSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ChangeSubscriptionPlanInput }) =>
      changeSubscriptionPlan(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}

export function useAddSubscriptionNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => addSubscriptionNote(id, note),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
}

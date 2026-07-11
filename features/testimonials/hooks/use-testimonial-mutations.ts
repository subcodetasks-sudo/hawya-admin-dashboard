"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { testimonialKeys } from "@/features/testimonials/query-keys";
import {
  approveTestimonial,
  deleteTestimonial,
  rejectTestimonial,
} from "@/features/testimonials/services/testimonials";

export function useApproveTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveTestimonial,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testimonialKeys.all }),
  });
}

export function useRejectTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectTestimonial,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testimonialKeys.all }),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testimonialKeys.all }),
  });
}

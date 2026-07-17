"use client";

import { useMutation } from "@tanstack/react-query";

import { fetchInvoiceDownloadUrl } from "@/features/financial/services/financial";

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: fetchInvoiceDownloadUrl,
  });
}

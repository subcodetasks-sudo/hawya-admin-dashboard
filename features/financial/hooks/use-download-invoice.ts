"use client";

import { useMutation } from "@tanstack/react-query";

import { downloadInvoicePdf } from "@/features/financial/services/financial";

type DownloadInvoiceInput = {
  id: string;
  filename: string;
};

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: ({ id, filename }: DownloadInvoiceInput) => downloadInvoicePdf(id, filename),
  });
}

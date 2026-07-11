"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ApiKeyCreateResult } from "@/features/settings/types";

type Props = {
  result: ApiKeyCreateResult | null;
  onClose: () => void;
};

export default function ApiKeySecretDialog({ result, onClose }: Props) {
  const t = useTranslations("Settings");

  function handleCopy() {
    if (!result) {
      return;
    }
    navigator.clipboard?.writeText(result.plaintext).catch(() => undefined);
    toast.success(t("apiKeys.copiedToast"));
  }

  return (
    <Dialog open={Boolean(result)} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("apiKeys.secretDialog.title")}</DialogTitle>
          <DialogDescription>{t("apiKeys.secretDialog.description")}</DialogDescription>
        </DialogHeader>
        <p
          dir="ltr"
          className="text-start select-all rounded-md bg-muted px-3 py-2 font-mono text-sm break-all"
        >
          {result?.plaintext}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={handleCopy}>
            {t("apiKeys.actions.copy")}
          </Button>
          <Button onClick={onClose}>{t("apiKeys.secretDialog.close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

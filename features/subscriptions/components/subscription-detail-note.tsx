"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddSubscriptionNote } from "@/features/subscriptions/hooks/use-subscription-mutations";
import type { Subscription } from "@/features/subscriptions/types";

type Props = {
  subscription: Subscription;
};

export default function SubscriptionDetailNote({ subscription }: Props) {
  const t = useTranslations("Subscriptions");
  const addNote = useAddSubscriptionNote();
  const [note, setNote] = useState(subscription.adminNote ?? "");

  function handleSave() {
    addNote.mutate(
      { id: subscription.id, note: note.trim() },
      {
        onSuccess: () => toast.success(t("toasts.noteSaved")),
        onError: () => toast.error(t("toasts.error")),
      },
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="subscription-note">{t("detail.note.title")}</Label>
      <Textarea
        id="subscription-note"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={t("detail.note.placeholder")}
        className="min-h-20"
      />
      <Button
        onClick={handleSave}
        disabled={addNote.isPending || note.trim() === (subscription.adminNote ?? "")}
      >
        {t("detail.note.save")}
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddUserNote } from "@/features/users/hooks/use-user-mutations";
import type { UserNote } from "@/features/users/types";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { toLocaleDigits } from "@/lib/format";

type Props = {
  userId: string;
  notes: UserNote[];
};

export default function UserDetailNotes({ userId, notes }: Props) {
  const t = useTranslations("Users");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const addNote = useAddUserNote();
  const [note, setNote] = useState("");

  function formatDate(value: string) {
    return toLocaleDigits(
      format(new Date(value), "d MMM yyyy, HH:mm", { locale: dateLocale }),
      locale,
    );
  }

  function handleAdd() {
    const trimmed = note.trim();
    if (!trimmed) {
      return;
    }

    addNote.mutate(
      { id: userId, note: trimmed },
      {
        onSuccess: () => {
          toast.success(t("toasts.noteAdded"));
          setNote("");
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{t("detail.notes.title")}</Label>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("detail.notes.empty")}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {notes.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <p className="text-sm">{item.note}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      <Textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={t("detail.notes.placeholder")}
        className="min-h-20"
      />
      <Button onClick={handleAdd} disabled={addNote.isPending || !note.trim()}>
        {t("detail.notes.add")}
      </Button>
    </div>
  );
}

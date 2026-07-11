"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateApiKey } from "@/features/settings/hooks/use-settings-mutations";
import type { ApiKeyCreateResult } from "@/features/settings/types";

type Props = {
  onCreated: (result: ApiKeyCreateResult) => void;
  disabled?: boolean;
};

export default function CreateApiKeyDialog({ onCreated, disabled = false }: Props) {
  const t = useTranslations("Settings");
  const createKey = useCreateApiKey();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setName("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    createKey.mutate(trimmedName, {
      onSuccess: (result) => {
        handleOpenChange(false);
        onCreated(result);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Plus data-icon="inline-start" />
          {t("apiKeys.createKey")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>{t("apiKeys.createDialog.title")}</DialogTitle>
            <DialogDescription>{t("apiKeys.createDialog.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="api-key-name">{t("apiKeys.createDialog.nameLabel")}</Label>
            <Input
              id="api-key-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("apiKeys.createDialog.namePlaceholder")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("apiKeys.createDialog.cancel")}
            </Button>
            <Button type="submit" disabled={createKey.isPending || !name.trim()}>
              {t("apiKeys.createDialog.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

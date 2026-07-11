"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBanUser } from "@/features/users/hooks/use-user-mutations";
import type { BanType } from "@/features/users/types";

type Props = {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function BanUserDialog({ userId, userName, open, onOpenChange }: Props) {
  const t = useTranslations("Users");
  const banUser = useBanUser();
  const [banType, setBanType] = useState<BanType>("temporary");
  const [until, setUntil] = useState("");

  function handleConfirm() {
    banUser.mutate(
      {
        id: userId,
        input: {
          banType,
          until: banType === "temporary" && until ? new Date(until).toISOString() : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("toasts.banned"));
          setUntil("");
        },
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("detail.banDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("detail.banDialog.description", { name: userName })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>{t("detail.banDialog.typeLabel")}</Label>
            <RadioGroup value={banType} onValueChange={(value) => setBanType(value as BanType)}>
              <div className="flex items-center gap-2 py-1">
                <RadioGroupItem value="temporary" id="ban-type-temporary" />
                <Label htmlFor="ban-type-temporary" className="font-normal">
                  {t("detail.banDialog.temporary")}
                </Label>
              </div>
              <div className="flex items-center gap-2 py-1">
                <RadioGroupItem value="permanent" id="ban-type-permanent" />
                <Label htmlFor="ban-type-permanent" className="font-normal">
                  {t("detail.banDialog.permanent")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {banType === "temporary" ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ban-until">{t("detail.banDialog.untilLabel")}</Label>
              <Input
                id="ban-until"
                type="datetime-local"
                required
                value={until}
                onChange={(event) => setUntil(event.target.value)}
              />
            </div>
          ) : null}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>{t("detail.banDialog.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={banUser.isPending || (banType === "temporary" && !until)}
            onClick={handleConfirm}
          >
            {t("detail.banDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

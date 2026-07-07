"use client";

import { useState, type FormEvent, type ReactNode } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInviteUser } from "@/features/users/hooks/use-user-mutations";
import type { UserPlanKey } from "@/features/users/types";

const PLAN_OPTIONS: UserPlanKey[] = ["starter", "pro", "business", "enterprise"];

type Props = {
  trigger: ReactNode;
};

export default function InviteUserDialog({ trigger }: Props) {
  const t = useTranslations("Users");
  const tDashboard = useTranslations("Dashboard");
  const inviteUser = useInviteUser();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [planKey, setPlanKey] = useState<UserPlanKey>("starter");

  function resetForm() {
    setName("");
    setEmail("");
    setPlanKey("starter");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    inviteUser.mutate(
      { name, email, planKey },
      {
        onSuccess: () => {
          toast.success(t("toasts.invited"));
          handleOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>{t("invite.title")}</DialogTitle>
            <DialogDescription>{t("invite.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-user-name">{t("invite.nameLabel")}</Label>
            <Input
              id="invite-user-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("invite.namePlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-user-email">{t("invite.emailLabel")}</Label>
            <Input
              id="invite-user-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("invite.emailPlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-user-plan">{t("invite.planLabel")}</Label>
            <Select value={planKey} onValueChange={(value) => setPlanKey(value as UserPlanKey)}>
              <SelectTrigger id="invite-user-plan" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_OPTIONS.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {tDashboard(`plans.${plan}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("invite.cancel")}
            </Button>
            <Button type="submit" disabled={inviteUser.isPending}>
              {t("invite.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

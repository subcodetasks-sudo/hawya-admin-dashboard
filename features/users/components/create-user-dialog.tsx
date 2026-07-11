"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCreateUser } from "@/features/users/hooks/use-user-mutations";
import { planOptionsQueryOptions } from "@/features/users/services/users";

type Props = {
  trigger: ReactNode;
};

export default function CreateUserDialog({ trigger }: Props) {
  const t = useTranslations("Users");
  const createUser = useCreateUser();
  const { data: plans, isLoading: plansLoading } = useQuery(planOptionsQueryOptions);

  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [planId, setPlanId] = useState("");
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  function resetForm() {
    setDisplayName("");
    setEmail("");
    setPlanId("");
    setPassword("");
    setIsVerified(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!planId) {
      return;
    }

    createUser.mutate(
      { displayName, email, planId, password, isVerified },
      {
        onSuccess: () => {
          toast.success(t("toasts.created"));
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
            <DialogTitle>{t("create.title")}</DialogTitle>
            <DialogDescription>{t("create.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-user-name">{t("create.nameLabel")}</Label>
            <Input
              id="create-user-name"
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder={t("create.namePlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-user-email">{t("create.emailLabel")}</Label>
            <Input
              id="create-user-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("create.emailPlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-user-plan">{t("create.planLabel")}</Label>
            <Select value={planId} onValueChange={setPlanId} required>
              <SelectTrigger id="create-user-plan" className="w-full">
                <SelectValue placeholder={plansLoading ? t("create.planLoading") : undefined} />
              </SelectTrigger>
              <SelectContent>
                {(plans ?? []).map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-user-password">{t("create.passwordLabel")}</Label>
            <Input
              id="create-user-password"
              type="text"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t("create.passwordPlaceholder")}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="create-user-verified"
              checked={isVerified}
              onCheckedChange={(checked) => setIsVerified(checked === true)}
            />
            <Label htmlFor="create-user-verified" className="font-normal">
              {t("create.verifiedLabel")}
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("create.cancel")}
            </Button>
            <Button type="submit" disabled={createUser.isPending || !planId}>
              {t("create.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

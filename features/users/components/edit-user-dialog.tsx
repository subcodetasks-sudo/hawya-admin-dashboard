"use client";

import { useState, type FormEvent } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUser } from "@/features/users/hooks/use-user-mutations";
import type { User, UserPlanKey, UserStatus } from "@/features/users/types";

const PLAN_OPTIONS: UserPlanKey[] = ["starter", "pro", "business", "enterprise"];
const STATUS_OPTIONS: UserStatus[] = ["active", "suspended", "blocked"];

type Props = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditUserDialog({ user, open, onOpenChange }: Props) {
  const t = useTranslations("Users");
  const tDashboard = useTranslations("Dashboard");
  const updateUser = useUpdateUser();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [planKey, setPlanKey] = useState<UserPlanKey>(user.planKey);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setName(user.name);
      setEmail(user.email);
      setPlanKey(user.planKey);
      setStatus(user.status);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateUser.mutate(
      { id: user.id, input: { name, email, planKey, status } },
      {
        onSuccess: () => {
          toast.success(t("toasts.updated"));
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>{t("edit.title")}</DialogTitle>
            <DialogDescription>{t("edit.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-user-name">{t("edit.nameLabel")}</Label>
            <Input
              id="edit-user-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-user-email">{t("edit.emailLabel")}</Label>
            <Input
              id="edit-user-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-user-plan">{t("edit.planLabel")}</Label>
              <Select value={planKey} onValueChange={(value) => setPlanKey(value as UserPlanKey)}>
                <SelectTrigger id="edit-user-plan" className="w-full">
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-user-status">{t("edit.statusLabel")}</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as UserStatus)}>
                <SelectTrigger id="edit-user-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`status.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("edit.cancel")}
            </Button>
            <Button type="submit" disabled={updateUser.isPending}>
              {t("edit.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

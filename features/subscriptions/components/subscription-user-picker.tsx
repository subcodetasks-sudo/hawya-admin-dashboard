"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebouncedValue } from "@/features/subscriptions/hooks/use-debounced-value";
import { userOptionsQueryOptions } from "@/features/subscriptions/services/subscriptions";
import type { UserOption } from "@/features/subscriptions/types";

const SEARCH_DEBOUNCE_MS = 300;

type Props = {
  value: UserOption | null;
  onChange: (user: UserOption) => void;
};

export default function SubscriptionUserPicker({ value, onChange }: Props) {
  const t = useTranslations("Subscriptions");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const { data: users, isLoading } = useQuery({
    ...userOptionsQueryOptions(debouncedSearch),
    enabled: open,
  });

  function handleSelect(user: UserOption) {
    onChange(user);
    setOpen(false);
    setSearch("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-auto w-full justify-start py-2 font-normal"
        >
          {value ? (
            <span className="flex min-w-0 flex-col items-start">
              <span className="truncate text-sm">{value.name}</span>
              <span className="truncate text-xs text-muted-foreground">{value.email}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{t("create.userPlaceholder")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-2">
        <Input
          autoFocus
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("create.userSearchPlaceholder")}
          className="mb-2"
        />
        <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto">
          {isLoading ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">{t("create.userLoading")}</p>
          ) : (users ?? []).length === 0 ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">{t("create.userEmpty")}</p>
          ) : (
            (users ?? []).map((user) => (
              <Button
                key={user.id}
                type="button"
                variant="ghost"
                className="h-auto w-full justify-start py-1.5 font-normal"
                onClick={() => handleSelect(user)}
              >
                <span className="flex min-w-0 flex-col items-start">
                  <span className="truncate text-sm">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </span>
              </Button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

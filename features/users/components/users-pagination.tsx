"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { usersListQueryOptions } from "@/features/users/services/users";
import type { UsersListParams } from "@/features/users/types";
import { formatNumber } from "@/lib/format";

type Props = {
  params: UsersListParams;
  onPageChange: (page: number) => void;
};

export default function UsersPagination({ params, onPageChange }: Props) {
  const t = useTranslations("Users");
  const locale = useLocale();
  const { data, isLoading } = useQuery(usersListQueryOptions(params));

  if (isLoading || !data || data.total === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.perPage));

  return (
    <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {t("pagination.pageOf", {
          page: formatNumber(data.page, locale),
          totalPages: formatNumber(totalPages, locale),
        })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={data.page <= 1}
          onClick={() => onPageChange(data.page - 1)}
        >
          <ChevronLeft data-icon="inline-start" />
          {t("pagination.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={data.page >= totalPages}
          onClick={() => onPageChange(data.page + 1)}
        >
          {t("pagination.next")}
          <ChevronRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}

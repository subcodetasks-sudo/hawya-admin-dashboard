"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { anthropicWorkspacesQueryOptions } from "@/features/claude-usage/services/anthropic-usage";
import { getDateFnsLocale } from "@/lib/date-fns-locale";

const COLUMN_COUNT = 4;

export default function AnthropicWorkspacesTable() {
  const t = useTranslations("ClaudeUsage.anthropic");
  const locale = useLocale();
  const dateLocale = getDateFnsLocale(locale);
  const { data, isLoading, isError } = useQuery(anthropicWorkspacesQueryOptions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workspaces.title")}</CardTitle>
        <CardDescription>{t("workspaces.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 ring-1 ring-border/80 rounded-b-xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 text-start">{t("workspaces.name")}</TableHead>
              <TableHead className="px-4 text-start">{t("workspaces.type")}</TableHead>
              <TableHead className="px-4 text-start">{t("workspaces.created")}</TableHead>
              <TableHead className="px-4 text-start">{t("workspaces.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell colSpan={COLUMN_COUNT} className="px-4 py-3">
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError || !data ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="px-4 py-8 text-center text-sm text-destructive"
                >
                  {t("workspaces.loadError")}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  {t("workspaces.empty")}
                </TableCell>
              </TableRow>
            ) : (
              data.map((workspace) => (
                <TableRow key={workspace.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: workspace.displayColor }}
                      />
                      <span className="truncate text-sm font-medium">{workspace.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {workspace.type}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm tabular-nums">
                    {format(new Date(workspace.createdAt), "d MMM yyyy", {
                      locale: dateLocale,
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {workspace.archivedAt ? (
                      <Badge className="border-transparent bg-muted text-muted-foreground">
                        {t("workspaces.archived")}
                      </Badge>
                    ) : (
                      <Badge className="border-transparent bg-success/10 text-success">
                        {t("workspaces.active")}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

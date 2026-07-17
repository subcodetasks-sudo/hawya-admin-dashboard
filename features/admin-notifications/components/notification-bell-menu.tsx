"use client";

import { Bell } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { adminNotificationsQueryOptions } from "@/features/admin-notifications/services/admin-notifications";
import { useMarkNotificationRead } from "@/features/admin-notifications/hooks/use-mark-notification-read";
import type { AdminNotification } from "@/features/admin-notifications/types";
import { formatRelativeTime } from "@/features/users/lib/relative-time";
import { cn } from "@/lib/utils";

export default function NotificationBellMenu() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const { data, isLoading } = useQuery(adminNotificationsQueryOptions);
  const markRead = useMarkNotificationRead();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  function handleSelect(notification: AdminNotification) {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("notifications")} className="relative">
          <Bell />
          {unreadCount > 0 ? (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-bold"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border/70 px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">{t("notifications")}</h2>
        </div>

        <ScrollArea className="h-80">
          {isLoading ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t("notificationsLoading")}
            </p>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t("notificationsEmpty")}
            </p>
          ) : (
            <ul className="flex flex-col">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(notification)}
                    className={cn(
                      "flex w-full flex-col gap-1 border-b border-border/50 px-4 py-3 text-start transition-colors hover:bg-accent",
                      !notification.isRead && "bg-accent/40",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {!notification.isRead ? (
                        <span className="size-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                      <span className="text-sm font-medium text-foreground">
                        {notification.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(notification.createdAt, locale)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

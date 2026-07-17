import { queryOptions } from "@tanstack/react-query";

import { apiGet, apiPatch } from "@/lib/api-client";
import { adminNotificationKeys } from "@/features/admin-notifications/query-keys";
import type {
  AdminNotification,
  AdminNotificationsResult,
} from "@/features/admin-notifications/types";

type AdminNotificationResponse = {
  id: string;
  type: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

type AdminNotificationsListResponse = {
  notifications: AdminNotificationResponse[];
  unread_count: number;
};

function mapNotification(data: AdminNotificationResponse): AdminNotification {
  return {
    id: data.id,
    type: data.type,
    title: data.title,
    message: data.message,
    isRead: data.is_read,
    createdAt: data.created_at,
  };
}

const NOTIFICATIONS_LIMIT = 50;

export async function fetchAdminNotifications(): Promise<AdminNotificationsResult> {
  const data = await apiGet<AdminNotificationsListResponse>(
    `/admin/notifications?unread_only=false&limit=${NOTIFICATIONS_LIMIT}`,
  );

  return {
    notifications: data.notifications.map(mapNotification),
    unreadCount: data.unread_count,
  };
}

export const adminNotificationsQueryOptions = queryOptions({
  queryKey: adminNotificationKeys.lists(),
  queryFn: fetchAdminNotifications,
  refetchInterval: 60_000,
});

type MarkNotificationReadResponse = { id: string; is_read: boolean };

export async function markNotificationRead(id: string): Promise<void> {
  await apiPatch<MarkNotificationReadResponse>(`/admin/notifications/${id}/read`);
}

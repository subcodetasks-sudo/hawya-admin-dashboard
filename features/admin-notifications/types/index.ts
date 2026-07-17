export interface AdminNotification {
  id: string;
  type: string | null;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminNotificationsResult {
  notifications: AdminNotification[];
  unreadCount: number;
}

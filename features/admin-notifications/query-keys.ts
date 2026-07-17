export const adminNotificationKeys = {
  all: ["admin-notifications"] as const,
  lists: () => [...adminNotificationKeys.all, "list"] as const,
};

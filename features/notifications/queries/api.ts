import { apiPost } from "@/lib/api-client";

export async function updateFcmToken(payload: { fcm_token: string }): Promise<void> {
  await apiPost("/admin/notifications/fcm_token", payload);
}

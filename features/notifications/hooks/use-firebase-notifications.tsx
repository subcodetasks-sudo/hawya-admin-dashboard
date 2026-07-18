"use client";

import { useEffect } from "react";
import { getToken, type MessagePayload } from "firebase/messaging";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { env } from "@/config/env";
import { adminNotificationKeys } from "@/features/admin-notifications/query-keys";
import { getFirebaseMessaging, onForegroundMessage } from "../services/firebase-client";
import { updateFcmToken } from "../queries/api";

const FCM_TOKEN_KEY = "fcm_token";
const VAPID_KEY = env.FIREBASE_VAPID_KEY ?? "";

function pickField(
  dataValue: string | undefined,
  notificationValue: string | undefined,
): string | undefined {
  const data = dataValue?.trim();
  const notification = notificationValue?.trim();
  // Prefer the richer payload field — backends often send a generic
  // notification.title ("New Notification") alongside the real title in data.
  if (data && notification) {
    const generic = /^(new notification|إشعار جديد)$/i.test(notification);
    return generic ? data : notification.length >= data.length ? notification : data;
  }
  return data || notification || undefined;
}

async function dismissOsNotifications(matchTitles: string[]) {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const notifications = await registration.getNotifications();
    const titles = new Set(
      matchTitles.map((title) => title.trim().toLowerCase()).filter(Boolean),
    );
    for (const notification of notifications) {
      if (titles.has(notification.title.trim().toLowerCase())) {
        notification.close();
      }
    }
  } catch {
    // Best-effort: OS notifications may already have been dismissed.
  }
}

function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

function isPushUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    error.name === "AbortError" ||
    message.includes("push service not available") ||
    message.includes("registration failed")
  );
}

function isIndexedDbVersionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "VersionError" ||
    error.message.toLowerCase().includes("requested version")
  );
}

async function clearFirebaseMessagingIdb(): Promise<void> {
  if (!("indexedDB" in window) || typeof indexedDB.databases !== "function") {
    // Fallback for browsers without databases() — drop the known messaging store.
    await new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase("firebase-messaging-database");
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
    return;
  }

  const databases = await indexedDB.databases();
  await Promise.all(
    databases
      .filter((db) => db.name?.includes("firebase-messaging"))
      .map(
        (db) =>
          new Promise<void>((resolve) => {
            const req = indexedDB.deleteDatabase(db.name!);
            req.onsuccess = () => resolve();
            req.onerror = () => resolve();
            req.onblocked = () => resolve();
          }),
      ),
  );
}

async function getMessagingServiceWorker(): Promise<ServiceWorkerRegistration> {
  // Always re-register so a bumped SW CDN version is picked up (avoids
  // IndexedDB VersionError between page SDK and an old worker).
  return navigator.serviceWorker.register("/firebase-messaging-sw.js", {
    updateViaCache: "none",
  });
}

async function obtainFcmToken(messaging: NonNullable<ReturnType<typeof getFirebaseMessaging>>) {
  const serviceWorkerRegistration = await getMessagingServiceWorker();
  await navigator.serviceWorker.ready;

  try {
    return await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    });
  } catch (error) {
    // Stale messaging IndexedDB from an older Firebase/SW build.
    if (!isIndexedDbVersionError(error)) throw error;
    await clearFirebaseMessagingIdb();
    return getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    });
  }
}

export function useFirebaseNotifications() {
  const t = useTranslations("notifications");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isPushSupported()) return;

    async function init() {
      try {
        // Only prompt when the user hasn't already decided.
        const permission =
          Notification.permission === "default"
            ? await Notification.requestPermission()
            : Notification.permission;
        if (permission !== "granted") return;

        const messaging = getFirebaseMessaging();
        if (!messaging) return;

        const token = await obtainFcmToken(messaging);
        if (!token) return;

        // Only send the token to the server when it changes.
        const stored = localStorage.getItem(FCM_TOKEN_KEY);
        if (token !== stored) {
          await updateFcmToken({ fcm_token: token });
          localStorage.setItem(FCM_TOKEN_KEY, token);
        }
      } catch (error) {
        // Browser/OS push backend unavailable (common on some Windows setups,
        // non-localhost HTTP, or blocked Google endpoints) — not a code bug.
        if (isPushUnavailableError(error)) {
          console.warn("[FCM] Push unavailable in this browser/environment:", error);
          return;
        }
        console.error("[FCM] Initialisation failed:", error);
      }
    }

    init();

    const unsubscribe = onForegroundMessage((payload: MessagePayload) => {
      const title =
        pickField(payload.data?.title, payload.notification?.title) ??
        t("newNotification");
      const body =
        pickField(payload.data?.body, payload.notification?.body) ?? "";

      queryClient.invalidateQueries({ queryKey: adminNotificationKeys.all });

      // Close OS banners so only the in-app toast remains while focused.
      void dismissOsNotifications([
        title,
        payload.notification?.title ?? "",
        payload.data?.title ?? "",
        "New Notification",
        t("newNotification"),
      ]);

      toast(title, {
        id: payload.messageId ?? `fcm-${title}-${body}`,
        description: body || undefined,
        icon: <Bell className="size-4" />,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [t, queryClient]);
}

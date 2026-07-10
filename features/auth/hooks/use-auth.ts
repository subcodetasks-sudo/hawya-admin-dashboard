"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "@/i18n/navigation";

import {
  clearSession,
  getStoredAdmin,
  subscribeToSession,
  type AdminSession,
} from "../services/session";

export function useAuth() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminSession | null>(null);

  useEffect(() => {
    const sync = () => setAdmin(getStoredAdmin());
    const unsubscribe = subscribeToSession(sync);
    sync();
    return unsubscribe;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAdmin(null);
    router.replace("/");
    router.refresh();
  }, [router]);

  return { admin, logout };
}

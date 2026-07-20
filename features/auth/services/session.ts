const TOKEN_COOKIE = "admin_token";
const SESSION_STORAGE_KEY = "admin_session";
const SESSION_CHANGE_EVENT = "admin-session-change";
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30;

export interface AdminSession {
  adminId: string;
  email: string;
  role: string;
}

export function subscribeToSession(callback: () => void): () => void {
  window.addEventListener(SESSION_CHANGE_EVENT, callback);
  return () => window.removeEventListener(SESSION_CHANGE_EVENT, callback);
}

export function setSession(
  token: string,
  admin: AdminSession,
  remember: boolean,
): void {
  const cookieParts = [`${TOKEN_COOKIE}=${token}`, "path=/", "SameSite=Lax"];

  if (remember) {
    cookieParts.push(`max-age=${REMEMBER_MAX_AGE}`);
  }

  document.cookie = cookieParts.join("; ");

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(admin));
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function clearSession(): void {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

/**
 * Replaces the session token in place (e.g. after the email-change endpoint
 * issues a new one) while preserving whichever storage — localStorage
 * ("remember me") or sessionStorage — the admin's current session already
 * lives in, and merging in any updated session fields (e.g. the new email).
 */
export function updateSessionToken(
  token: string,
  patch: Partial<AdminSession> = {},
): void {
  const current = getStoredAdmin();
  if (!current) {
    return;
  }

  const remember = window.localStorage.getItem(SESSION_STORAGE_KEY) !== null;
  setSession(token, { ...current, ...patch }, remember);
}

export function getStoredAdmin(): AdminSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw =
    window.localStorage.getItem(SESSION_STORAGE_KEY) ??
    window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

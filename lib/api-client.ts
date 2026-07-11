const ADMIN_TOKEN_COOKIE = "admin_token";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; message?: string; data: null };

async function getAdminToken(): Promise<string | undefined> {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${ADMIN_TOKEN_COOKIE}=([^;]*)`),
    );
    return match ? decodeURIComponent(match[1]) : undefined;
  }

  const { cookies } = await import("next/headers");
  const store = await cookies();
  return store.get(ADMIN_TOKEN_COOKIE)?.value;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAdminToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  const json = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !json || !json.success) {
    throw new ApiError(
      (json && "message" in json && json.message) || `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return json.data;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}

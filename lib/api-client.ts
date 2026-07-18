import { env } from "@/config/env";

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
  | { status: true; message?: string; data: T }
  | { status: false; message?: string; data: null; errors?: { error?: string } };

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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

function apiBaseUrl(): string {
  const base = env.API_URL;
  if (!base) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not configured", 0);
  }
  return base.replace(/\/$/, "");
}

async function request<T>(
  path: string,
  method: HttpMethod,
  init?: Omit<RequestInit, "method">,
): Promise<T> {
  const token = await getAdminToken();

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    method,
    mode: "cors",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  const json = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !json || !json.status) {
    throw new ApiError(
      (json && "message" in json && json.message) || `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return json.data;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, "GET");
}

/** Fetches a binary response (e.g. PDF). Does not expect the JSON envelope. */
export async function apiGetBlob(path: string): Promise<Blob> {
  const token = await getAdminToken();

  const response = await fetch(`${apiBaseUrl()}${path}`, {
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "application/pdf, application/octet-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status);
  }

  return response.blob();
}

export function apiPost<T>(path: string, body: unknown = {}): Promise<T> {
  return request<T>(path, "POST", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
}

export function apiPut<T>(path: string, body: unknown = {}): Promise<T> {
  return request<T>(path, "PUT", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const hasBody = body !== undefined;

  return request<T>(path, "PATCH", {
    ...(hasBody
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, "DELETE");
}

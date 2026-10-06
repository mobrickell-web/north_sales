const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const ACCESS_TOKEN_KEY = "north_admin_access_token";
const REFRESH_TOKEN_KEY = "north_admin_refresh_token";
const ADMIN_KEY = "north_admin_profile";

export const ADMIN_ROLE = "SUPER_ADMIN";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AdminSession = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  refreshExpiresIn: number;
  admin: AdminProfile;
};

export function isSuperAdmin(admin: AdminProfile | null) {
  return admin?.role === ADMIN_ROLE;
}

export class AdminApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

export function isRateLimited(error: unknown) {
  return error instanceof AdminApiError && error.status === 429;
}

export function isUnauthorized(error: unknown) {
  return error instanceof AdminApiError && error.status === 401;
}

async function request<T>(
  path: string,
  init?: RequestInit & { accessToken?: string },
): Promise<T> {
  const { accessToken, ...rest } = init ?? {};

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...rest.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as {
    status?: boolean;
    data?: T;
    message?: string | string[];
  } | null;

  if (!response.ok) {
    if (response.status === 429) {
      throw new AdminApiError(
        429,
        "Too many attempts. Please wait a minute and try again.",
      );
    }

    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message;
    throw new AdminApiError(
      response.status,
      message || "Something went wrong. Please try again.",
    );
  }

  return (body && "data" in body ? body.data : body) as T;
}

export async function adminLogin(email: string, password: string) {
  try {
    return await request<AdminSession>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    });
  } catch (error) {
    if (isUnauthorized(error)) {
      throw new AdminApiError(401, "Incorrect email or password.");
    }
    throw error;
  }
}

export async function adminRefresh(refreshToken: string) {
  try {
    return await request<AdminSession>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  } catch (error) {
    if (isUnauthorized(error)) {
      throw new AdminApiError(
        401,
        "Your session has expired. Please sign in again.",
      );
    }
    throw error;
  }
}

export function adminProfile(accessToken: string) {
  return request<AdminProfile>("/api/v1/auth/me", { accessToken });
}

export function adminLogout(accessToken: string, refreshToken: string) {
  return request<{ revoked: boolean }>("/api/v1/auth/logout", {
    method: "POST",
    accessToken,
    body: JSON.stringify({ refreshToken }),
  });
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function storeSession(session: AdminSession) {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  window.sessionStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  window.sessionStorage.setItem(ADMIN_KEY, JSON.stringify(session.admin));
}

function readStored(key: string) {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(key);
}

export function getStoredTokens() {
  return {
    accessToken: readStored(ACCESS_TOKEN_KEY),
    refreshToken: readStored(REFRESH_TOKEN_KEY),
  };
}

export function getStoredAdmin(): AdminProfile | null {
  const raw = readStored(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminProfile;
  } catch {
    return null;
  }
}

export function hasSession() {
  return Boolean(readStored(ACCESS_TOKEN_KEY) && readStored(REFRESH_TOKEN_KEY));
}

export function clearSession() {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(ADMIN_KEY);
}

let refreshInFlight: Promise<AdminSession | null> | null = null;

async function refreshSession(): Promise<AdminSession | null> {
  const refreshToken = readStored(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  refreshInFlight ??= adminRefresh(refreshToken)
    .then((session) => {
      storeSession(session);
      return session;
    })
    .catch(() => {
      clearSession();
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const accessToken = readStored(ACCESS_TOKEN_KEY);
  if (!accessToken) throw new AdminApiError(401, "Your session has expired.");

  try {
    return await request<T>(path, { ...init, accessToken });
  } catch (error) {
    if (!isUnauthorized(error)) throw error;

    const session = await refreshSession();
    if (!session) throw error;
    return request<T>(path, { ...init, accessToken: session.accessToken });
  }
}

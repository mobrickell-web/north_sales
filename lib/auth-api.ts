const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const LEGACY_REFRESH_TOKEN_KEY = "north_admin_refresh_token";
const LEGACY_ACCESS_TOKEN_KEY = "north_admin_access_token";
const ADMIN_KEY = "north_admin_profile";
const PASSWORD_RESET_TOKEN_KEY = "north_password_reset_token";

if (typeof window !== "undefined") {
  window.sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
}

export const ADMIN_ROLE = "SUPER_ADMIN";

export type LoginCategory =
  "CLIENT" | "SALES_REPRESENTATIVE" | "MASTER_ADMIN" | "OTHER";
export type VerificationPurpose = "SIGNUP" | "PASSWORD_RESET";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AdminSession = {
  tokenType: "Bearer";
  expiresIn: number;
  refreshExpiresIn: number;
  admin: AdminProfile;
};

export type ClientAccessRequest = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  account: {
    id: string;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    isActive: boolean;
    createdAt: string;
  };
};

export type SalesRepresentative = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
};

export function isSuperAdmin(admin: AdminProfile | null) {
  return admin?.role === ADMIN_ROLE;
}

export function getRoleHomePath(role: string) {
  if (role === "SUPER_ADMIN") return "/dashboard";
  if (role === "SALES_REPRESENTATIVE") return "/";
  if (role === "USER") return "/dashboard";
  return "/";
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as {
    status?: boolean;
    data?: T;
    message?: string | string[];
  } | null;

  if (!response.ok) {
    const responseMessage = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message;

    if (response.status === 429) {
      throw new AdminApiError(
        429,
        responseMessage ||
          "Too many attempts. Please wait a minute and try again.",
      );
    }

    throw new AdminApiError(
      response.status,
      responseMessage || "Something went wrong. Please try again.",
    );
  }

  return (body && "data" in body ? body.data : body) as T;
}

export async function adminLogin(
  email: string,
  password: string,
  category: Exclude<LoginCategory, "OTHER">,
) {
  try {
    return await request<AdminSession>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password, category }),
    });
  } catch (error) {
    if (isUnauthorized(error)) {
      throw new AdminApiError(401, "Incorrect email or password.");
    }
    throw error;
  }
}

export function googleLogin(idToken: string, category: LoginCategory) {
  return request<AdminSession>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken, category }),
  });
}

export function requestClientSignup(input: {
  name: string;
  email: string;
  password: string;
}) {
  return request<{ message: string }>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function verifyAuthCode(
  email: string,
  code: string,
  purpose: VerificationPurpose,
) {
  return request<{
    verified: true;
    alreadyVerified?: true;
    resetToken?: string;
    message: string;
  }>("/api/v1/auth/verify-code", {
    method: "POST",
    body: JSON.stringify({ email, code, purpose }),
  });
}

export function resendAuthCode(email: string, purpose: VerificationPurpose) {
  return request<{ message: string; retryAfterSeconds?: number }>(
    "/api/v1/auth/resend-code",
    {
      method: "POST",
      body: JSON.stringify({ email, purpose }),
    },
  );
}

export function requestPasswordReset(email: string) {
  return request<{ message: string }>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function submitPasswordReset(resetToken: string, newPassword: string) {
  return request<{ passwordUpdated: true }>("/api/v1/auth/update-password", {
    method: "POST",
    body: JSON.stringify({ resetToken, newPassword }),
  });
}

export function storePasswordResetToken(resetToken: string) {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(PASSWORD_RESET_TOKEN_KEY, resetToken);
}

export function getPasswordResetToken() {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(PASSWORD_RESET_TOKEN_KEY);
}

export function clearPasswordResetToken() {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(PASSWORD_RESET_TOKEN_KEY);
}

export async function adminRefresh() {
  try {
    return await request<AdminSession>("/api/v1/auth/refresh", {
      method: "POST",
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

export function adminProfile() {
  return adminFetch<AdminProfile>("/api/v1/auth/me");
}

export function listClientAccessRequests() {
  return adminFetch<ClientAccessRequest[]>(
    "/api/v1/auth/admin/client-access-requests",
  );
}

export function decideClientAccessRequest(
  id: string,
  decision: "APPROVE" | "REJECT",
) {
  return adminFetch<{ reviewed: true }>(
    `/api/v1/auth/admin/client-access-requests/${encodeURIComponent(id)}/decision`,
    {
      method: "POST",
      body: JSON.stringify({ decision }),
    },
  );
}

export function deactivateClientAccess(id: string) {
  return adminFetch<{ isActive: false }>(
    `/api/v1/auth/admin/clients/${encodeURIComponent(id)}/access`,
    { method: "DELETE" },
  );
}

export function restoreClientAccess(id: string) {
  return adminFetch<{ isActive: true }>(
    `/api/v1/auth/admin/clients/${encodeURIComponent(id)}/access/restore`,
    { method: "POST" },
  );
}

export function listSalesRepresentatives() {
  return adminFetch<SalesRepresentative[]>(
    "/api/v1/auth/admin/representatives",
  );
}

export function createSalesRepresentative(input: {
  name: string;
  email: string;
  password: string;
}) {
  return adminFetch<SalesRepresentative>("/api/v1/auth/admin/representatives", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deactivateSalesRepresentative(id: string) {
  return adminFetch<{ deleted: true }>(
    `/api/v1/auth/admin/representatives/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}

export function restoreSalesRepresentative(id: string) {
  return adminFetch<{ isActive: true }>(
    `/api/v1/auth/admin/representatives/${encodeURIComponent(id)}/restore`,
    { method: "POST" },
  );
}

export function validateStoredSession() {
  return adminFetch<AdminProfile>("/api/v1/auth/me");
}

export function adminLogout() {
  return adminFetch<{ revoked: boolean }>("/api/v1/auth/logout", {
    method: "POST",
  });
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function storeSession(session: AdminSession) {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  window.sessionStorage.setItem(ADMIN_KEY, JSON.stringify(session.admin));
}

function readStored(key: string) {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(key);
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
  return Boolean(readStored(ADMIN_KEY));
}

export function clearSession() {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(ADMIN_KEY);
}

let refreshInFlight: Promise<AdminSession | null> | null = null;

async function refreshSession(): Promise<AdminSession | null> {
  refreshInFlight ??= adminRefresh()
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
  try {
    return await request<T>(path, init);
  } catch (error) {
    if (!isUnauthorized(error)) throw error;

    const session = await refreshSession();
    if (!session) throw error;
    return request<T>(path, init);
  }
}

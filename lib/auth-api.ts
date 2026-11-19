// In the browser, go through the same-origin /api/v1 rewrite (next.config.ts)
// so the backend's auth cookies are stored on the frontend domain.
const API_URL =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : "";

const LEGACY_REFRESH_TOKEN_KEY = "north_admin_refresh_token";
const LEGACY_ACCESS_TOKEN_KEY = "north_admin_access_token";
const ADMIN_KEY = "north_admin_profile";
const PASSWORD_RESET_TOKEN_KEY = "north_password_reset_token";

if (typeof window !== "undefined") {
  window.sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
}

export const ADMIN_ROLE = "SUPER_ADMIN";

export const STAFF_ROLE = "SALES_REPRESENTATIVE";

// Staff accounts share role SALES_REPRESENTATIVE and are told apart by position.
export type StaffPosition =
  | "EXECUTIVE_ACCOUNT_DEVELOPMENT_SPECIALIST"
  | "IMPLEMENTATION_SPECIALIST"
  | "FRACTIONAL_VP"
  | "REGIONAL_SALES_MANAGER"
  | "OFFICE_MANAGER";

/** EADS — CRM /leads specialist position (A7). */
export const EADS_POSITION =
  "EXECUTIVE_ACCOUNT_DEVELOPMENT_SPECIALIST" as const satisfies StaffPosition;

export const STAFF_POSITION_LABELS: Record<StaffPosition, string> = {
  EXECUTIVE_ACCOUNT_DEVELOPMENT_SPECIALIST:
    "Executive Account Development Specialist",
  IMPLEMENTATION_SPECIALIST: "Sales Performance Implementation Specialist",
  FRACTIONAL_VP: "Fractional VP of Sales",
  REGIONAL_SALES_MANAGER: "Regional Sales Manager",
  OFFICE_MANAGER: "Office Manager",
};

/** Blocked when Master Admin creates client / staff accounts. */
export const BLOCKED_ACCOUNT_EMAILS = new Set(["gotohell@gmail.com"]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAccountEmail(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !EMAIL_PATTERN.test(normalized)) {
    return "Enter a valid email address.";
  }
  if (BLOCKED_ACCOUNT_EMAILS.has(normalized)) {
    return "This email address is not allowed for account creation.";
  }
  return null;
}

export type LoginCategory = "CLIENT" | StaffPosition | "MASTER_ADMIN" | "OTHER";
export type VerificationPurpose = "SIGNUP" | "PASSWORD_RESET";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  position?: StaffPosition | null;
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
    /** Admin-set password for credential handoff (Master Admin list only). */
    adminSetPassword?: string | null;
    accessPauseReason?: string | null;
    accessPausedAt?: string | null;
  };
};

export type SalesRepresentative = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  position: StaffPosition | null;
  adminSetPassword?: string | null;
  accessPauseReason?: string | null;
  accessPausedAt?: string | null;
};

export type CreatedClientAccount = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  adminSetPassword?: string | null;
};

export function isSuperAdmin(admin: AdminProfile | null) {
  return admin?.role === ADMIN_ROLE;
}

export function isEads(admin: AdminProfile | null) {
  return admin?.role === STAFF_ROLE && admin.position === EADS_POSITION;
}

/** @deprecated Use isEads — kept as alias during A7 rename. */
export const isAccountExecutive = isEads;

export function getRoleHomePath(role: string, position?: StaffPosition | null) {
  if (role === ADMIN_ROLE) return "/dashboard";
  if (role === "USER") return "/dashboard";
  if (role === STAFF_ROLE && position === EADS_POSITION) return "/leads";
  return "/";
}

/** Only allow same-origin relative redirects (e.g. Zoom on-behalf links). */
export function getSafeNextPath(candidate: string | null | undefined) {
  if (!candidate) return null;
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return null;
  if (candidate.startsWith("/on-behalf/")) return candidate;
  return null;
}

export class AdminApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly duplicates?: unknown;

  constructor(
    status: number,
    message: string,
    extras?: { code?: string; duplicates?: unknown },
  ) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = extras?.code;
    this.duplicates = extras?.duplicates;
  }
}

export function isRateLimited(error: unknown) {
  return error instanceof AdminApiError && error.status === 429;
}

export function isUnauthorized(error: unknown) {
  return error instanceof AdminApiError && error.status === 401;
}

export function isForbidden(error: unknown) {
  return error instanceof AdminApiError && error.status === 403;
}

export function isAccessPending(error: unknown) {
  if (!(error instanceof Error)) return false;
  return /pending Super Admin approval|waiting for Super Admin/i.test(
    error.message,
  );
}

function remapCredentialError(error: unknown): never {
  if (
    isUnauthorized(error) &&
    error instanceof Error &&
    !/inactive|configured|token|verified email/i.test(error.message)
  ) {
    throw new AdminApiError(401, "Incorrect email or password.");
  }
  throw error;
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
    code?: string;
    duplicates?: unknown;
  } | null;

  if (!response.ok) {
    const responseMessage = Array.isArray(body?.message)
      ? body.message.join(", ")
      : typeof body?.message === "string"
        ? body.message
        : undefined;

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
      { code: body?.code, duplicates: body?.duplicates },
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
    remapCredentialError(error);
  }
}

export async function googleLogin(idToken: string, category: LoginCategory) {
  try {
    return await request<AdminSession>("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken, category }),
    });
  } catch (error) {
    remapCredentialError(error);
  }
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

export function deactivateClientAccess(id: string, reason: string) {
  return adminFetch<{ isActive: false }>(
    `/api/v1/auth/admin/clients/${encodeURIComponent(id)}/access`,
    {
      method: "DELETE",
      body: JSON.stringify({ reason }),
    },
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
  position: StaffPosition;
}) {
  return adminFetch<SalesRepresentative>("/api/v1/auth/admin/representatives", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function createClientAccount(input: {
  name: string;
  email: string;
  password: string;
}) {
  return adminFetch<CreatedClientAccount>("/api/v1/auth/admin/clients", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deactivateSalesRepresentative(id: string, reason: string) {
  return adminFetch<{ deleted: true }>(
    `/api/v1/auth/admin/representatives/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      body: JSON.stringify({ reason }),
    },
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

export async function refreshSession(): Promise<AdminSession | null> {
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

/** Binary/file download with the same cookie auth + 401 refresh as adminFetch. */
export async function adminDownload(
  path: string,
  init?: RequestInit,
): Promise<{ blob: Blob; filename: string | null }> {
  const run = async () => {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        message?: string | string[];
        code?: string;
        duplicates?: unknown;
      } | null;
      const responseMessage = Array.isArray(body?.message)
        ? body.message.join(", ")
        : typeof body?.message === "string"
          ? body.message
          : undefined;
      throw new AdminApiError(
        response.status,
        responseMessage || "Download failed. Please try again.",
        { code: body?.code, duplicates: body?.duplicates },
      );
    }

    const disposition = response.headers.get("Content-Disposition");
    const match = disposition?.match(/filename="?([^";]+)"?/i);
    return {
      blob: await response.blob(),
      filename: match?.[1] ? decodeURIComponent(match[1]) : null,
    };
  };

  try {
    return await run();
  } catch (error) {
    if (!isUnauthorized(error)) throw error;
    const session = await refreshSession();
    if (!session) throw error;
    return run();
  }
}

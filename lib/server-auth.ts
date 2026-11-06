import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ServerAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  // Staff position; only set for SALES_REPRESENTATIVE accounts. Older backends
  // omit it, which reads as null.
  position: string | null;
};

export const ACCOUNT_EXECUTIVE = "ACCOUNT_EXECUTIVE";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getServerAccount(): Promise<ServerAccount | null> {
  const cookie = (await headers()).get("cookie");
  if (!cookie) return null;

  const response = await fetch(`${API_URL}/api/v1/auth/me`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) {
    throw new Error(
      `Could not verify the current account (HTTP ${response.status}).`,
    );
  }

  const body: unknown = await response.json();
  const result =
    typeof body === "object" && body !== null && "data" in body
      ? body.data
      : body;

  if (
    typeof result !== "object" ||
    result === null ||
    !("id" in result) ||
    !("name" in result) ||
    !("email" in result) ||
    !("role" in result) ||
    typeof result.id !== "string" ||
    typeof result.name !== "string" ||
    typeof result.email !== "string" ||
    typeof result.role !== "string"
  ) {
    throw new Error("The authentication service returned an invalid profile.");
  }

  return {
    id: result.id,
    name: result.name,
    email: result.email,
    role: result.role,
    position:
      "position" in result && typeof result.position === "string"
        ? result.position
        : null,
  };
}

export function isAccountExecutive(
  account: Pick<ServerAccount, "role" | "position">,
) {
  return (
    account.role === "SALES_REPRESENTATIVE" &&
    account.position === ACCOUNT_EXECUTIVE
  );
}

// Where an account lands when it opens a page it may not use.
export function getAccountHomePath(
  account: Pick<ServerAccount, "role" | "position">,
) {
  if (account.role === "SUPER_ADMIN" || account.role === "USER") {
    return "/dashboard";
  }
  if (isAccountExecutive(account)) return "/leads";
  if (account.role === "SALES_REPRESENTATIVE") return "/";
  return "/login";
}

export async function requireAccount() {
  const account = await getServerAccount();
  if (!account) redirect("/login");
  return account;
}

// Any signed-in account may take the Sales Alignment Assessment: clients take
// it themselves and staff run it with prospects.
export async function requireAssessmentAccess() {
  const account = await requireAccount();
  if (
    account.role !== "SUPER_ADMIN" &&
    account.role !== "SALES_REPRESENTATIVE" &&
    account.role !== "USER"
  ) {
    redirect("/login");
  }
  return account;
}

export class ServerApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ServerApiError";
    this.status = status;
  }
}

// Calls the backend from a server component on behalf of the signed-in
// browser by forwarding its session cookies.
export async function serverApiFetch<T>(path: string): Promise<T> {
  const cookie = (await headers()).get("cookie");
  if (!cookie) throw new ServerApiError(401, "You are not signed in.");

  const response = await fetch(`${API_URL}${path}`, {
    headers: { cookie },
    cache: "no-store",
  });

  const body = (await response.json().catch(() => null)) as {
    data?: T;
    message?: string | string[];
  } | null;

  if (!response.ok) {
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message;
    throw new ServerApiError(
      response.status,
      message || "Something went wrong. Please try again.",
    );
  }

  return (
    body && typeof body === "object" && "data" in body ? body.data : body
  ) as T;
}

export async function requireRepresentative() {
  const account = await getServerAccount();

  if (!account) redirect("/login");
  if (account.role === "USER") redirect("/dashboard");
  if (
    account.role !== "SUPER_ADMIN" &&
    account.role !== "SALES_REPRESENTATIVE"
  ) {
    redirect("/login");
  }

  return account;
}

export async function requireSuperAdmin() {
  const account = await getServerAccount();

  if (!account) redirect("/login");
  if (account.role === "USER") redirect("/dashboard");
  if (account.role === "SALES_REPRESENTATIVE") redirect("/");
  if (account.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return account;
}

export async function requireClient() {
  const account = await getServerAccount();

  if (!account) redirect("/login");
  if (account.role === "SALES_REPRESENTATIVE") redirect("/");
  if (account.role === "SUPER_ADMIN") redirect("/dashboard");
  if (account.role !== "USER") redirect("/login");

  return account;
}

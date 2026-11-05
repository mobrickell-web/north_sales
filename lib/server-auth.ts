import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ServerAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
};

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
  };
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

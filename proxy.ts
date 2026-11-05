import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/verification-code",
  "/update-password",
];

const REPRESENTATIVE_PATHS = [
  "/blogs",
  "/careers",
  "/privacy-policy",
  "/terms-of-use",
  "/sales-alignment-assessment",
];

type Account = { role: string };

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  // Email links for people with no account; guarded by an unguessable token.
  return /^\/appointments\/(cancel|reschedule)\/[^/]+$/.test(pathname);
}

async function getAccount(req: NextRequest): Promise<Account | null> {
  const cookie = req.headers.get("cookie");
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
    typeof (result as { role?: unknown }).role !== "string"
  ) {
    throw new Error("The authentication service returned an invalid profile.");
  }

  return { role: (result as { role: string }).role };
}

function toLogin(req: NextRequest) {
  return NextResponse.redirect(new URL("/login", req.url));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const account = await getAccount(req);
  if (!account) return toLogin(req);

  if (account.role === "SUPER_ADMIN") return NextResponse.next();

  if (account.role === "USER") {
    if (pathname === "/dashboard") return NextResponse.next();
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (account.role === "SALES_REPRESENTATIVE") {
    if (matches(pathname, REPRESENTATIVE_PATHS)) return NextResponse.next();
    return NextResponse.redirect(new URL("/", req.url));
  }

  return toLogin(req);
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|robots.txt|.*\\.[A-Za-z0-9]+$).*)"],
};

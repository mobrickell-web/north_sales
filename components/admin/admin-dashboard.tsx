"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { AdminAppointmentsPanel } from "@/components/admin/admin-appointments";
import {
  type AdminProfile,
  adminLogout,
  adminProfile,
  clearSession,
  getStoredTokens,
  hasSession,
  isSuperAdmin,
} from "@/lib/admin-auth";

const LOGIN_PATH = "/admin/login";

export function AdminDashboardShell() {
  const router = useRouter();

  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [checking, setChecking] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!hasSession()) {
      router.replace(LOGIN_PATH);
      return;
    }

    adminProfile(getStoredTokens().accessToken ?? "")
      .then((profile) => {
        if (!isSuperAdmin(profile)) {
          clearSession();
          router.replace(LOGIN_PATH);
          return;
        }
        setAdmin(profile);
      })
      .catch(() => {
        clearSession();
        router.replace(LOGIN_PATH);
      })
      .finally(() => setChecking(false));
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    const { accessToken, refreshToken } = getStoredTokens();

    if (accessToken && refreshToken) {
      try {
        await adminLogout(accessToken, refreshToken);
      } catch {}
    }

    clearSession();
    router.replace(LOGIN_PATH);
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F5]">
        <p className="flex items-center gap-2 font-body text-[14px] text-[#5C5F66]">
          <Loader2 className="size-4 animate-spin" />
          Checking your session…
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <header className="border-b border-[#E8E4DC] bg-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Image
            src="/logo/north-logo.svg"
            alt="NORTH POINT SALES GROUP"
            width={190}
            height={40}
            className="h-10 w-auto"
            priority
          />

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            {admin ? (
              <div className="text-right">
                <p className="font-body text-[14px] font-bold text-[#001528]">
                  {admin.name}
                </p>
                <p className="font-body text-[12px] text-[#8A8F98]">
                  {admin.email} · {admin.role}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex h-[40px] items-center justify-center rounded-full border border-[#E8E4DC] bg-white px-4 font-secondary text-[12px] font-bold tracking-[0.08em] text-[#001528] uppercase transition-colors hover:border-[#b17411] hover:text-[#b17411] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-body text-[24px] font-extrabold tracking-[0.03em] text-[#001528] uppercase sm:text-[28px]">
              Admin Dashboard
            </h1>
            <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
              Welcome{admin ? `, ${admin.name}` : ""}. Manage your sales
              appointments here.
            </p>
          </div>

          <AdminAppointmentsPanel />
        </div>
      </main>
    </div>
  );
}

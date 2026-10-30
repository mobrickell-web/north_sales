"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AdminAppointmentsPanel } from "@/components/admin/admin-appointments";
import { AdminOverviewContent } from "@/components/admin/admin-overview";
import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { AdminTopbar } from "@/components/shared/admin-topbar";
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

export function AdminDashboardShell({
  page = "overview",
}: {
  page?: "overview" | "appointments";
}) {
  const router = useRouter();

  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [checking, setChecking] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
      } catch {
        // Clear local credentials even if the server is unavailable.
      }
    }

    clearSession();
    router.replace(LOGIN_PATH);
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-admin-canvas">
        <p className="flex items-center gap-2 font-sans text-[14px] text-admin-muted">
          <Loader2 className="size-4 animate-spin" />
          Checking your session…
        </p>
      </main>
    );
  }

  return (
    <div className="grid min-h-screen w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-x-clip bg-admin-canvas lg:grid-cols-[286px_minmax(0,1fr)]">
      <AdminSidebar
        onLogout={handleSignOut}
        signingOut={signingOut}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      {page === "appointments" ? (
        <main className="w-full min-w-0 max-w-full overflow-x-hidden bg-admin-canvas px-4 pb-8 text-admin-text sm:px-6 lg:px-8">
          <AdminTopbar
            adminName={admin?.name}
            title="Appointments"
            onMenuClick={() => setMobileSidebarOpen(true)}
          />
          <div className="mx-auto mt-6 w-full min-w-0 max-w-[1500px]">
            <AdminAppointmentsPanel />
          </div>
        </main>
      ) : (
        <AdminOverviewContent
          adminName={admin?.name}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
      )}
    </div>
  );
}

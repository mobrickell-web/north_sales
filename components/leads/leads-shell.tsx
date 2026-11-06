"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, LockKeyhole, LogOut, Menu, UsersRound, X } from "lucide-react";

import { adminLogout, clearSession } from "@/lib/auth-api";
import { cn } from "@/lib/utils";

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "AE"
  );
}

function LeadsSidebar({
  name,
  email,
  onLogout,
  signingOut,
  onClose,
}: {
  name: string;
  email: string;
  onLogout: () => void;
  signingOut: boolean;
  onClose?: () => void;
}) {
  return (
    <aside className="flex h-[calc(100dvh-22px)] min-h-[480px] w-[260px] shrink-0 flex-col overflow-y-auto rounded-2xl bg-admin-sidebar px-4 pt-6 pb-6 font-sans text-admin-sidebar-text">
      <div className="mb-6 flex items-start justify-between">
        <Link
          href="/"
          aria-label="North Point Sales Group website"
          onClick={onClose}
          className="block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-admin-gold"
        >
          <Image
            src="/logo/Group%20151.svg"
            alt="North Point Sales Group"
            width={220}
            height={74}
            priority
            className="h-auto w-[200px]"
          />
        </Link>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="cursor-pointer rounded-md p-1 text-admin-sidebar-text hover:bg-admin-sidebar-hover lg:hidden"
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>

      <nav
        aria-label="Account Executive navigation"
        className="flex flex-col gap-2"
      >
        <Link
          href="/leads"
          onClick={onClose}
          aria-current="page"
          className="flex h-10 w-full items-center gap-3 rounded-lg bg-gradient-to-r from-admin-gold to-admin-gold-deep px-3 text-[14px] font-medium text-admin-sidebar shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-surface"
        >
          <UsersRound className="size-[14px]" />
          <span>Leads</span>
        </Link>
        <Link
          href="/"
          onClick={onClose}
          className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[14px] font-medium text-admin-sidebar-text transition-colors hover:bg-admin-sidebar-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold"
        >
          <Globe className="size-[14px]" />
          <span>Website</span>
        </Link>
      </nav>

      <div className="mt-auto border-t border-admin-sidebar-divider pt-4">
        <div className="mb-3 px-1">
          <p className="truncate text-[13px] font-semibold text-admin-sidebar-text">
            {name}
          </p>
          <p className="truncate text-[12px] text-slate-400">{email}</p>
          <p className="mt-1 text-[11px] font-medium text-admin-gold">
            Account Executive
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={signingOut}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[14px] font-medium text-admin-logout transition-colors hover:bg-admin-sidebar-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-logout",
            signingOut && "cursor-wait opacity-60",
          )}
        >
          <LogOut className="size-[14px]" />
          <span>{signingOut ? "Signing out…" : "Log out"}</span>
        </button>
      </div>
    </aside>
  );
}

export function LeadsShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await adminLogout();
    } catch {
      // Clear local credentials even if the server is unavailable.
    }
    clearSession();
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-x-clip bg-admin-canvas lg:grid-cols-[266px_minmax(0,1fr)]">
      <div className="hidden shrink-0 pt-[11px] pb-[11px] pl-[6px] lg:block">
        <div className="sticky top-[11px]">
          <LeadsSidebar
            name={name}
            email={email}
            onLogout={() => void handleLogout()}
            signingOut={signingOut}
          />
        </div>
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/50"
          />
          <div className="relative h-full w-fit overflow-y-auto p-2">
            <LeadsSidebar
              name={name}
              email={email}
              onLogout={() => void handleLogout()}
              signingOut={signingOut}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <main
        id="main"
        className="w-full min-w-0 max-w-full overflow-x-hidden bg-admin-canvas px-4 pb-10 font-sans text-admin-text sm:px-6 lg:px-8"
      >
        <header className="flex h-[54px] items-center justify-between border-b border-admin-border">
          <div className="flex min-w-0 items-center gap-2 text-[12px] text-admin-muted">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="mr-1 cursor-pointer rounded-md p-1.5 text-admin-text-strong hover:bg-admin-soft lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <UsersRound className="size-3.5 shrink-0" />
            <span className="truncate">Leads Dashboard</span>
          </div>
          <div className="flex items-center gap-3 text-admin-muted">
            <span className="hidden items-center gap-1.5 text-[11px] sm:inline-flex">
              <LockKeyhole className="size-3" />
              Private access
            </span>
            <span className="hidden max-w-[180px] truncate text-[12px] font-medium text-admin-text-strong sm:inline">
              {name}
            </span>
            <span
              title={name}
              className="flex size-7 items-center justify-center rounded-full bg-admin-avatar text-[10px] font-semibold text-admin-text-strong"
            >
              {initialsOf(name)}
            </span>
          </div>
        </header>
        <div className="mx-auto w-full min-w-0 max-w-[1500px]">{children}</div>
      </main>
    </div>
  );
}

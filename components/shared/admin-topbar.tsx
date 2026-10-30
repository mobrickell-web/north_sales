"use client";

import { Bell, LayoutDashboard, LockKeyhole, Menu } from "lucide-react";
import { adminOverviewConfig } from "@/config/admin-overview";

export function AdminTopbar({
  adminName,
  title = adminOverviewConfig.navigation.title,
  onMenuClick,
}: {
  adminName?: string;
  title?: string;
  onMenuClick?: () => void;
}) {
  const { navigation } = adminOverviewConfig;
  const displayName = adminName || navigation.initialsFallback;
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-[54px] items-center justify-between border-b border-admin-border">
      <div className="flex items-center gap-2 text-[12px] text-admin-muted">
        {onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={navigation.openNavigationLabel}
            className="mr-1 cursor-pointer rounded-md p-1.5 text-admin-text-strong hover:bg-admin-soft lg:hidden"
          >
            <Menu className="size-4" />
          </button>
        ) : null}
        <LayoutDashboard className="size-3.5" />
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-3 text-admin-muted">
        <span className="hidden items-center gap-1.5 text-[11px] sm:inline-flex">
          <LockKeyhole className="size-3" />
          {navigation.privateAccess}
        </span>
        <button
          type="button"
          aria-label={navigation.notificationsLabel}
          className="cursor-pointer rounded-md p-1.5 hover:bg-admin-soft"
        >
          <Bell className="size-4" />
        </button>
        <span
          title={adminName ?? navigation.unnamedAdmin}
          className="flex size-7 items-center justify-center rounded-full bg-admin-avatar text-[10px] font-semibold text-admin-text-strong"
        >
          {initials}
        </span>
      </div>
    </header>
  );
}

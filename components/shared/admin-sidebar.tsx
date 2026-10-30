"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const managementItems = [
  { label: "Sales Performance", icon: BarChart3 },
  { label: "Sales Systems", icon: ClipboardList },
  { label: "Sales Leadership", icon: UsersRound },
  { label: "Reports & Analytics", icon: FileText },
  { label: "Team Management", icon: Users },
];

export function AdminSidebar({
  onLogout,
  signingOut = false,
  mobileOpen = false,
  onClose,
}: {
  onLogout: () => void;
  signingOut?: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const isOverview = pathname === "/admin/dashboard";
  const isAssessmentList = pathname.startsWith("/admin/assessments");
  const isAppointments = pathname.startsWith("/admin/appointments");
  const sidebar = (
    <aside className="flex min-h-[1024px] w-[280px] shrink-0 flex-col rounded-2xl bg-admin-sidebar px-4 pt-6 pb-6 font-sans text-admin-sidebar-text">
      <div className="mb-6 flex items-start justify-between">
        <Link
          href="/admin/dashboard"
          aria-label="North Point Sales Group overview"
          className="block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-admin-gold"
          onClick={onClose}
        >
          <Image
            src="/logo/Group%20151.svg"
            alt="North Point Sales Group"
            width={220}
            height={74}
            priority
            className="h-auto w-[216px]"
          />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="cursor-pointer rounded-md p-1 text-admin-sidebar-text hover:bg-admin-sidebar-hover lg:hidden"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav aria-label="Admin navigation" className="flex flex-col gap-2">
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-surface",
            isOverview
              ? "bg-gradient-to-r from-admin-gold to-admin-gold-deep text-admin-sidebar shadow-sm"
              : "text-admin-sidebar-text hover:bg-admin-sidebar-hover",
          )}
        >
          <LayoutDashboard className="size-[14px]" />
          <span>Overview</span>
        </Link>

        <Link
          href="/admin/assessments"
          onClick={onClose}
          aria-current={isAssessmentList ? "page" : undefined}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold",
            isAssessmentList
              ? "bg-gradient-to-r from-admin-gold to-admin-gold-deep text-admin-sidebar shadow-sm"
              : "text-admin-sidebar-text hover:bg-admin-sidebar-hover",
          )}
        >
          <ClipboardList className="size-[14px]" />
          <span>Sales Alignment Assessment</span>
        </Link>
        <Link
          href="/admin/appointments"
          onClick={onClose}
          aria-current={isAppointments ? "page" : undefined}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold",
            isAppointments
              ? "bg-gradient-to-r from-admin-gold to-admin-gold-deep text-admin-sidebar shadow-sm"
              : "text-admin-sidebar-text hover:bg-admin-sidebar-hover",
          )}
        >
          <CalendarDays className="size-[14px]" />
          <span>Appointments</span>
        </Link>
      </nav>

      <div className="mt-4 mb-2 px-1 text-[12px] font-medium text-slate-400">
        Management
      </div>

      <nav aria-label="Management" className="flex flex-col gap-1">
        {managementItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            disabled
            title={`${label} — coming soon`}
            className="flex h-10 w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 text-left text-[14px] font-medium text-admin-sidebar-text/85 opacity-90"
          >
            <Icon className="size-[14px] shrink-0" />
            <span className="min-w-0 flex-1 truncate">{label}</span>
            <span className="inline-flex h-[22px] min-w-[53px] items-center justify-center rounded-full bg-admin-soon-bg px-[9px] font-body text-[10px] leading-none font-bold text-admin-soon">
              Soon
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-4 border-t border-admin-sidebar-divider pt-4">
        <p className="mb-2 px-1 text-[12px] font-medium text-slate-400">
          Preferences
        </p>
        <button
          type="button"
          disabled
          className="flex h-10 w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 text-left text-[14px] font-medium text-admin-sidebar-text/85"
        >
          <Settings className="size-[14px]" />
          <span>Settings</span>
        </button>
      </div>

      <div className="mt-0 pt-2">
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

  return (
    <>
      <div className="hidden shrink-0 pl-[6px] pt-[11px] pb-[11px] lg:block">
        {sidebar}
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="absolute inset-0 cursor-pointer bg-black/50"
          />
          <div className="relative h-full w-fit overflow-y-auto p-2">
            {sidebar}
          </div>
        </div>
      ) : null}
    </>
  );
}

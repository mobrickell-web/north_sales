"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Search } from "lucide-react";

import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { AdminTopbar } from "@/components/shared/admin-topbar";
import { adminAssessmentsConfig } from "@/config/admin-assessments";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  createAdminAssessment,
  getAdminAssessments,
} from "@/lib/admin-assessment-store";
import {
  type AdminProfile,
  adminLogout,
  adminProfile,
  clearSession,
  getStoredTokens,
  hasSession,
  isSuperAdmin,
} from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

const LOGIN_PATH = "/admin/login";

function statusStyle(status: string) {
  switch (status) {
    case "Published":
      return "bg-admin-status-published-bg text-admin-status-published";
    case "Draft":
      return "bg-admin-status-draft-bg text-admin-status-draft";
    default:
      return "bg-admin-status-archived-bg text-admin-status-archived";
  }
}

export function AdminAssessmentsScreen() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [checking, setChecking] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [assessments] = useState([
    ...(typeof window === "undefined"
      ? adminAssessmentsConfig.initialAssessments
      : getAdminAssessments()),
  ]);

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

  const filteredAssessments = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();
    return assessments.filter((assessment) => {
      const matchesStatus =
        activeFilter === "All" || assessment.status === activeFilter;
      const matchesSearch =
        !normalizedSearch ||
        assessment.title.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, assessments, debouncedSearch]);

  const handleLogout = async () => {
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

  const createAssessment = () => {
    const id = createAdminAssessment();
    router.push(`/admin/assessments/${id}`);
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

  const filterCounts = {
    All: assessments.length,
    Published: assessments.filter((item) => item.status === "Published").length,
    Draft: assessments.filter((item) => item.status === "Draft").length,
    Archived: assessments.filter((item) => item.status === "Archived").length,
  };

  return (
    <div className="grid min-h-screen w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-x-clip bg-admin-canvas lg:grid-cols-[286px_minmax(0,1fr)]">
      <AdminSidebar
        onLogout={handleLogout}
        signingOut={signingOut}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <main
        id="main"
        className="w-full min-w-0 max-w-full overflow-x-hidden px-4 pb-8 text-admin-text sm:px-6 lg:px-8"
      >
        <AdminTopbar
          title={adminAssessmentsConfig.breadcrumb}
          adminName={admin?.name}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <div className="mx-auto w-full min-w-0 max-w-[1500px]">
          <section className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-sans text-[24px] leading-tight font-bold tracking-[-0.03em] text-admin-navy sm:text-[30px]">
                {adminAssessmentsConfig.title}
              </h1>
              <p className="mt-1 text-[13px] text-admin-muted">
                {adminAssessmentsConfig.description}
              </p>
            </div>
            <button
              type="button"
              onClick={createAssessment}
              className="inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface transition-colors hover:bg-admin-assessment-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold"
            >
              <Plus className="size-4" />
              {adminAssessmentsConfig.newAssessmentLabel}
            </button>
          </section>

          <section aria-label="Assessments" className="w-full min-w-0">
            <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-admin-subtle lg:flex-1">
                <Search className="size-4 shrink-0" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={adminAssessmentsConfig.searchPlaceholder}
                  aria-label={adminAssessmentsConfig.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-admin-text-strong outline-none placeholder:text-admin-subtle"
                />
              </label>

              <div
                role="tablist"
                aria-label="Filter assessments by status"
                className="flex shrink-0 flex-wrap gap-2"
              >
                {adminAssessmentsConfig.filters.map((filter) => {
                  const selected = activeFilter === filter.status;
                  return (
                    <button
                      key={filter.status}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveFilter(filter.status)}
                      className={cn(
                        "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition-colors",
                        selected
                          ? "border-admin-filter-active bg-admin-filter-active text-admin-filter-active-text"
                          : "border-admin-border-strong bg-admin-surface text-admin-text-strong hover:bg-admin-soft",
                      )}
                    >
                      {filter.label}
                      <span className="text-[10px] opacity-75">
                        ({filterCounts[filter.status]})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-admin-border-strong bg-admin-surface">
              <div
                aria-label="Assessments table"
                role="region"
                tabIndex={0}
                className="admin-table-scroll-region w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch]"
              >
                <table className="w-max min-w-[820px] table-fixed border-collapse text-left">
                  <thead className="bg-admin-surface text-[11px] font-medium text-admin-muted">
                    <tr>
                      {adminAssessmentsConfig.columns.map((column) => (
                        <th
                          key={column}
                          className={cn(
                            "border-b border-admin-border-subtle px-2 py-3 font-medium sm:px-4",
                            column === "Assessment" && "w-[220px]",
                            column === "Status" && "w-[120px]",
                            column === "Content" && "w-[190px]",
                            column === "Responses" && "w-[110px]",
                            column === "Last edited" && "w-[140px]",
                          )}
                        >
                          {column}
                        </th>
                      ))}
                      <th className="w-[76px] border-b border-admin-border-subtle px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-admin-border-subtle">
                    {filteredAssessments.length ? (
                      filteredAssessments.map((assessment) => (
                        <tr
                          key={assessment.id}
                          className="text-[12px] text-admin-text-strong"
                        >
                          <td className="px-2 py-3.5 font-medium text-admin-assessment-text sm:px-4">
                            <Link
                              href={`/admin/assessments/${assessment.id}`}
                              className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-admin-info"
                            >
                              {assessment.title}
                            </Link>
                          </td>
                          <td className="px-2 py-3.5 sm:px-4">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
                                statusStyle(assessment.status),
                              )}
                            >
                              {assessment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-admin-text">
                            {assessment.questions} questions ·{" "}
                            {assessment.sections} sections
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-admin-muted">
                            {assessment.responses}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-admin-muted">
                            {assessment.lastEdited}
                          </td>
                          <td className="w-[64px] px-2 py-3.5 text-right sm:w-[76px] sm:px-4">
                            <Link
                              href={`/admin/assessments/${assessment.id}`}
                              className="inline-flex h-9 items-center rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[11px] font-medium text-admin-assessment-text hover:bg-admin-soft"
                            >
                              {adminAssessmentsConfig.editLabel}
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={adminAssessmentsConfig.columns.length + 1}
                          className="px-4 py-12 text-center text-[13px] text-admin-muted"
                        >
                          No assessments match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

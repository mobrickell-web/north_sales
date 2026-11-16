"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Search } from "lucide-react";

import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { AdminTopbar } from "@/components/shared/admin-topbar";
import {
  type AdminAssessment,
  adminAssessmentsConfig,
} from "@/config/admin-assessments";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  createAdminAssessment,
  listAdminAssessments,
  setAdminAssessmentClientPrimary,
} from "@/lib/admin-assessments";
import {
  type AdminProfile,
  adminLogout,
  adminProfile,
  clearSession,
  hasSession,
  isSuperAdmin,
} from "@/lib/auth-api";
import { cn } from "@/lib/utils";

const LOGIN_PATH = "/login";

function errorMessage(cause: unknown, fallback: string) {
  return cause instanceof Error && cause.message ? cause.message : fallback;
}

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
  const [assessments, setAssessments] = useState<AdminAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [creating, setCreating] = useState(false);
  const [primaryPendingId, setPrimaryPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const loadAssessments = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setAssessments(await listAdminAssessments());
    } catch (cause) {
      setLoadError(errorMessage(cause, "Could not load assessments."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasSession()) {
      router.replace(LOGIN_PATH);
      return;
    }

    adminProfile()
      .then((profile) => {
        if (!isSuperAdmin(profile)) {
          clearSession();
          router.replace(LOGIN_PATH);
          return;
        }
        setAdmin(profile);
        return loadAssessments();
      })
      .catch(() => {
        clearSession();
        router.replace(LOGIN_PATH);
      })
      .finally(() => setChecking(false));
  }, [loadAssessments, router]);

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
    try {
      await adminLogout();
    } catch {
      // Clear local credentials even if the server is unavailable.
    }
    clearSession();
    router.replace(LOGIN_PATH);
  };

  const createAssessment = async () => {
    setCreating(true);
    setActionError("");
    try {
      const created = await createAdminAssessment();
      router.push(`/assessments/${created.id}`);
    } catch (cause) {
      setActionError(errorMessage(cause, "Could not create an assessment."));
      setCreating(false);
    }
  };

  const setClientFacing = async (
    assessment: AdminAssessment,
    enabled: boolean,
  ) => {
    if (assessment.status !== "Published") return;
    setPrimaryPendingId(assessment.id);
    setActionError("");
    try {
      await setAdminAssessmentClientPrimary(assessment.id, enabled);
      setAssessments((rows) =>
        rows.map((row) => ({
          ...row,
          isClientPrimary: enabled ? row.id === assessment.id : false,
        })),
      );
    } catch (cause) {
      setActionError(
        errorMessage(
          cause,
          enabled
            ? "Could not turn on the client-facing assessment."
            : "Could not turn off the client-facing assessment.",
        ),
      );
    } finally {
      setPrimaryPendingId(null);
    }
  };

  const handleClientFacingToggle = (assessment: AdminAssessment) => {
    if (assessment.status !== "Published") return;
    // OFF allowed (none shown). ON is exclusive — max one primary.
    void setClientFacing(assessment, !assessment.isClientPrimary);
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
    <div className="grid min-h-screen w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] bg-admin-canvas lg:grid-cols-[286px_minmax(0,1fr)]">
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
              disabled={creating}
              className="inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface transition-colors hover:bg-admin-assessment-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              {creating
                ? "Creating…"
                : adminAssessmentsConfig.newAssessmentLabel}
            </button>
          </section>

          {actionError ? (
            <p
              role="alert"
              className="mb-3 rounded-lg border border-admin-logout/30 bg-admin-surface px-3 py-2 text-[12px] text-admin-logout"
            >
              {actionError}
            </p>
          ) : null}

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
                <table className="w-max min-w-[920px] table-fixed border-collapse text-left">
                  <thead className="bg-admin-surface text-[11px] font-medium text-admin-muted">
                    <tr>
                      {adminAssessmentsConfig.columns.map((column) => (
                        <th
                          key={column}
                          className={cn(
                            "border-b border-admin-border-subtle px-2 py-3 font-medium sm:px-4",
                            column === "Assessment" && "w-[220px]",
                            column === "Status" && "w-[160px]",
                            column === "Content" && "w-[190px]",
                            column === "Responses" && "w-[110px]",
                            column === "Last edited" && "w-[140px]",
                          )}
                        >
                          {column}
                        </th>
                      ))}
                      <th className="w-[180px] border-b border-admin-border-subtle px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-admin-border-subtle">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={adminAssessmentsConfig.columns.length + 1}
                          className="px-4 py-12 text-center text-[13px] text-admin-muted"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" />
                            Loading assessments…
                          </span>
                        </td>
                      </tr>
                    ) : loadError ? (
                      <tr>
                        <td
                          colSpan={adminAssessmentsConfig.columns.length + 1}
                          className="px-4 py-12 text-center text-[13px] text-admin-muted"
                        >
                          <p role="alert">{loadError}</p>
                          <button
                            type="button"
                            onClick={() => void loadAssessments()}
                            className="mt-3 inline-flex h-9 cursor-pointer items-center rounded-lg border border-admin-border-strong px-3 text-[12px] font-semibold text-admin-info hover:bg-admin-soft"
                          >
                            Try again
                          </button>
                        </td>
                      </tr>
                    ) : filteredAssessments.length ? (
                      filteredAssessments.map((assessment) => (
                        <tr
                          key={assessment.id}
                          className="text-[12px] text-admin-text-strong"
                        >
                          <td className="px-2 py-3.5 font-medium text-admin-assessment-text sm:px-4">
                            <Link
                              href={`/assessments/${assessment.id}`}
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
                            {assessment.responses ?? "—"}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-admin-muted">
                            {assessment.lastEdited}
                          </td>
                          <td className="px-2 py-3.5 text-right sm:px-4">
                            <div className="inline-flex flex-nowrap items-center justify-end gap-4">
                              {assessment.status === "Published" ? (
                                <div className="inline-flex shrink-0 items-center gap-2">
                                  <span className="text-[10px] font-semibold tracking-[0.04em] text-admin-muted uppercase">
                                    Client
                                  </span>
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={assessment.isClientPrimary}
                                    aria-label={`Client facing: ${assessment.title}`}
                                    title={
                                      assessment.isClientPrimary
                                        ? "Turn off to hide from client dashboard (none will be client-facing)"
                                        : "Turn on to show this assessment on the client dashboard (only one at a time)"
                                    }
                                    disabled={
                                      primaryPendingId === assessment.id
                                    }
                                    onClick={() =>
                                      handleClientFacingToggle(assessment)
                                    }
                                    className={cn(
                                      "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info disabled:cursor-not-allowed",
                                      assessment.isClientPrimary
                                        ? "bg-admin-navy"
                                        : "bg-[#D7DCE3] hover:bg-[#C8CED6]",
                                      primaryPendingId === assessment.id &&
                                        "opacity-60",
                                    )}
                                  >
                                    {primaryPendingId === assessment.id ? (
                                      <Loader2 className="mx-auto size-3 animate-spin text-admin-surface" />
                                    ) : (
                                      <span
                                        aria-hidden
                                        className={cn(
                                          "pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                                          assessment.isClientPrimary
                                            ? "translate-x-4"
                                            : "translate-x-0",
                                        )}
                                      />
                                    )}
                                  </button>
                                </div>
                              ) : null}
                              <Link
                                href={`/assessments/${assessment.id}`}
                                className="inline-flex h-9 shrink-0 items-center rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[11px] font-medium text-admin-assessment-text hover:bg-admin-soft"
                              >
                                {adminAssessmentsConfig.editLabel}
                              </Link>
                            </div>
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

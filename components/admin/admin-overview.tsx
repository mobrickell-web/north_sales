"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  CircleHelp,
  Ellipsis,
  ExternalLink,
  File,
  Filter,
  MoreHorizontal,
  Printer,
  Search,
  Sparkles,
  Star,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import { AdminTopbar } from "@/components/shared/admin-topbar";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  adminOverviewConfig,
  type AdminFindingStatus,
} from "@/config/admin-overview";

const overviewFindings = adminOverviewConfig.findings;
const overviewFindingRows = overviewFindings.rows;
const allFindingsStatus = overviewFindings.allStatusesValue;

function formatDateRange(start: string, end: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);

  if (startDate.getFullYear() === endDate.getFullYear()) {
    const startLabel = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(startDate);
    return `${startLabel} – ${formatter.format(endDate)}`;
  }

  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

function statusStyle(status: AdminFindingStatus) {
  switch (status) {
    case "Completed":
      return "text-admin-success";
    case "In review":
      return "text-admin-info";
    case "In progress":
      return "text-admin-progress";
    case "Ongoing":
      return "text-admin-text";
  }
}

function FindingStatusIcon({ status }: { status: AdminFindingStatus }) {
  if (status === "Completed") {
    return <Check className="size-3.5" />;
  }
  if (status === "In review") {
    return <File className="size-3.5" />;
  }
  if (status === "In progress") {
    return <Clock3 className="size-3.5" />;
  }
  return <RotateCcw className="size-3.5" />;
}

function PriorityMark({ priority }: { priority: "High" | "Medium" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-3 items-end gap-px",
        priority === "High" ? "text-admin-danger" : "text-admin-progress",
      )}
    >
      <span className="h-1 w-[3px] bg-current" />
      <span className="h-2 w-[3px] bg-current" />
      <span className="h-3 w-[3px] bg-current" />
    </span>
  );
}

function StatCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-admin-border bg-admin-soft p-1.5">
      <div className="flex h-8 items-center justify-between px-2 text-[12px] font-medium text-admin-text-strong">
        <span>{title}</span>
        {icon}
      </div>
      <div className="flex min-h-[82px] items-center justify-between rounded-xl border border-admin-border-subtle bg-admin-surface px-3 py-2.5 shadow-admin-card">
        {children}
      </div>
    </section>
  );
}

export function AdminOverviewContent({
  adminName,
  onMenuClick,
}: {
  adminName?: string;
  onMenuClick: () => void;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const [statusFilter, setStatusFilter] = useState<string>(allFindingsStatus);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>(
    () => ({
      start: adminOverviewConfig.client.dateRangeStart,
      end: adminOverviewConfig.client.dateRangeEnd,
    }),
  );
  const [draftDateRange, setDraftDateRange] = useState(dateRange);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const dateRangeRef = useRef<HTMLDivElement>(null);
  const statusTriggerRef = useRef<HTMLButtonElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const [statusMenuPosition, setStatusMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 160,
    maxHeight: 240,
  });
  const { client, sampleNotice, metrics, implementation } = adminOverviewConfig;
  const findings = overviewFindings;
  const currentWeekIndex = implementation.weeks.findIndex(
    (week) => week.current,
  );
  const dateRangeLabel = formatDateRange(dateRange.start, dateRange.end);

  const filteredFindings = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    return overviewFindingRows.filter((finding) => {
      const matchesStatus =
        statusFilter === allFindingsStatus || finding.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        `${finding.question} ${finding.focus} ${finding.owner} ${finding.status}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [debouncedQuery, statusFilter]);

  useEffect(() => {
    if (!dateRangeOpen) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !dateRangeRef.current?.contains(event.target)
      ) {
        setDateRangeOpen(false);
        setDraftDateRange(dateRange);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [dateRange, dateRangeOpen]);

  useEffect(() => {
    if (!statusMenuOpen) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !statusTriggerRef.current?.contains(event.target) &&
        !statusMenuRef.current?.contains(event.target)
      ) {
        setStatusMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [statusMenuOpen]);

  useLayoutEffect(() => {
    if (!statusMenuOpen) {
      return;
    }

    const updateMenuPosition = () => {
      const trigger = statusTriggerRef.current;
      if (!trigger) {
        return;
      }

      const bounds = trigger.getBoundingClientRect();
      const viewportPadding = 12;
      const menuWidth = Math.max(bounds.width, 160);
      const maxHeight = Math.min(240, window.innerHeight - viewportPadding * 2);
      const estimatedMenuHeight = Math.min(
        findings.statusOptions.length * 36 + 8,
        maxHeight,
      );
      const spaceBelow = window.innerHeight - bounds.bottom;
      const openAbove =
        spaceBelow < estimatedMenuHeight + 8 && bounds.top > spaceBelow;
      const left = Math.min(
        Math.max(viewportPadding, bounds.right - menuWidth),
        window.innerWidth - menuWidth - viewportPadding,
      );

      setStatusMenuPosition({
        top: openAbove
          ? Math.max(viewportPadding, bounds.top - estimatedMenuHeight - 6)
          : bounds.bottom + 6,
        left,
        width: menuWidth,
        maxHeight,
      });
    };

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [findings.statusOptions.length, statusMenuOpen]);

  return (
    <main
      id="main"
      className="w-full min-w-0 max-w-full overflow-x-hidden bg-admin-canvas px-4 pb-8 text-admin-text sm:px-6 lg:px-8"
    >
      <AdminTopbar adminName={adminName} onMenuClick={onMenuClick} />

      <div className="mx-auto w-full min-w-0 max-w-[1500px]">
        <section className="flex flex-col justify-between gap-4 py-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-admin-muted uppercase">
              {client.eyebrow}
            </p>
            <h1 className="mt-1 font-sans text-[22px] leading-tight font-bold tracking-[-0.03em] text-admin-navy sm:text-[26px]">
              {client.name}
            </h1>
            <p className="mt-1 text-[12px] text-admin-muted">
              {client.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative" ref={dateRangeRef}>
              <button
                type="button"
                aria-expanded={dateRangeOpen}
                aria-haspopup="dialog"
                onClick={() => {
                  setDraftDateRange(dateRange);
                  setDateRangeOpen((open) => !open);
                }}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[11px] font-medium text-admin-text hover:bg-admin-soft"
              >
                <CalendarDays className="size-3.5" />
                {dateRangeLabel}
                <ChevronDown
                  className={cn(
                    "size-3 transition-transform",
                    dateRangeOpen && "rotate-180",
                  )}
                />
              </button>
              {dateRangeOpen ? (
                <div
                  role="dialog"
                  aria-label="Select date range"
                  className="absolute top-[calc(100%+8px)] left-0 z-40 w-[min(320px,calc(100vw-32px))] rounded-xl border border-admin-border-strong bg-admin-surface p-4 shadow-xl sm:right-0 sm:left-auto"
                >
                  <div className="grid gap-3">
                    <label className="grid gap-1.5 text-[11px] font-medium text-admin-text">
                      Start date
                      <input
                        type="date"
                        value={draftDateRange.start}
                        max={draftDateRange.end || undefined}
                        onChange={(event) =>
                          setDraftDateRange((current) => ({
                            ...current,
                            start: event.target.value,
                          }))
                        }
                        className="h-10 w-full rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[13px] text-admin-text-strong outline-none focus:border-admin-info focus:ring-2 focus:ring-admin-info/15"
                      />
                    </label>
                    <label className="grid gap-1.5 text-[11px] font-medium text-admin-text">
                      End date
                      <input
                        type="date"
                        value={draftDateRange.end}
                        min={draftDateRange.start || undefined}
                        onChange={(event) =>
                          setDraftDateRange((current) => ({
                            ...current,
                            end: event.target.value,
                          }))
                        }
                        className="h-10 w-full rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[13px] text-admin-text-strong outline-none focus:border-admin-info focus:ring-2 focus:ring-admin-info/15"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDraftDateRange(dateRange);
                        setDateRangeOpen(false);
                      }}
                      className="h-9 cursor-pointer rounded-lg border border-admin-border-strong px-3 text-[12px] font-medium text-admin-text hover:bg-admin-soft"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={
                        !draftDateRange.start ||
                        !draftDateRange.end ||
                        draftDateRange.start > draftDateRange.end
                      }
                      onClick={() => {
                        setDateRange(draftDateRange);
                        setDateRangeOpen(false);
                      }}
                      className="h-9 cursor-pointer rounded-lg bg-admin-navy px-3 text-[12px] font-medium text-admin-surface hover:bg-admin-navy-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[11px] font-medium text-admin-text hover:bg-admin-soft"
            >
              <Printer className="size-3.5" />
              {client.printReport}
            </button>
            <button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-admin-navy px-3 text-[11px] font-semibold text-admin-surface hover:bg-admin-navy-hover"
            >
              <Sparkles className="size-3.5" />
              {client.manageEngagement}
            </button>
            <button
              type="button"
              aria-label={client.moreActionsLabel}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-admin-border-strong bg-admin-surface text-admin-text hover:bg-admin-soft"
            >
              <Ellipsis className="size-4" />
            </button>
          </div>
        </section>

        <div className="mb-3 flex flex-col gap-1 rounded-lg border border-admin-warning-border bg-admin-warning-bg px-3 py-2 text-[11px] text-admin-warning-text sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{sampleNotice.message}</p>
            <p>{sampleNotice.action}</p>
          </div>
          <CircleHelp className="hidden size-4 sm:block" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <StatCard
            title={metrics.kpis.title}
            icon={<TrendingUp className="size-3 text-admin-muted" />}
          >
            <div>
              <p className="text-[23px] leading-none font-bold text-admin-navy">
                {metrics.kpis.value}
              </p>
              <p className="mt-1 text-[10px] text-admin-success">
                {metrics.kpis.caption}
              </p>
            </div>
            <svg
              viewBox="0 0 96 40"
              aria-label={metrics.kpis.chartLabel}
              className="h-9 w-[86px]"
            >
              <path
                d={metrics.kpis.chartPath}
                fill="none"
                className="stroke-admin-chart"
                strokeWidth="2"
              />
            </svg>
          </StatCard>
          <StatCard
            title={metrics.targets.title}
            icon={<CircleHelp className="size-3 text-admin-muted" />}
          >
            <div>
              <p className="text-[23px] leading-none font-bold text-admin-navy">
                {metrics.targets.value}
              </p>
              <p className="mt-1 text-[10px] text-admin-progress">
                {metrics.targets.day}{" "}
                <span className="text-admin-muted">
                  {metrics.targets.caption}
                </span>
              </p>
            </div>
            <div className="h-1 w-14 rounded-full bg-admin-chart-bar" />
          </StatCard>
          <StatCard
            title={metrics.actions.title}
            icon={<ExternalLink className="size-3 text-admin-muted" />}
          >
            <div>
              <p className="text-[23px] leading-none font-bold text-admin-navy">
                {metrics.actions.value}
              </p>
              <a
                href="#assessment-implementation"
                className="mt-1 inline-block text-[10px] font-medium text-admin-info hover:underline"
              >
                {metrics.actions.link}
              </a>
            </div>
            <div className="flex gap-1">
              <span className="h-5 w-2.5 rounded-sm bg-admin-chart-pale" />
              <span className="h-5 w-2.5 rounded-sm bg-admin-chart-pale" />
              <span className="h-5 w-2.5 rounded-sm bg-admin-chart-pale" />
            </div>
          </StatCard>
        </div>

        <section className="mt-3 w-full min-w-0 rounded-2xl border border-admin-border bg-admin-soft p-1.5">
          <div className="flex min-h-9 flex-wrap items-center justify-between gap-2 px-2 pb-1">
            <h2 className="flex items-center gap-2 text-[12px] font-medium text-admin-text">
              <Star className="size-3.5" />
              {implementation.title}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-admin-success-border bg-admin-surface px-2 py-1 text-[10px] font-medium text-admin-success">
              <span className="size-1.5 rounded-full bg-admin-success" />
              {implementation.status}
            </span>
          </div>
          <div className="rounded-xl border border-admin-border-subtle bg-admin-surface p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[21px] leading-none font-bold text-admin-navy">
                {implementation.currentDay}
              </p>
              <p className="text-[10px] text-admin-muted">
                {implementation.duration}{" "}
                <span className="font-semibold text-admin-success">
                  {implementation.progressPercent}
                </span>{" "}
                {implementation.progressDescription}
              </p>
              <p className="ml-auto hidden text-[10px] text-admin-muted lg:block">
                {implementation.description}
              </p>
            </div>
            <div className="relative mt-3 flex h-[230px] items-end gap-1.5 border-b border-admin-border-subtle px-2 pr-7 sm:gap-3 sm:px-3 sm:pr-8">
              <div className="pointer-events-none absolute inset-x-0 top-[44%] border-t border-dashed border-admin-grid" />
              {implementation.weeks.map((week, index) => (
                <div
                  key={week.label}
                  className={cn(
                    "relative flex min-w-0 flex-1 flex-col items-center justify-end",
                    week.current ? "z-20" : "z-10",
                  )}
                >
                  {week.current ? (
                    <span className="absolute bottom-[calc(100%+7px)] z-30 whitespace-nowrap rounded bg-admin-navy px-2 py-1 text-[9px] font-semibold text-admin-surface">
                      {implementation.currentWeekLabel}
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "w-full max-w-[84px] rounded-md border",
                      week.current
                        ? "border-admin-navy bg-admin-navy"
                        : index < currentWeekIndex
                          ? "border-transparent bg-admin-chart-completed"
                          : "border-dashed border-admin-border-chart bg-admin-soft",
                    )}
                    style={{ height: `${week.height}px` }}
                  />
                  <span
                    className={cn(
                      "mt-1.5 text-[9px] text-admin-muted",
                      week.current && "font-bold text-admin-navy",
                    )}
                  >
                    {week.label}
                  </span>
                </div>
              ))}
              <div className="absolute top-0 right-0 flex h-full flex-col justify-between py-1 text-[9px] text-admin-subtle">
                {implementation.chartScale.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[9px] text-admin-muted">
              <span>{implementation.startedLabel}</span>
              <span className="flex items-center gap-3">
                {implementation.legend.map((item, index) => (
                  <span
                    key={item}
                    className={index === 1 ? "text-admin-navy" : undefined}
                  >
                    {index === 2 ? "◌" : "■"} {item}
                  </span>
                ))}
              </span>
              <span>{implementation.endsLabel}</span>
            </div>
          </div>
        </section>

        <section
          id="assessment-implementation"
          className="mt-3 w-full min-w-0 overflow-hidden rounded-2xl border border-admin-border bg-admin-soft p-1"
        >
          <div className="flex flex-col gap-3 px-2.5 pt-2.5 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 text-[13px] font-medium text-admin-text-strong">
              <CircleHelp className="size-3.5" />
              {findings.title}
            </h2>
            <div className="flex w-full min-w-0 flex-nowrap items-center gap-2 sm:w-auto">
              <label className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-2.5 text-admin-subtle sm:w-[212px] sm:flex-none">
                <Search className="size-3.5 shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={findings.searchPlaceholder}
                  aria-label={findings.searchLabel}
                  className="min-w-0 flex-1 bg-transparent text-[12px] text-admin-text-strong outline-none placeholder:text-admin-subtle"
                />
              </label>
              <div className="relative">
                <button
                  ref={statusTriggerRef}
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={statusMenuOpen}
                  aria-controls="finding-status-options"
                  aria-label={findings.statusFilterLabel}
                  onClick={() => setStatusMenuOpen((open) => !open)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setStatusMenuOpen(false);
                    }
                  }}
                  className="flex h-8 w-[132px] min-w-0 shrink-0 cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-2 text-[12px] font-medium text-admin-text shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info sm:w-auto sm:min-w-[164px] sm:px-3"
                >
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    <Filter className="size-3.5 text-admin-muted" />
                    <span className="truncate">{statusFilter}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-admin-muted transition-transform",
                      statusMenuOpen && "rotate-180",
                    )}
                  />
                </button>
                {statusMenuOpen && typeof document !== "undefined"
                  ? createPortal(
                      <div
                        ref={statusMenuRef}
                        id="finding-status-options"
                        role="listbox"
                        aria-label={findings.statusFilterLabel}
                        style={{
                          position: "fixed",
                          top: statusMenuPosition.top,
                          left: statusMenuPosition.left,
                          width: statusMenuPosition.width,
                          maxHeight: statusMenuPosition.maxHeight,
                        }}
                        className="z-[100] overflow-y-auto rounded-lg border border-admin-border-strong bg-admin-surface p-1 shadow-lg"
                      >
                        {findings.statusOptions.map((status) => (
                          <button
                            key={status}
                            type="button"
                            role="option"
                            aria-selected={statusFilter === status}
                            onClick={() => {
                              setStatusFilter(status);
                              setStatusMenuOpen(false);
                            }}
                            className={cn(
                              "block w-full cursor-pointer rounded-md px-3 py-2 text-left text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-admin-info",
                              statusFilter === status
                                ? "bg-admin-navy font-medium text-admin-surface"
                                : "text-admin-text-strong hover:bg-admin-soft",
                            )}
                          >
                            {status}
                          </button>
                        ))}
                      </div>,
                      document.body,
                    )
                  : null}
              </div>
            </div>
          </div>
          <div
            aria-label="Assessment implementation findings table"
            role="region"
            tabIndex={0}
            className="admin-table-scroll-region w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-xl border border-admin-border-strong bg-admin-surface [-webkit-overflow-scrolling:touch]"
          >
            <table className="w-max min-w-[960px] table-fixed border-collapse border-spacing-0 bg-admin-surface text-left">
              <thead className="bg-admin-soft text-[12px] font-medium text-admin-text">
                <tr>
                  {findings.columns.map((column) => (
                    <th
                      key={column}
                      className={cn(
                        "px-2 py-2.5 font-medium sm:px-3",
                        column === "Step" && "w-12",
                        column === "Focus" && "w-[190px]",
                        column === "Priority" && "w-[92px]",
                        column === "Owner" && "w-[150px]",
                        column === "Status" && "w-[100px] sm:w-[120px]",
                        column === "Updated" && "w-[120px]",
                      )}
                    >
                      {column}
                    </th>
                  ))}
                  <th className="w-9 px-1 py-2.5 font-medium">
                    <span className="sr-only">
                      {findings.actionsColumnLabel}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-admin-surface">
                {filteredFindings.length ? (
                  filteredFindings.map((finding, index) => (
                    <tr
                      key={finding.step}
                      className="text-[12px] text-admin-text"
                    >
                      <td
                        className={cn(
                          "w-12 border-t border-admin-border-subtle px-2 py-3.5 sm:px-3",
                          index === 0 && "border-t-0",
                        )}
                      >
                        <span className="inline-flex min-w-[24px] items-center justify-center rounded-md bg-admin-step px-1.5 py-1 text-[11px] font-semibold text-admin-text-strong">
                          {finding.step}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "border-t border-admin-border-subtle px-2 py-3.5 font-medium break-words text-admin-text-strong sm:px-3",
                          index === 0 && "border-t-0",
                        )}
                      >
                        {finding.question}
                      </td>
                      <td
                        className={cn(
                          "border-t border-admin-border-subtle px-3 py-3.5 whitespace-nowrap",
                          index === 0 && "border-t-0",
                        )}
                      >
                        {finding.focus}
                      </td>
                      <td
                        className={cn(
                          "border-t border-admin-border-subtle px-3 py-3.5",
                          index === 0 && "border-t-0",
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          <PriorityMark priority={finding.priority} />
                          {finding.priority}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "border-t border-admin-border-subtle px-3 py-3.5 whitespace-nowrap",
                          index === 0 && "border-t-0",
                        )}
                      >
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <span className="flex size-[22px] items-center justify-center rounded-full bg-admin-avatar text-[9px] font-bold text-admin-text">
                            {finding.owner
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </span>
                          {finding.owner}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "border-t border-admin-border-subtle px-2 py-3.5 sm:px-3",
                          index === 0 && "border-t-0",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 whitespace-nowrap font-medium",
                            statusStyle(finding.status),
                          )}
                        >
                          <FindingStatusIcon status={finding.status} />
                          {finding.status}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "border-t border-admin-border-subtle px-3 py-3.5 whitespace-nowrap",
                          index === 0 && "border-t-0",
                        )}
                      >
                        {finding.updated}
                      </td>
                      <td
                        className={cn(
                          "w-9 border-t border-admin-border-subtle px-1 py-3.5",
                          index === 0 && "border-t-0",
                        )}
                      >
                        <button
                          type="button"
                          aria-label={`${findings.moreActionsPrefix} ${finding.question}`}
                          className="cursor-pointer rounded p-1 text-admin-subtle hover:bg-admin-soft"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-8 text-center text-[12px] text-admin-muted"
                    >
                      {findings.noResults}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-6 flex justify-end">
          <Link
            href="/admin/appointments"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-admin-navy px-4 text-[13px] font-semibold text-white transition-colors hover:bg-admin-navy-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info"
          >
            View all appointments
          </Link>
        </div>
      </div>
    </main>
  );
}

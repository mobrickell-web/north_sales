"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  CalendarClock,
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flag,
  Loader2,
  MoreVertical,
  NotebookPen,
  Pencil,
  Phone,
  Download,
  Plus,
  RefreshCw,
  Search,
  StickyNote,
  Trash2,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";

import { AdminAlert } from "@/components/admin/admin-ui";
import { AdminWebsiteBookingQueue } from "@/components/admin/admin-website-booking-queue";
import { LeadCrmPanel } from "@/components/leads/lead-crm-panel";
import {
  AddLeadNoteDialog,
  AssignLeadDialog,
  DeleteLeadDialog,
  LeadFormDialog,
  LeadStatusDialog,
  ViewLeadNotesDialog,
} from "@/components/leads/lead-dialogs";
import { LeadsShell } from "@/components/leads/leads-shell";
import { AdminApiError } from "@/lib/auth-api";
import {
  LEAD_LIST_FILTER_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type Lead,
  type LeadCrmTotals,
  type LeadListFilter,
  type LeadOwner,
  type LeadStatus,
  type ListLeadsParams,
  downloadLeadsCsv,
  getLeadTotals,
  leadContactPerson,
  leadDisplayName,
  leadListPhone,
  leadOwnerLabel,
  listLeadAssignees,
  listLeads,
} from "@/lib/leads-api";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** Admin /crm — match /appointments Rows control (10 / 20 / 50). */
const CRM_PAGE_SIZES = [10, 20, 50] as const;

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function utcDayStartMs(now = new Date()) {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

/** Uses synced lead.followUpAt (next open follow-up) for list highlighting. */
function isFollowUpOverdue(lead: Lead) {
  if (!lead.followUpAt) return false;
  return new Date(lead.followUpAt).getTime() < utcDayStartMs();
}

function isFollowUpDueToday(lead: Lead) {
  if (!lead.followUpAt) return false;
  const due = new Date(lead.followUpAt).getTime();
  const start = utcDayStartMs();
  return due >= start && due < start + 24 * 60 * 60 * 1000;
}

function loadErrorMessage(cause: unknown, isAdmin: boolean) {
  if (cause instanceof AdminApiError && cause.status === 403) {
    return isAdmin
      ? "Master Admin access is required for CRM assignment."
      : "Your account doesn't have access to the leads dashboard.";
  }
  return cause instanceof Error && cause.message
    ? cause.message
    : isAdmin
      ? "Could not load CRM leads."
      : "Could not load your leads.";
}

function StatCard({
  title,
  value,
  icon,
  selected,
  onClick,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <div className="flex h-8 items-center justify-between gap-2 px-2 text-[12px] font-medium text-admin-text-strong">
        <span className="truncate">{title}</span>
        {icon}
      </div>
      <div className="flex min-h-[64px] items-center rounded-xl border border-admin-border-subtle bg-admin-surface px-3 py-2.5 shadow-admin-card">
        <span className="text-[28px] leading-none font-bold text-admin-navy">
          {value}
        </span>
      </div>
    </>
  );

  if (!onClick) {
    return (
      <section className="overflow-hidden rounded-2xl border border-admin-border bg-admin-soft p-1.5">
        {inner}
      </section>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "overflow-hidden rounded-2xl border bg-admin-soft p-1.5 text-left transition-colors",
        selected
          ? "border-admin-gold ring-2 ring-admin-gold/30"
          : "border-admin-border hover:border-admin-border-strong",
      )}
    >
      {inner}
    </button>
  );
}

function StatusFilterDropdown({
  value,
  onChange,
}: {
  value: LeadStatus | "";
  onChange: (value: LeadStatus | "") => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const label = value ? LEAD_STATUS_LABELS[value] : "All statuses";

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  return (
    <div
      ref={dropdownRef}
      className="relative min-w-[180px] flex-1 sm:flex-none sm:w-[220px]"
    >
      <button
        type="button"
        aria-label="Filter by status"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="lead-status-filter-options"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-left text-[13px] font-medium text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info"
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-admin-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id="lead-status-filter-options"
          role="listbox"
          aria-label="Current Status"
          className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full overflow-y-auto rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
        >
          <button
            type="button"
            role="option"
            aria-selected={value === ""}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={cn(
              "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
              value === ""
                ? "bg-admin-navy font-medium text-admin-surface"
                : "text-admin-text-strong hover:bg-admin-soft",
            )}
          >
            All statuses
          </button>
          {LEAD_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              role="option"
              aria-selected={status === value}
              onClick={() => {
                onChange(status);
                setOpen(false);
              }}
              className={cn(
                "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
                status === value
                  ? "bg-admin-navy font-medium text-admin-surface"
                  : "text-admin-text-strong hover:bg-admin-soft",
              )}
            >
              {LEAD_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <span className="text-admin-subtle">{children}</span>;
}

function LeadRowActions({
  lead,
  showAssign,
  onCrm,
  onAssign,
  onAddNotes,
  onViewNotes,
  onLeadStatus,
  onEdit,
  onDelete,
}: {
  lead: Lead;
  showAssign: boolean;
  onCrm: () => void;
  onAssign: () => void;
  onAddNotes: () => void;
  onViewNotes: () => void;
  onLeadStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const label = leadDisplayName(lead);

  const placeMenu = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuWidth = 196;
    const itemCount = showAssign ? 7 : 6;
    const menuHeight = 8 + itemCount * 40;
    let top = rect.bottom + 6;
    let left = rect.right - menuWidth;
    if (top + menuHeight > window.innerHeight - 8) {
      top = Math.max(8, rect.top - menuHeight - 6);
    }
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    setMenuPos({ top, left });
  }, [showAssign]);

  useEffect(() => {
    if (!open) return;
    placeMenu();
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const closeOnKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnScroll = () => setOpen(false);
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnKey);
    window.addEventListener("resize", closeOnScroll);
    window.addEventListener("scroll", closeOnScroll, true);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnKey);
      window.removeEventListener("resize", closeOnScroll);
      window.removeEventListener("scroll", closeOnScroll, true);
    };
  }, [open, placeMenu]);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div className="flex justify-end">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Actions for ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => {
            const next = !current;
            if (next) placeMenu();
            return next;
          });
        }}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-admin-border-strong bg-admin-surface text-admin-assessment-text hover:bg-admin-soft"
      >
        <MoreVertical className="size-4" />
      </button>
      {open && menuPos
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label={`Actions for ${label}`}
              style={{ top: menuPos.top, left: menuPos.left }}
              className="fixed z-[80] w-[196px] overflow-hidden rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => run(onCrm)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-admin-text-strong hover:bg-admin-soft"
              >
                <NotebookPen className="size-3.5 shrink-0 text-admin-muted" />
                CRM
              </button>
              {showAssign ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => run(onAssign)}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-admin-text-strong hover:bg-admin-soft"
                >
                  <UserPlus className="size-3.5 shrink-0 text-admin-muted" />
                  {lead.owner ? "Reassign" : "Assign"}
                </button>
              ) : null}
              <button
                type="button"
                role="menuitem"
                onClick={() => run(onAddNotes)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-admin-text-strong hover:bg-admin-soft"
              >
                <StickyNote className="size-3.5 shrink-0 text-admin-muted" />
                Add notes
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => run(onViewNotes)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-admin-text-strong hover:bg-admin-soft"
              >
                <Eye className="size-3.5 shrink-0 text-admin-muted" />
                View notes
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => run(onLeadStatus)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-admin-text-strong hover:bg-admin-soft"
              >
                <Flag className="size-3.5 shrink-0 text-admin-muted" />
                Lead status
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => run(onEdit)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-admin-text-strong hover:bg-admin-soft"
              >
                <Pencil className="size-3.5 shrink-0 text-admin-muted" />
                Edit
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => run(onDelete)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] text-[#8f2d2d] hover:bg-[#fdf3f3]"
              >
                <Trash2 className="size-3.5 shrink-0" />
                Delete
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function OwnerFilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: LeadOwner[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const label =
    value === ""
      ? "All reps"
      : (options.find((item) => item.id === value)?.name ?? "All reps");

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  return (
    <div
      ref={dropdownRef}
      className="relative min-w-[180px] flex-1 sm:flex-none sm:w-[220px]"
    >
      <button
        type="button"
        aria-label="Filter by assigned rep"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="lead-owner-filter-options"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-left text-[13px] font-medium text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info"
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-admin-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id="lead-owner-filter-options"
          role="listbox"
          aria-label="Assigned rep"
          className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full overflow-y-auto rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
        >
          <button
            type="button"
            role="option"
            aria-selected={value === ""}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={cn(
              "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
              value === ""
                ? "bg-admin-navy font-medium text-admin-surface"
                : "text-admin-text-strong hover:bg-admin-soft",
            )}
          >
            All reps
          </button>
          {options.map((assignee) => (
            <button
              key={assignee.id}
              type="button"
              role="option"
              aria-selected={assignee.id === value}
              onClick={() => {
                onChange(assignee.id);
                setOpen(false);
              }}
              className={cn(
                "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
                assignee.id === value
                  ? "bg-admin-navy font-medium text-admin-surface"
                  : "text-admin-text-strong hover:bg-admin-soft",
              )}
            >
              {assignee.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function LeadsDashboard({
  name,
  email,
  variant = "rep",
}: {
  name?: string;
  email?: string;
  variant?: "rep" | "admin";
}) {
  const isAdmin = variant === "admin";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [assignees, setAssignees] = useState<LeadOwner[]>([]);
  const [totals, setTotals] = useState<LeadCrmTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [listFilter, setListFilter] = useState<LeadListFilter | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState<Lead | null>(null);
  const [assigning, setAssigning] = useState<Lead | null>(null);
  const [addingNotes, setAddingNotes] = useState<Lead | null>(null);
  const [viewingNotes, setViewingNotes] = useState<Lead | null>(null);
  const [statusLead, setStatusLead] = useState<Lead | null>(null);
  const [crmLead, setCrmLead] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);
  const [crmTake, setCrmTake] = useState<(typeof CRM_PAGE_SIZES)[number]>(10);
  const [crmSkip, setCrmSkip] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(queryInput.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [queryInput]);

  const listParams = useCallback((): ListLeadsParams => {
    const params: ListLeadsParams = {};
    if (debouncedQuery) params.q = debouncedQuery;
    if (statusFilter) params.status = statusFilter;
    if (isAdmin && ownerFilter) params.ownerId = ownerFilter;
    if (listFilter) params.filter = listFilter;
    return params;
  }, [debouncedQuery, statusFilter, ownerFilter, listFilter, isAdmin]);

  const crmTotal = leads.length;
  const crmPages = Math.max(1, Math.ceil(crmTotal / crmTake) || 1);
  const safeCrmSkip = Math.min(crmSkip, Math.max(0, (crmPages - 1) * crmTake));
  const crmPage = Math.floor(safeCrmSkip / crmTake) + 1;
  const visibleLeads = isAdmin
    ? leads.slice(safeCrmSkip, safeCrmSkip + crmTake)
    : leads;

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const [nextLeads, nextTotals, nextAssignees] = await Promise.all([
          listLeads(listParams()),
          getLeadTotals(),
          listLeadAssignees(),
        ]);
        setLeads(nextLeads);
        setTotals(nextTotals);
        setAssignees(nextAssignees);
      } else {
        const [nextLeads, nextTotals] = await Promise.all([
          listLeads(listParams()),
          getLeadTotals(),
        ]);
        setLeads(nextLeads);
        setTotals(nextTotals);
      }
      setError("");
    } catch (cause) {
      setError(loadErrorMessage(cause, isAdmin));
    } finally {
      setLoading(false);
    }
  }, [listParams, isAdmin]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDashboard(), 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const refreshTotals = useCallback(() => {
    void getLeadTotals()
      .then(setTotals)
      .catch(() => undefined);
  }, []);

  const toggleListFilter = (filter: LeadListFilter) => {
    setListFilter((current) => (current === filter ? null : filter));
    setCrmSkip(0);
    setNotice("");
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
    setNotice("");
  };

  const handleExport = async () => {
    setExporting(true);
    setNotice("");
    try {
      await downloadLeadsCsv(listParams());
      setNotice("CSV export downloaded.");
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Could not export leads. Please try again.",
      );
    } finally {
      setExporting(false);
    }
  };

  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setFormOpen(true);
    setNotice("");
  };

  const openCrm = (lead: Lead) => {
    setCrmLead(lead);
    setNotice("");
  };

  const handleSaved = (lead: Lead, mode: "created" | "updated") => {
    setFormOpen(false);
    setNotice(
      mode === "created"
        ? isAdmin
          ? lead.owner
            ? `${leadDisplayName(lead)} was added and assigned to ${leadOwnerLabel(lead)}.`
            : `${leadDisplayName(lead)} was added as Unassigned.`
          : `${leadDisplayName(lead)} was added.`
        : `${leadDisplayName(lead)} was updated.`,
    );
    void loadDashboard();
  };

  const handleAssigned = (lead: Lead) => {
    setAssigning(null);
    setNotice(`${leadDisplayName(lead)} assigned to ${leadOwnerLabel(lead)}.`);
    void loadDashboard();
  };

  const handleDeleted = (lead: Lead) => {
    setDeleting(null);
    if (crmLead?.id === lead.id) setCrmLead(null);
    if (assigning?.id === lead.id) setAssigning(null);
    setNotice(`${leadDisplayName(lead)} was deleted.`);
    void loadDashboard();
  };

  const handleCrmLeadUpdated = (lead: Lead) => {
    setCrmLead(lead);
    setLeads((current) =>
      current.map((item) => (item.id === lead.id ? lead : item)),
    );
    refreshTotals();
  };

  const handleNoteSaved = (lead: Lead) => {
    setAddingNotes(null);
    setNotice(`Note added for ${leadDisplayName(lead)}.`);
    void loadDashboard();
  };

  const handleStatusSaved = (lead: Lead) => {
    setStatusLead(null);
    setLeads((current) =>
      current.map((item) => (item.id === lead.id ? lead : item)),
    );
    setNotice(
      `Status for ${leadDisplayName(lead)} updated to ${LEAD_STATUS_LABELS[lead.status]}.`,
    );
    refreshTotals();
  };

  const rowActions = (lead: Lead) => (
    <LeadRowActions
      lead={lead}
      showAssign={isAdmin}
      onCrm={() => openCrm(lead)}
      onAssign={() => {
        setAssigning(lead);
        setNotice("");
      }}
      onAddNotes={() => {
        setAddingNotes(lead);
        setNotice("");
      }}
      onViewNotes={() => {
        setViewingNotes(lead);
        setNotice("");
      }}
      onLeadStatus={() => {
        setStatusLead(lead);
        setNotice("");
      }}
      onEdit={() => openEdit(lead)}
      onDelete={() => {
        setDeleting(lead);
        setNotice("");
      }}
    />
  );

  const totalsLoading = loading && !totals;
  const hasActiveFilters =
    Boolean(listFilter) ||
    Boolean(statusFilter) ||
    Boolean(isAdmin && ownerFilter) ||
    Boolean(debouncedQuery);
  const emptyBecauseFilters =
    !loading && leads.length === 0 && hasActiveFilters;
  const canAddLead = true;

  const rowTone = (lead: Lead) => {
    if (isFollowUpOverdue(lead) || listFilter === "follow_ups_overdue") {
      return "bg-[#fdf3f3]";
    }
    if (isFollowUpDueToday(lead) || listFilter === "follow_ups_due_today") {
      return "bg-[#fff8eb]";
    }
    return "";
  };

  const content = (
    <>
      {isAdmin ? <AdminWebsiteBookingQueue /> : null}
      <section
        className={cn(
          "flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
          isAdmin ? "pb-5" : "py-5",
        )}
      >
        <div>
          <h1 className="font-sans text-[24px] leading-tight font-bold tracking-[-0.03em] text-admin-navy sm:text-[30px]">
            {isAdmin ? "CRM" : "Leads"}
          </h1>
          <p className="mt-1 text-[13px] text-admin-muted">
            {isAdmin
              ? "View all leads, assign Sales Representatives, and open CRM detail."
              : "Manage prospects, activity notes, follow-ups, and manual appointments."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={exporting || loading}
            className="inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-4 text-[12px] font-semibold text-admin-text-strong transition-colors hover:bg-admin-soft disabled:cursor-wait disabled:opacity-60"
          >
            {exporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
          <button
            type="button"
            onClick={openCreate}
            disabled={!canAddLead}
            className="inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface transition-colors hover:bg-admin-assessment-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Add lead
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active leads"
          value={totalsLoading ? "—" : (totals?.activeLeads ?? 0)}
          icon={<UsersRound className="size-3.5 shrink-0 text-admin-muted" />}
          selected={listFilter === "active"}
          onClick={() => toggleListFilter("active")}
        />
        <StatCard
          title="Follow-ups due today"
          value={totalsLoading ? "—" : (totals?.followUpsDueToday ?? 0)}
          icon={<CalendarPlus className="size-3.5 shrink-0 text-admin-muted" />}
          selected={listFilter === "follow_ups_due_today"}
          onClick={() => toggleListFilter("follow_ups_due_today")}
        />
        <StatCard
          title="Overdue follow-ups"
          value={totalsLoading ? "—" : (totals?.followUpsOverdue ?? 0)}
          icon={
            <AlertTriangle className="size-3.5 shrink-0 text-admin-muted" />
          }
          selected={listFilter === "follow_ups_overdue"}
          onClick={() => toggleListFilter("follow_ups_overdue")}
        />
        <StatCard
          title="Upcoming appointments"
          value={totalsLoading ? "—" : (totals?.upcomingAppointments ?? 0)}
          icon={
            <CalendarClock className="size-3.5 shrink-0 text-admin-muted" />
          }
          selected={listFilter === "upcoming_appointments"}
          onClick={() => toggleListFilter("upcoming_appointments")}
        />
      </div>
      <p className="mt-2 text-[11px] text-admin-muted">
        {isAdmin
          ? "Click a total to filter. Appointments here are manual CRM entries only — website booking form submissions stay in Appointments."
          : "Click a total to filter the list. Appointment totals include only appointments you schedule on a lead — not website booking form submissions."}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {error ? (
          <AdminAlert>
            <span className="flex flex-wrap items-center justify-between gap-3">
              {error}
              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold underline underline-offset-2"
              >
                <RefreshCw className="size-3.5" />
                Try again
              </button>
            </span>
          </AdminAlert>
        ) : null}
        {notice ? <AdminAlert tone="info">{notice}</AdminAlert> : null}
        {isAdmin && assignees.length === 0 && !loading ? (
          <AdminAlert tone="info">
            Create at least one Sales Representative in Access Management before
            adding or assigning leads.
          </AdminAlert>
        ) : null}
      </div>

      <section
        aria-label={isAdmin ? "All leads" : "Leads"}
        className="mt-4 w-full min-w-0"
      >
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-row">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-admin-subtle">
            <Search className="size-4 shrink-0" />
            <input
              type="search"
              value={queryInput}
              onChange={(event) => {
                setQueryInput(event.target.value);
                setCrmSkip(0);
              }}
              placeholder={
                isAdmin
                  ? "Search company, name, email, phone…"
                  : "Search by company, name, email, phone, address, or notes"
              }
              aria-label="Search leads"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-admin-text-strong outline-none placeholder:text-admin-subtle"
            />
          </label>
          <StatusFilterDropdown
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCrmSkip(0);
              setNotice("");
            }}
          />
          {isAdmin ? (
            <OwnerFilterDropdown
              value={ownerFilter}
              options={assignees}
              onChange={(value) => {
                setOwnerFilter(value);
                setCrmSkip(0);
                setNotice("");
              }}
            />
          ) : null}
        </div>

        {listFilter ? (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-admin-border-strong bg-admin-soft px-3 py-1 text-[12px] font-medium text-admin-text-strong">
              {LEAD_LIST_FILTER_LABELS[listFilter]}
              <button
                type="button"
                aria-label="Clear list filter"
                onClick={() => {
                  setListFilter(null);
                  setCrmSkip(0);
                }}
                className="rounded-full p-0.5 hover:bg-admin-surface"
              >
                <X className="size-3.5" />
              </button>
            </span>
          </div>
        ) : null}

        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-admin-border-strong bg-admin-surface px-4 py-14 text-[13px] text-admin-muted">
            <Loader2 className="size-4 animate-spin" />
            Loading leads…
          </div>
        ) : emptyBecauseFilters ? (
          <div className="rounded-xl border border-admin-border-strong bg-admin-surface px-4 py-12 text-center text-[13px] text-admin-muted">
            No leads match the current filters.
            <button
              type="button"
              onClick={() => {
                setListFilter(null);
                setStatusFilter("");
                setOwnerFilter("");
                setQueryInput("");
                setDebouncedQuery("");
                setCrmSkip(0);
              }}
              className="mt-3 block w-full cursor-pointer text-[12px] font-semibold text-admin-navy underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : leads.length === 0 ? (
          error ? null : (
            <div className="rounded-xl border border-dashed border-admin-border-strong bg-admin-surface px-6 py-14 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-admin-soft text-admin-gold-deep">
                <UsersRound className="size-5" />
              </span>
              <p className="mt-3 text-[15px] font-semibold text-admin-text-strong">
                No leads yet
              </p>
              <p className="mt-1 text-[13px] text-admin-muted">
                {isAdmin
                  ? "Add a prospect — assign a specialist now, or leave it Unassigned."
                  : "Add your first prospect to start building your pipeline."}
              </p>
              <button
                type="button"
                onClick={openCreate}
                disabled={!canAddLead}
                className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="size-4" />
                Add lead
              </button>
            </div>
          )
        ) : (
          <>
            <ul className="flex flex-col gap-3 md:hidden">
              {visibleLeads.map((lead) => {
                const contactPerson = leadContactPerson(lead);
                const phone = leadListPhone(lead);
                return (
                  <li
                    key={lead.id}
                    className={cn(
                      "rounded-xl border border-admin-border-strong p-4",
                      rowTone(lead) || "bg-admin-surface",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="min-w-0 text-[14px] font-semibold break-words text-admin-assessment-text">
                          {leadDisplayName(lead)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-admin-muted">
                          {LEAD_STATUS_LABELS[lead.status]}
                          {lead.status === "DO_NOT_CONTACT" ? (
                            <span className="ml-2 font-semibold text-admin-muted">
                              DNC
                            </span>
                          ) : null}
                          {isFollowUpOverdue(lead) ? (
                            <span className="ml-2 font-bold text-[#8f2d2d]">
                              Overdue
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <p className="shrink-0 text-[11px] text-admin-muted">
                        {lead.lastContactAt
                          ? formatDate(lead.lastContactAt)
                          : "—"}
                      </p>
                    </div>
                    <dl className="mt-2 grid gap-1 text-[12px] text-admin-text">
                      {contactPerson ? (
                        <dd className="text-admin-muted">
                          Contact: {contactPerson}
                        </dd>
                      ) : null}
                      {phone ? (
                        <dd className="flex items-center gap-1.5">
                          <Phone className="size-3.5 shrink-0 text-admin-subtle" />
                          <a href={`tel:${phone}`} className="hover:underline">
                            {phone}
                          </a>
                        </dd>
                      ) : null}
                      {isAdmin ? (
                        <dd className="text-admin-muted">
                          Assigned: {leadOwnerLabel(lead)}
                        </dd>
                      ) : null}
                      {lead.followUpAt ? (
                        <dd
                          className={cn(
                            isFollowUpOverdue(lead)
                              ? "font-medium text-[#8f2d2d]"
                              : "text-admin-muted",
                          )}
                        >
                          Next follow-up: {formatDate(lead.followUpAt)}
                        </dd>
                      ) : (
                        <dd className="text-admin-muted">
                          Next follow-up: None
                        </dd>
                      )}
                    </dl>
                    <div className="mt-3 border-t border-admin-border-subtle pt-3">
                      {rowActions(lead)}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div
              role="region"
              aria-label="Leads table"
              className="hidden w-full min-w-0 overflow-hidden rounded-xl border border-admin-border-strong bg-admin-surface md:block"
            >
              <table className="w-full table-fixed border-collapse text-left">
                <colgroup>
                  <col className={isAdmin ? "w-[16%]" : "w-[18%]"} />
                  <col className={isAdmin ? "w-[14%]" : "w-[16%]"} />
                  <col className="w-[12%]" />
                  <col className={isAdmin ? "w-[14%]" : "w-[16%]"} />
                  {isAdmin ? <col className="w-[12%]" /> : null}
                  <col className="w-[12%]" />
                  <col className="w-[14%]" />
                  <col className="w-[6%]" />
                </colgroup>
                <thead className="text-[11px] font-medium text-admin-muted">
                  <tr>
                    <th className="border-b border-admin-border-subtle px-3 py-3 font-medium">
                      Company
                    </th>
                    <th className="border-b border-admin-border-subtle px-3 py-3 font-medium">
                      Contact Person
                    </th>
                    <th className="border-b border-admin-border-subtle px-3 py-3 font-medium">
                      Phone
                    </th>
                    <th className="border-b border-admin-border-subtle px-3 py-3 font-medium">
                      Current Status
                    </th>
                    {isAdmin ? (
                      <th className="border-b border-admin-border-subtle px-3 py-3 font-medium">
                        Assigned
                      </th>
                    ) : null}
                    <th className="border-b border-admin-border-subtle px-3 py-3 font-medium">
                      Last Contact
                    </th>
                    <th className="border-b border-admin-border-subtle px-3 py-3 font-medium">
                      Next Follow-Up
                    </th>
                    <th className="border-b border-admin-border-subtle px-2 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border-subtle">
                  {visibleLeads.map((lead) => {
                    const contactPerson = leadContactPerson(lead);
                    const phone = leadListPhone(lead);
                    return (
                      <tr
                        key={lead.id}
                        className={cn(
                          "align-middle text-[12px] text-admin-text-strong",
                          rowTone(lead),
                        )}
                      >
                        <td className="px-3 py-3.5 font-medium text-admin-assessment-text">
                          <button
                            type="button"
                            onClick={() => openCrm(lead)}
                            title={leadDisplayName(lead)}
                            className="block w-full cursor-pointer truncate text-left hover:underline"
                          >
                            {leadDisplayName(lead)}
                          </button>
                        </td>
                        <td className="px-3 py-3.5 text-admin-text">
                          {contactPerson ? (
                            <span
                              className="block truncate"
                              title={contactPerson}
                            >
                              {contactPerson}
                            </span>
                          ) : (
                            <Empty>—</Empty>
                          )}
                        </td>
                        <td className="px-3 py-3.5">
                          {phone ? (
                            <a
                              href={`tel:${phone}`}
                              title={phone}
                              className="block truncate hover:underline"
                            >
                              {phone}
                            </a>
                          ) : (
                            <Empty>—</Empty>
                          )}
                        </td>
                        <td className="px-3 py-3.5 text-admin-text">
                          <span
                            className="block truncate"
                            title={LEAD_STATUS_LABELS[lead.status]}
                          >
                            {LEAD_STATUS_LABELS[lead.status]}
                            {lead.status === "DO_NOT_CONTACT" ? (
                              <span className="ml-1.5 text-[10px] font-semibold tracking-wide text-admin-muted uppercase">
                                DNC
                              </span>
                            ) : null}
                          </span>
                        </td>
                        {isAdmin ? (
                          <td className="px-3 py-3.5">
                            <span
                              className={cn(
                                "block truncate",
                                !lead.owner && "text-admin-muted",
                              )}
                              title={lead.owner?.email ?? "Unassigned"}
                            >
                              {leadOwnerLabel(lead)}
                            </span>
                          </td>
                        ) : null}
                        <td className="px-3 py-3.5 text-admin-muted">
                          <span className="block truncate">
                            {lead.lastContactAt ? (
                              formatDate(lead.lastContactAt)
                            ) : (
                              <Empty>—</Empty>
                            )}
                          </span>
                        </td>
                        <td
                          className={cn(
                            "px-3 py-3.5",
                            isFollowUpOverdue(lead)
                              ? "font-medium text-[#8f2d2d]"
                              : "text-admin-muted",
                          )}
                        >
                          <span className="block truncate">
                            {lead.followUpAt ? (
                              formatDate(lead.followUpAt)
                            ) : (
                              <Empty>None</Empty>
                            )}
                          </span>
                        </td>
                        <td className="px-2 py-3">{rowActions(lead)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {isAdmin && leads.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3 border-t border-[#EFEBE3] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[12px] tracking-[0.04em] text-[#8A8F98] uppercase">
                    Rows
                  </span>
                  <select
                    value={crmTake}
                    onChange={(event) => {
                      setCrmTake(
                        Number(
                          event.target.value,
                        ) as (typeof CRM_PAGE_SIZES)[number],
                      );
                      setCrmSkip(0);
                    }}
                    aria-label="Rows per page"
                    className="rounded-lg border border-[#E8E4DC] bg-white px-2.5 py-1.5 font-body text-[13px] text-[#001528] outline-none focus:border-[#b17411]"
                  >
                    {CRM_PAGE_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body text-[13px] text-[#5C5F66]">
                    Page {crmPage} of {crmPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCrmSkip(Math.max(0, safeCrmSkip - crmTake))
                    }
                    disabled={safeCrmSkip === 0}
                    aria-label="Previous page"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8E4DC] text-[#001528] transition-colors hover:border-[#b17411] hover:text-[#b17411] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrmSkip(safeCrmSkip + crmTake)}
                    disabled={safeCrmSkip + crmTake >= crmTotal}
                    aria-label="Next page"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8E4DC] text-[#001528] transition-colors hover:border-[#b17411] hover:text-[#b17411] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>

      <LeadFormDialog
        open={formOpen}
        lead={editing}
        assignees={isAdmin ? assignees : undefined}
        onOpenChange={setFormOpen}
        onSaved={handleSaved}
      />
      <AddLeadNoteDialog
        lead={addingNotes}
        onOpenChange={(open) => {
          if (!open) setAddingNotes(null);
        }}
        onSaved={handleNoteSaved}
      />
      <ViewLeadNotesDialog
        lead={viewingNotes}
        onOpenChange={(open) => {
          if (!open) setViewingNotes(null);
        }}
      />
      <LeadStatusDialog
        lead={statusLead}
        onOpenChange={(open) => {
          if (!open) setStatusLead(null);
        }}
        onSaved={handleStatusSaved}
      />
      <DeleteLeadDialog
        lead={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        onDeleted={handleDeleted}
      />
      {isAdmin ? (
        <AssignLeadDialog
          lead={assigning}
          assignees={assignees}
          onOpenChange={(open) => {
            if (!open) setAssigning(null);
          }}
          onAssigned={handleAssigned}
        />
      ) : null}
      <LeadCrmPanel
        lead={crmLead}
        onOpenChange={(open) => {
          if (!open) {
            setCrmLead(null);
            void loadDashboard();
          }
        }}
        onLeadUpdated={handleCrmLeadUpdated}
      />
    </>
  );

  if (isAdmin) {
    return (
      <div className="mx-auto mt-6 w-full min-w-0 max-w-[1500px]">
        {content}
      </div>
    );
  }

  return (
    <LeadsShell name={name ?? ""} email={email ?? ""}>
      {content}
    </LeadsShell>
  );
}

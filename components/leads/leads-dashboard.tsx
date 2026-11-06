"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UsersRound,
} from "lucide-react";

import { AdminAlert } from "@/components/admin/admin-ui";
import {
  DeleteLeadDialog,
  LeadFormDialog,
} from "@/components/leads/lead-dialogs";
import { LeadsShell } from "@/components/leads/leads-shell";
import { AdminApiError } from "@/lib/auth-api";
import { type Lead, listLeads } from "@/lib/leads-api";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function sortNewestFirst(leads: Lead[]) {
  return [...leads].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function loadErrorMessage(cause: unknown) {
  if (cause instanceof AdminApiError && cause.status === 403) {
    return "Your account doesn't have access to the leads dashboard.";
  }
  return cause instanceof Error && cause.message
    ? cause.message
    : "Could not load your leads.";
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-admin-border bg-admin-soft p-1.5">
      <div className="flex h-8 items-center justify-between px-2 text-[12px] font-medium text-admin-text-strong">
        <span>{title}</span>
        {icon}
      </div>
      <div className="flex min-h-[64px] items-center rounded-xl border border-admin-border-subtle bg-admin-surface px-3 py-2.5 shadow-admin-card">
        <span className="text-[28px] leading-none font-bold text-admin-navy">
          {value}
        </span>
      </div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <span className="text-admin-subtle">{children}</span>;
}

export function LeadsDashboard({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState<Lead | null>(null);
  const [now, setNow] = useState<number | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const next = await listLeads();
      setLeads(sortNewestFirst(next));
      setNow(Date.now());
      setError("");
    } catch (cause) {
      setError(loadErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadLeads(), 0);
    return () => window.clearTimeout(timer);
  }, [loadLeads]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return leads;
    return leads.filter((lead) =>
      [lead.name, lead.email, lead.phone, lead.address, lead.notes].some(
        (value) => value?.toLowerCase().includes(needle),
      ),
    );
  }, [leads, query]);

  const addedThisWeek = useMemo(
    () =>
      now === null
        ? 0
        : leads.filter(
            (lead) => now - new Date(lead.createdAt).getTime() <= WEEK_MS,
          ).length,
    [leads, now],
  );
  const withContact = leads.filter((lead) => lead.email || lead.phone).length;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
    setNotice("");
  };

  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setFormOpen(true);
    setNotice("");
  };

  const handleSaved = (lead: Lead, mode: "created" | "updated") => {
    setLeads((current) =>
      sortNewestFirst([lead, ...current.filter((item) => item.id !== lead.id)]),
    );
    setNow(Date.now());
    setFormOpen(false);
    setNotice(
      mode === "created"
        ? `${lead.name} was added.`
        : `${lead.name} was updated.`,
    );
  };

  const handleDeleted = (lead: Lead) => {
    setLeads((current) => current.filter((item) => item.id !== lead.id));
    setDeleting(null);
    setNotice(`${lead.name} was deleted.`);
  };

  const actionButtons = (lead: Lead) => (
    <div className="flex justify-end gap-1.5">
      <button
        type="button"
        onClick={() => openEdit(lead)}
        aria-label={`Edit ${lead.name}`}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-admin-border-strong bg-admin-surface px-2.5 text-[11px] font-medium text-admin-assessment-text hover:bg-admin-soft"
      >
        <Pencil className="size-3.5" />
        Edit
      </button>
      <button
        type="button"
        onClick={() => {
          setDeleting(lead);
          setNotice("");
        }}
        aria-label={`Delete ${lead.name}`}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-[#f3c9c9] bg-admin-surface px-2.5 text-[11px] font-medium text-[#8f2d2d] hover:bg-[#fdf3f3]"
      >
        <Trash2 className="size-3.5" />
        Delete
      </button>
    </div>
  );

  return (
    <LeadsShell name={name} email={email}>
      <section className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-sans text-[24px] leading-tight font-bold tracking-[-0.03em] text-admin-navy sm:text-[30px]">
            Leads
          </h1>
          <p className="mt-1 text-[13px] text-admin-muted">
            Keep track of your prospects, their contact details, and notes.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface transition-colors hover:bg-admin-assessment-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold"
        >
          <Plus className="size-4" />
          Add lead
        </button>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          title="Total leads"
          value={loading && leads.length === 0 ? "—" : leads.length}
          icon={<UsersRound className="size-3.5 text-admin-muted" />}
        />
        <StatCard
          title="Added in the last 7 days"
          value={loading && leads.length === 0 ? "—" : addedThisWeek}
          icon={<CalendarPlus className="size-3.5 text-admin-muted" />}
        />
        <StatCard
          title="With email or phone"
          value={loading && leads.length === 0 ? "—" : withContact}
          icon={<Phone className="size-3.5 text-admin-muted" />}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {error ? (
          <AdminAlert>
            <span className="flex flex-wrap items-center justify-between gap-3">
              {error}
              <button
                type="button"
                onClick={() => void loadLeads()}
                className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold underline underline-offset-2"
              >
                <RefreshCw className="size-3.5" />
                Try again
              </button>
            </span>
          </AdminAlert>
        ) : null}
        {notice ? <AdminAlert tone="info">{notice}</AdminAlert> : null}
      </div>

      <section aria-label="Leads" className="mt-4 w-full min-w-0">
        <label className="mb-3 flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-admin-subtle">
          <Search className="size-4 shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, phone, address, or notes"
            aria-label="Search leads"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-admin-text-strong outline-none placeholder:text-admin-subtle"
          />
        </label>

        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-admin-border-strong bg-admin-surface px-4 py-14 text-[13px] text-admin-muted">
            <Loader2 className="size-4 animate-spin" />
            Loading leads…
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
                Add your first lead to start building your pipeline.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover"
              >
                <Plus className="size-4" />
                Add lead
              </button>
            </div>
          )
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-admin-border-strong bg-admin-surface px-4 py-12 text-center text-[13px] text-admin-muted">
            No leads match &ldquo;{query.trim()}&rdquo;.
          </div>
        ) : (
          <>
            {/* Mobile: one card per lead. */}
            <ul className="flex flex-col gap-3 md:hidden">
              {filtered.map((lead) => (
                <li
                  key={lead.id}
                  className="rounded-xl border border-admin-border-strong bg-admin-surface p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-[14px] font-semibold break-words text-admin-assessment-text">
                      {lead.name}
                    </p>
                    <p className="shrink-0 text-[11px] text-admin-muted">
                      {formatDate(lead.updatedAt)}
                    </p>
                  </div>
                  <dl className="mt-2 grid gap-1 text-[12px] text-admin-text">
                    {lead.email ? (
                      <dd className="flex items-center gap-1.5 break-all">
                        <Mail className="size-3.5 shrink-0 text-admin-subtle" />
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:underline"
                        >
                          {lead.email}
                        </a>
                      </dd>
                    ) : null}
                    {lead.phone ? (
                      <dd className="flex items-center gap-1.5">
                        <Phone className="size-3.5 shrink-0 text-admin-subtle" />
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:underline"
                        >
                          {lead.phone}
                        </a>
                      </dd>
                    ) : null}
                    {lead.address ? (
                      <dd className="break-words text-admin-muted">
                        {lead.address}
                      </dd>
                    ) : null}
                  </dl>
                  {lead.notes ? (
                    <p className="mt-2 line-clamp-3 text-[12px] whitespace-pre-line text-admin-muted">
                      {lead.notes}
                    </p>
                  ) : null}
                  <div className="mt-3 border-t border-admin-border-subtle pt-3">
                    {actionButtons(lead)}
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop: table. */}
            <div className="hidden w-full min-w-0 overflow-hidden rounded-xl border border-admin-border-strong bg-admin-surface md:block">
              <div
                role="region"
                aria-label="Leads table"
                tabIndex={0}
                className="w-full min-w-0 overflow-x-auto"
              >
                <table className="w-full min-w-[960px] table-fixed border-collapse text-left">
                  <thead className="text-[11px] font-medium text-admin-muted">
                    <tr>
                      <th className="w-[170px] border-b border-admin-border-subtle px-4 py-3 font-medium">
                        Name
                      </th>
                      <th className="w-[200px] border-b border-admin-border-subtle px-4 py-3 font-medium">
                        Email
                      </th>
                      <th className="w-[140px] border-b border-admin-border-subtle px-4 py-3 font-medium">
                        Phone
                      </th>
                      <th className="w-[190px] border-b border-admin-border-subtle px-4 py-3 font-medium">
                        Address
                      </th>
                      <th className="border-b border-admin-border-subtle px-4 py-3 font-medium">
                        Notes
                      </th>
                      <th className="w-[112px] border-b border-admin-border-subtle px-4 py-3 font-medium">
                        Updated
                      </th>
                      <th className="w-[170px] border-b border-admin-border-subtle px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-admin-border-subtle">
                    {filtered.map((lead) => (
                      <tr
                        key={lead.id}
                        className="align-top text-[12px] text-admin-text-strong"
                      >
                        <td className="px-4 py-3.5 font-medium break-words text-admin-assessment-text">
                          {lead.name}
                        </td>
                        <td className="px-4 py-3.5 break-all">
                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="hover:underline"
                            >
                              {lead.email}
                            </a>
                          ) : (
                            <Empty>—</Empty>
                          )}
                        </td>
                        <td className="px-4 py-3.5 break-words">
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="hover:underline"
                            >
                              {lead.phone}
                            </a>
                          ) : (
                            <Empty>—</Empty>
                          )}
                        </td>
                        <td className="px-4 py-3.5 break-words text-admin-text">
                          {lead.address || <Empty>—</Empty>}
                        </td>
                        <td className="px-4 py-3.5 text-admin-muted">
                          {lead.notes ? (
                            <p
                              title={lead.notes}
                              className="line-clamp-2 whitespace-pre-line"
                            >
                              {lead.notes}
                            </p>
                          ) : (
                            <Empty>—</Empty>
                          )}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-admin-muted">
                          {formatDate(lead.updatedAt)}
                        </td>
                        <td className="px-4 py-3">{actionButtons(lead)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>

      <LeadFormDialog
        open={formOpen}
        lead={editing}
        onOpenChange={setFormOpen}
        onSaved={handleSaved}
      />
      <DeleteLeadDialog
        lead={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        onDeleted={handleDeleted}
      />
    </LeadsShell>
  );
}

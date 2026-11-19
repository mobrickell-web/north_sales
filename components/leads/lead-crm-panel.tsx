"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Building2,
  CalendarClock,
  Check,
  ChevronDown,
  Loader2,
  NotebookPen,
  PhoneCall,
  Users,
  X,
} from "lucide-react";

import {
  ANNUAL_GROSS_REVENUE_KIND_LABELS,
  EXISTING_SALES_FORCE_LABELS,
  LEAD_ACTIVITY_TYPE_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type Lead,
  type LeadActivity,
  type LeadContact,
  type LeadFollowUp,
  type LeadStatus,
  type ManualLeadActivityType,
  addLeadActivity,
  completeLeadAppointment,
  completeLeadFollowUp,
  createLeadContact,
  deleteLeadContact,
  getLead,
  leadDisplayName,
  listLeadActivities,
  listLeadCalls,
  listLeadContacts,
  listLeadFollowUps,
  logLeadCall,
  scheduleLeadFollowUp,
  updateLead,
  updateLeadContact,
} from "@/lib/leads-api";
import { cn } from "@/lib/utils";

/** Note / email / meeting — calls use the dedicated Log call section (A9). */
const SIMPLE_ACTIVITY_TYPES = ["NOTE", "EMAIL", "MEETING"] as const;
type SimpleActivityType = (typeof SIMPLE_ACTIVITY_TYPES)[number];

const inputClass =
  "w-full rounded-lg border border-admin-border-strong bg-admin-surface px-3 py-2.5 text-[13px] text-admin-text-strong outline-none transition-colors placeholder:text-admin-subtle focus:border-admin-gold-deep focus:ring-2 focus:ring-admin-gold/25";

const labelClass =
  "mb-1.5 block text-[12px] font-medium text-admin-text-strong";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function errorMessage(cause: unknown, fallback: string) {
  return cause instanceof Error && cause.message ? cause.message : fallback;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date);
}

/** `datetime-local` value from an ISO string (local timezone). */
function toDatetimeLocalValue(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function utcDayStartMs(now = new Date()) {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function isFollowUpOverdue(followUp: LeadFollowUp) {
  if (followUp.completedAt) return false;
  return new Date(followUp.dueAt).getTime() < utcDayStartMs();
}

function isFollowUpDueToday(followUp: LeadFollowUp) {
  if (followUp.completedAt) return false;
  const due = new Date(followUp.dueAt).getTime();
  const start = utcDayStartMs();
  const end = start + 24 * 60 * 60 * 1000;
  return due >= start && due < end;
}

export function LeadCrmPanel({
  lead,
  onOpenChange,
  onLeadUpdated,
}: {
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
  onLeadUpdated: (lead: Lead) => void;
}) {
  return (
    <Dialog.Root
      open={lead !== null}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex max-h-[92dvh] w-[calc(100vw-24px)] max-w-[720px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-admin-surface font-sans shadow-2xl">
          {lead ? (
            <LeadCrmPanelBody
              key={lead.id}
              lead={lead}
              onClose={() => onOpenChange(false)}
              onLeadUpdated={onLeadUpdated}
            />
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function LeadCrmPanelBody({
  lead: initialLead,
  onClose,
  onLeadUpdated,
}: {
  lead: Lead;
  onClose: () => void;
  onLeadUpdated: (lead: Lead) => void;
}) {
  const [lead, setLead] = useState(initialLead);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [calls, setCalls] = useState<LeadActivity[]>([]);
  const [contacts, setContacts] = useState<LeadContact[]>([]);
  const [followUps, setFollowUps] = useState<LeadFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(
    async (opts?: { syncParent?: boolean }) => {
      setLoading(true);
      setError("");
      try {
        const [
          nextLead,
          nextActivities,
          nextCalls,
          nextContacts,
          nextFollowUps,
        ] = await Promise.all([
          getLead(initialLead.id),
          listLeadActivities(initialLead.id),
          listLeadCalls(initialLead.id),
          listLeadContacts(initialLead.id),
          listLeadFollowUps(initialLead.id),
        ]);
        setLead(nextLead);
        setActivities(nextActivities);
        setCalls(nextCalls);
        setContacts(nextContacts);
        setFollowUps(nextFollowUps);
        if (opts?.syncParent) onLeadUpdated(nextLead);
      } catch (cause) {
        setError(
          errorMessage(cause, "Could not load CRM details for this lead."),
        );
      } finally {
        setLoading(false);
      }
    },
    [initialLead.id, onLeadUpdated],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
    // Initial load only for this lead id.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- remounted via key={lead.id}
  }, [initialLead.id]);

  const openFollowUps = useMemo(
    () => followUps.filter((item) => !item.completedAt),
    [followUps],
  );
  const completedFollowUps = useMemo(
    () => followUps.filter((item) => item.completedAt),
    [followUps],
  );

  return (
    <>
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-admin-border px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <Dialog.Title className="truncate text-[18px] font-semibold text-admin-text-strong">
            {leadDisplayName(lead)}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-[12px] text-admin-muted">
            {LEAD_STATUS_LABELS[lead.status]}
            {lead.status === "DO_NOT_CONTACT" ? (
              <span className="ml-1.5 font-semibold tracking-wide uppercase">
                DNC
              </span>
            ) : null}{" "}
            · Contacts, calls, activity, follow-ups, and appointments
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label="Close"
          onClick={onClose}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-admin-muted hover:bg-admin-soft hover:text-admin-text-strong"
        >
          <X className="size-4" />
        </Dialog.Close>
      </header>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-[#f3c9c9] bg-[#fdf3f3] px-3 py-2 text-[13px] text-[#8f2d2d]"
          >
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="rounded-lg border border-admin-border-strong bg-admin-soft px-3 py-2 text-[13px] text-admin-text-strong">
            {notice}
          </p>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-admin-muted">
            <Loader2 className="size-4 animate-spin" />
            Loading CRM…
          </div>
        ) : (
          <>
            <CompanyInfoSummary lead={lead} />
            <ContactsSection
              leadId={lead.id}
              contacts={contacts}
              onChanged={async (message) => {
                setNotice(message);
                await refresh({ syncParent: true });
              }}
              onError={setError}
            />
            <CallLogSection
              leadId={lead.id}
              calls={calls}
              contacts={contacts}
              onLogged={async () => {
                setNotice("Call logged.");
                await refresh({ syncParent: true });
              }}
              onError={setError}
            />
            <ActivitySection
              leadId={lead.id}
              activities={activities}
              onAdded={async () => {
                setNotice("Activity added.");
                await refresh({ syncParent: true });
              }}
              onError={setError}
            />
            <FollowUpSection
              leadId={lead.id}
              openFollowUps={openFollowUps}
              completedFollowUps={completedFollowUps}
              onChanged={async (message) => {
                setNotice(message);
                await refresh({ syncParent: true });
              }}
              onError={setError}
            />
            <AppointmentSection
              key={`${lead.id}-${lead.appointmentAt ?? ""}-${lead.appointmentCompletedAt ?? ""}-${lead.appointmentNotes ?? ""}`}
              lead={lead}
              onSaved={async (next, message) => {
                setLead(next);
                onLeadUpdated(next);
                setNotice(message);
                await refresh({ syncParent: true });
              }}
              onError={setError}
            />
          </>
        )}
      </div>
    </>
  );
}

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-admin-soft text-admin-gold-deep">
        {icon}
      </span>
      <div>
        <h3 className="text-[14px] font-semibold text-admin-text-strong">
          {title}
        </h3>
        <p className="text-[12px] text-admin-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function DispositionDropdown({
  value,
  onChange,
}: {
  value: LeadStatus;
  onChange: (value: LeadStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label="Call disposition"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="lead-call-disposition-options"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-left text-[13px] font-medium text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft"
      >
        <span className="truncate">{LEAD_STATUS_LABELS[value]}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-admin-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id="lead-call-disposition-options"
          role="listbox"
          aria-label="Call disposition"
          className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full overflow-y-auto rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
        >
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

function ContactSpokenDropdown({
  value,
  contacts,
  onChange,
}: {
  value: string;
  contacts: LeadContact[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = contacts.find((contact) => contact.id === value);
  const label = selected
    ? `${selected.name}${selected.title ? ` · ${selected.title}` : ""}`
    : "Company only (no contact)";

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
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label="Contact spoken to"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="lead-call-contact-options"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-left text-[13px] font-medium text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft"
      >
        <span
          className={cn(
            "truncate",
            !selected && "font-normal text-admin-muted",
          )}
        >
          {label}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-admin-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id="lead-call-contact-options"
          role="listbox"
          aria-label="Contact spoken to"
          className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full overflow-y-auto rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
        >
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={cn(
              "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
              !value
                ? "bg-admin-navy font-medium text-admin-surface"
                : "text-admin-text-strong hover:bg-admin-soft",
            )}
          >
            Company only (no contact)
          </button>
          {contacts.map((contact) => {
            const optionLabel = `${contact.name}${contact.title ? ` · ${contact.title}` : ""}`;
            const selectedOption = contact.id === value;
            return (
              <button
                key={contact.id}
                type="button"
                role="option"
                aria-selected={selectedOption}
                onClick={() => {
                  onChange(contact.id);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
                  selectedOption
                    ? "bg-admin-navy font-medium text-admin-surface"
                    : "text-admin-text-strong hover:bg-admin-soft",
                )}
              >
                {optionLabel}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function CompanyInfoSummary({ lead }: { lead: Lead }) {
  const revenueKind = lead.annualGrossRevenueKind
    ? ANNUAL_GROSS_REVENUE_KIND_LABELS[lead.annualGrossRevenueKind]
    : null;
  const revenue =
    [lead.annualRevenue, revenueKind ? `(${revenueKind})` : null]
      .filter(Boolean)
      .join(" ") || null;
  const salesForce = lead.existingSalesForce
    ? EXISTING_SALES_FORCE_LABELS[lead.existingSalesForce]
    : null;
  const reps =
    lead.numberOfSalesRepresentatives != null
      ? String(lead.numberOfSalesRepresentatives)
      : null;

  const rows: { label: string; value: string }[] = [
    { label: "Website", value: lead.website?.trim() || "" },
    { label: "Annual Gross Revenue", value: revenue ?? "" },
    { label: "Existing Sales Force", value: salesForce ?? "" },
    { label: "Sales Representatives", value: reps ?? "" },
    { label: "Lead Source", value: lead.leadSource?.trim() || "" },
  ].filter((row) => row.value);

  return (
    <section>
      <SectionHeading
        icon={<Building2 className="size-4" />}
        title="Company information"
        subtitle="Revenue, sales force, website, and lead source. Edit via Edit Prospect."
      />
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-admin-border-strong px-3 py-4 text-[13px] text-admin-muted">
          No company details yet. Add them when you edit this prospect.
        </p>
      ) : (
        <dl className="grid gap-2 rounded-xl border border-admin-border-strong bg-admin-soft/40 p-3 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="min-w-0">
              <dt className="text-[11px] font-medium tracking-wide text-admin-muted uppercase">
                {row.label}
              </dt>
              <dd className="mt-0.5 truncate text-[13px] text-admin-text-strong">
                {row.label === "Website" ? (
                  <a
                    href={
                      row.value.startsWith("http")
                        ? row.value
                        : `https://${row.value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-admin-gold-deep underline-offset-2 hover:underline"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

function ContactsSection({
  leadId,
  contacts,
  onChanged,
  onError,
}: {
  leadId: string;
  contacts: LeadContact[];
  onChanged: (message: string) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const resetCreate = () => {
    setName("");
    setTitle("");
    setPhone("");
    setEmail("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      onError("Contact name is required.");
      return;
    }
    setSaving(true);
    onError("");
    try {
      await createLeadContact(leadId, {
        name: trimmed,
        title: title.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
      resetCreate();
      await onChanged("Contact added.");
    } catch (cause) {
      onError(errorMessage(cause, "Could not add the contact."));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (contact: LeadContact) => {
    setEditingId(contact.id);
    setEditName(contact.name);
    setEditTitle(contact.title ?? "");
    setEditPhone(contact.phone ?? "");
    setEditEmail(contact.email ?? "");
  };

  const saveEdit = async (contactId: string) => {
    const trimmed = editName.trim();
    if (!trimmed) {
      onError("Contact name is required.");
      return;
    }
    setBusyId(contactId);
    onError("");
    try {
      await updateLeadContact(leadId, contactId, {
        name: trimmed,
        title: editTitle.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
      });
      setEditingId(null);
      await onChanged("Contact updated.");
    } catch (cause) {
      onError(errorMessage(cause, "Could not update the contact."));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (contactId: string) => {
    setBusyId(contactId);
    onError("");
    try {
      await deleteLeadContact(leadId, contactId);
      if (editingId === contactId) setEditingId(null);
      await onChanged("Contact removed.");
    } catch (cause) {
      onError(errorMessage(cause, "Could not delete the contact."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section>
      <SectionHeading
        icon={<Users className="size-4" />}
        title="Contacts"
        subtitle="People at this company. Calls can be tied to a contact; company history stays complete."
      />
      <form
        onSubmit={(event) => void submit(event)}
        className="mb-4 grid gap-3 rounded-xl border border-admin-border-strong bg-admin-soft/40 p-3 sm:grid-cols-2"
      >
        <label>
          <span className={labelClass}>
            Name <span className="text-admin-danger">*</span>
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={150}
            placeholder="Jordan Lee"
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={150}
            placeholder="Sales Manager"
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Phone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            maxLength={50}
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={255}
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:cursor-wait disabled:opacity-70 sm:col-span-2 sm:justify-self-end"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving ? "Adding…" : "Add contact"}
        </button>
      </form>

      {contacts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-admin-border-strong px-4 py-8 text-center text-[13px] text-admin-muted">
          No contacts yet. Add gatekeeper, decision maker, or others here.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {contacts.map((contact) => {
            const isEditing = editingId === contact.id;
            const busy = busyId === contact.id;
            return (
              <li
                key={contact.id}
                className="rounded-xl border border-admin-border-strong bg-admin-surface px-3.5 py-3"
              >
                {isEditing ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      maxLength={150}
                      className={inputClass}
                      aria-label="Contact name"
                    />
                    <input
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      maxLength={150}
                      placeholder="Title"
                      className={inputClass}
                      aria-label="Contact title"
                    />
                    <input
                      value={editPhone}
                      onChange={(event) => setEditPhone(event.target.value)}
                      maxLength={50}
                      placeholder="Phone"
                      className={inputClass}
                      aria-label="Contact phone"
                    />
                    <input
                      value={editEmail}
                      onChange={(event) => setEditEmail(event.target.value)}
                      maxLength={255}
                      placeholder="Email"
                      className={inputClass}
                      aria-label="Contact email"
                    />
                    <div className="flex flex-wrap gap-2 sm:col-span-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void saveEdit(contact.id)}
                        className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-admin-navy px-3 text-[12px] font-semibold text-admin-surface disabled:opacity-70"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setEditingId(null)}
                        className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-admin-border-strong px-3 text-[12px] font-medium text-admin-text-strong"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-admin-text-strong">
                        {contact.name}
                        {contact.title ? (
                          <span className="font-normal text-admin-muted">
                            {" "}
                            · {contact.title}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[12px] text-admin-muted">
                        {[contact.phone, contact.email]
                          .filter(Boolean)
                          .join(" · ") || "No phone or email"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => startEdit(contact)}
                        className="cursor-pointer text-[12px] font-medium text-admin-gold-deep hover:underline disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void remove(contact.id)}
                        className="cursor-pointer text-[12px] font-medium text-[#8f2d2d] hover:underline disabled:opacity-60"
                      >
                        {busy ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function CallLogSection({
  leadId,
  calls,
  contacts,
  onLogged,
  onError,
}: {
  leadId: string;
  calls: LeadActivity[];
  contacts: LeadContact[];
  onLogged: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [disposition, setDisposition] = useState<LeadStatus>("NO_ANSWER");
  const [contactId, setContactId] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");
  const [updateCurrentStatus, setUpdateCurrentStatus] = useState(false);
  const [saving, setSaving] = useState(false);

  /** Drop stale selection if the contact was deleted — no sync effect needed. */
  const selectedContactId =
    contactId && contacts.some((c) => c.id === contactId) ? contactId : "";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = notes.trim();
    if (!trimmed) {
      onError("Enter call notes before logging.");
      return;
    }
    const followUpIso = followUpAt ? fromDatetimeLocalValue(followUpAt) : null;
    if (followUpAt && !followUpIso) {
      onError("Choose a valid next follow-up date and time.");
      return;
    }
    if (
      updateCurrentStatus &&
      disposition === "CALLBACK_REQUIRED" &&
      !followUpIso
    ) {
      onError(
        "Callback Required as Current Status needs a next follow-up date.",
      );
      return;
    }
    if (updateCurrentStatus && disposition === "ZOOM_SCHEDULED") {
      onError(
        "Zoom Scheduled needs an appointment date — use Manual appointment, or log the call without updating Current Status.",
      );
      return;
    }
    if (updateCurrentStatus && disposition === "APPOINTMENT_COMPLETED") {
      onError(
        "Use Mark completed on Manual appointment to set Appointment Completed, or log the call without updating Current Status.",
      );
      return;
    }

    setSaving(true);
    onError("");
    try {
      await logLeadCall(leadId, {
        disposition,
        notes: trimmed,
        ...(followUpIso ? { followUpAt: followUpIso } : {}),
        ...(selectedContactId ? { contactId: selectedContactId } : {}),
        updateCurrentStatus,
      });
      setNotes("");
      setFollowUpAt("");
      setContactId("");
      setUpdateCurrentStatus(false);
      await onLogged();
    } catch (cause) {
      onError(errorMessage(cause, "Could not log the call."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <SectionHeading
        icon={<PhoneCall className="size-4" />}
        title="Log call"
        subtitle="Disposition is saved permanently in call history. Changing Current Status later will not erase past calls."
      />
      <form
        onSubmit={(event) => void submit(event)}
        className="mb-4 space-y-3 rounded-xl border border-admin-border-strong bg-admin-soft/40 p-3"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <span className={labelClass}>
              Disposition <span className="text-admin-danger">*</span>
            </span>
            <DispositionDropdown
              value={disposition}
              onChange={setDisposition}
            />
          </div>
          <div>
            <span className={labelClass}>Contact spoken to</span>
            <ContactSpokenDropdown
              value={selectedContactId}
              contacts={contacts}
              onChange={setContactId}
            />
          </div>
          <label className="sm:col-span-2">
            <span className={labelClass}>Next follow-up</span>
            <input
              type="datetime-local"
              value={followUpAt}
              onChange={(event) => setFollowUpAt(event.target.value)}
              className={inputClass}
            />
          </label>
        </div>
        <label className="block">
          <span className={labelClass}>
            Notes <span className="text-admin-danger">*</span>
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            maxLength={10000}
            placeholder="Who answered, what was said, next step…"
            className={cn(inputClass, "resize-none")}
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-admin-text-strong">
            <input
              type="checkbox"
              checked={updateCurrentStatus}
              onChange={(event) => setUpdateCurrentStatus(event.target.checked)}
              className="size-4 rounded border-admin-border-strong"
            />
            Also update Current Status to this disposition
          </label>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {saving ? "Saving…" : "Log call"}
          </button>
        </div>
      </form>

      {calls.length === 0 ? (
        <p className="rounded-xl border border-dashed border-admin-border-strong px-4 py-8 text-center text-[13px] text-admin-muted">
          No calls logged yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {calls.map((call) => (
            <li
              key={call.id}
              className="rounded-xl border border-admin-border-strong bg-admin-surface px-3.5 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold tracking-[0.04em] text-admin-gold-deep uppercase">
                  {call.disposition
                    ? LEAD_STATUS_LABELS[call.disposition]
                    : "Call"}
                  {call.contact?.name ? ` · ${call.contact.name}` : ""}
                </span>
                <span className="text-[11px] text-admin-muted">
                  {formatDateTime(call.createdAt)} · {call.authorName}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] whitespace-pre-wrap text-admin-text-strong">
                {call.body}
              </p>
              {call.nextFollowUpAt ? (
                <p className="mt-1 text-[11px] text-admin-muted">
                  Next follow-up: {formatDateTime(call.nextFollowUpAt)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ActivityTypeDropdown({
  value,
  onChange,
}: {
  value: SimpleActivityType;
  onChange: (value: SimpleActivityType) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label="Activity type"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="lead-activity-type-options"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-left text-[13px] font-medium text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info"
      >
        <span className="truncate">{LEAD_ACTIVITY_TYPE_LABELS[value]}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-admin-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id="lead-activity-type-options"
          role="listbox"
          aria-label="Activity type"
          className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full overflow-y-auto rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
        >
          {SIMPLE_ACTIVITY_TYPES.map((optionValue) => (
            <button
              key={optionValue}
              type="button"
              role="option"
              aria-selected={optionValue === value}
              onClick={() => {
                onChange(optionValue);
                setOpen(false);
              }}
              className={cn(
                "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-admin-info",
                optionValue === value
                  ? "bg-admin-navy font-medium text-admin-surface"
                  : "text-admin-text-strong hover:bg-admin-soft",
              )}
            >
              {LEAD_ACTIVITY_TYPE_LABELS[optionValue]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ActivitySection({
  leadId,
  activities,
  onAdded,
  onError,
}: {
  leadId: string;
  activities: LeadActivity[];
  onAdded: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [type, setType] = useState<SimpleActivityType>("NOTE");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) {
      onError("Enter details before adding.");
      return;
    }
    setSaving(true);
    onError("");
    try {
      await addLeadActivity(leadId, {
        type: type as ManualLeadActivityType,
        body: trimmed,
      });
      setBody("");
      await onAdded();
    } catch (cause) {
      onError(errorMessage(cause, "Could not add the activity."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <SectionHeading
        icon={<NotebookPen className="size-4" />}
        title="Activity"
        subtitle="Notes, emails, and meetings. Use Log call above for dispositions."
      />
      <form
        onSubmit={(event) => void submit(event)}
        className="mb-4 grid gap-3 rounded-xl border border-admin-border-strong bg-admin-soft/40 p-3 sm:grid-cols-[140px_1fr_auto]"
      >
        <div>
          <span className={labelClass}>Type</span>
          <ActivityTypeDropdown value={type} onChange={setType} />
        </div>
        <label className="sm:col-span-1">
          <span className={labelClass}>Details</span>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={2}
            maxLength={10000}
            placeholder="Email or meeting notes…"
            className={cn(inputClass, "resize-none")}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-2 self-end rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:cursor-wait disabled:opacity-70 sm:mb-[2px]"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving ? "Adding…" : "Add"}
        </button>
      </form>

      {activities.length === 0 ? (
        <p className="rounded-xl border border-dashed border-admin-border-strong px-4 py-8 text-center text-[13px] text-admin-muted">
          No activity yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="rounded-xl border border-admin-border-strong bg-admin-surface px-3.5 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold tracking-[0.04em] text-admin-gold-deep uppercase">
                  {activity.disposition
                    ? `Call · ${LEAD_STATUS_LABELS[activity.disposition]}`
                    : LEAD_ACTIVITY_TYPE_LABELS[activity.type]}
                </span>
                <span className="text-[11px] text-admin-muted">
                  {formatDateTime(activity.createdAt)} · {activity.authorName}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] whitespace-pre-wrap text-admin-text-strong">
                {activity.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FollowUpSection({
  leadId,
  openFollowUps,
  completedFollowUps,
  onChanged,
  onError,
}: {
  leadId: string;
  openFollowUps: LeadFollowUp[];
  completedFollowUps: LeadFollowUp[];
  onChanged: (message: string) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [dueAt, setDueAt] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const schedule = async (event: FormEvent) => {
    event.preventDefault();
    const iso = fromDatetimeLocalValue(dueAt);
    if (!iso) {
      onError("Choose a follow-up date and time.");
      return;
    }
    setSaving(true);
    onError("");
    try {
      await scheduleLeadFollowUp(leadId, {
        dueAt: iso,
        notes: notes.trim() || undefined,
      });
      setDueAt("");
      setNotes("");
      await onChanged("Follow-up scheduled.");
    } catch (cause) {
      onError(errorMessage(cause, "Could not schedule the follow-up."));
    } finally {
      setSaving(false);
    }
  };

  const complete = async (followUpId: string) => {
    setCompletingId(followUpId);
    onError("");
    try {
      await completeLeadFollowUp(leadId, followUpId);
      await onChanged("Follow-up marked complete.");
    } catch (cause) {
      onError(errorMessage(cause, "Could not complete the follow-up."));
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <section>
      <SectionHeading
        icon={<PhoneCall className="size-4" />}
        title="Follow-ups"
        subtitle="Schedule the next touch. Overdue open follow-ups are highlighted."
      />
      <form
        onSubmit={(event) => void schedule(event)}
        className="mb-4 grid gap-3 rounded-xl border border-admin-border-strong bg-admin-soft/40 p-3 sm:grid-cols-[1fr_1fr_auto]"
      >
        <label>
          <span className={labelClass}>
            Due <span className="text-admin-danger">*</span>
          </span>
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Notes</span>
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={5000}
            placeholder="What to cover"
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-2 self-end rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving ? "Saving…" : "Schedule"}
        </button>
      </form>

      {openFollowUps.length === 0 ? (
        <p className="mb-3 rounded-xl border border-dashed border-admin-border-strong px-4 py-6 text-center text-[13px] text-admin-muted">
          No open follow-ups.
        </p>
      ) : (
        <ul className="mb-3 flex flex-col gap-2">
          {openFollowUps.map((followUp) => {
            const overdue = isFollowUpOverdue(followUp);
            const dueToday = isFollowUpDueToday(followUp);
            return (
              <li
                key={followUp.id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between",
                  overdue
                    ? "border-[#f3c9c9] bg-[#fdf3f3]"
                    : dueToday
                      ? "border-admin-gold/40 bg-[#fff8eb]"
                      : "border-admin-border-strong bg-admin-surface",
                )}
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-admin-text-strong">
                    {formatDateTime(followUp.dueAt)}
                    {overdue ? (
                      <span className="ml-2 text-[11px] font-bold text-[#8f2d2d]">
                        Overdue
                      </span>
                    ) : dueToday ? (
                      <span className="ml-2 text-[11px] font-bold text-admin-gold-deep">
                        Due today
                      </span>
                    ) : null}
                  </p>
                  {followUp.notes ? (
                    <p className="mt-0.5 text-[12px] text-admin-muted">
                      {followUp.notes}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[11px] text-admin-subtle">
                    Scheduled by {followUp.createdByName}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={completingId === followUp.id}
                  onClick={() => void complete(followUp.id)}
                  className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft disabled:cursor-wait disabled:opacity-70"
                >
                  {completingId === followUp.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Complete
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {completedFollowUps.length > 0 ? (
        <div>
          <p className="mb-2 text-[11px] font-medium tracking-[0.06em] text-admin-muted uppercase">
            Completed
          </p>
          <ul className="flex flex-col gap-1.5">
            {completedFollowUps.slice(0, 5).map((followUp) => (
              <li
                key={followUp.id}
                className="rounded-lg border border-admin-border-subtle px-3 py-2 text-[12px] text-admin-muted"
              >
                <span className="font-medium text-admin-text">
                  {formatDateTime(followUp.dueAt)}
                </span>
                {" · completed "}
                {followUp.completedAt
                  ? formatDateTime(followUp.completedAt)
                  : ""}
                {followUp.completedByName
                  ? ` by ${followUp.completedByName}`
                  : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function AppointmentSection({
  lead,
  onSaved,
  onError,
}: {
  lead: Lead;
  onSaved: (lead: Lead, message: string) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [appointmentAt, setAppointmentAt] = useState(
    toDatetimeLocalValue(lead.appointmentAt),
  );
  const [appointmentNotes, setAppointmentNotes] = useState(
    lead.appointmentNotes ?? "",
  );
  const [saving, setSaving] = useState(false);
  const isCompleted =
    lead.status === "APPOINTMENT_COMPLETED" ||
    Boolean(lead.appointmentCompletedAt);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const iso = fromDatetimeLocalValue(appointmentAt);
    if (!iso) {
      onError("Choose an appointment date and time.");
      return;
    }
    setSaving(true);
    onError("");
    try {
      const next = await updateLead(lead.id, {
        status: "ZOOM_SCHEDULED",
        appointmentAt: iso,
        appointmentNotes: appointmentNotes.trim(),
      });
      await onSaved(next, "Appointment saved.");
    } catch (cause) {
      onError(errorMessage(cause, "Could not save the appointment."));
    } finally {
      setSaving(false);
    }
  };

  const clear = async () => {
    setSaving(true);
    onError("");
    try {
      const next = await updateLead(lead.id, {
        appointmentAt: "",
        appointmentNotes: "",
        status:
          lead.status === "ZOOM_SCHEDULED" ||
          lead.status === "APPOINTMENT_COMPLETED"
            ? "NO_ANSWER"
            : lead.status,
      });
      setAppointmentAt("");
      setAppointmentNotes("");
      await onSaved(next, "Appointment cleared.");
    } catch (cause) {
      onError(errorMessage(cause, "Could not clear the appointment."));
    } finally {
      setSaving(false);
    }
  };

  const markCompleted = async () => {
    if (!lead.appointmentAt && !appointmentAt.trim()) {
      onError("Schedule an appointment before marking it completed.");
      return;
    }
    setSaving(true);
    onError("");
    try {
      // Persist datetime/notes first if the form has unsaved schedule changes.
      if (
        !lead.appointmentAt ||
        appointmentAt !== toDatetimeLocalValue(lead.appointmentAt)
      ) {
        const iso = fromDatetimeLocalValue(appointmentAt);
        if (!iso) {
          onError("Choose an appointment date and time.");
          setSaving(false);
          return;
        }
        await updateLead(lead.id, {
          status: "ZOOM_SCHEDULED",
          appointmentAt: iso,
          appointmentNotes: appointmentNotes.trim(),
        });
      }
      const next = await completeLeadAppointment(lead.id, {
        notes: appointmentNotes.trim() || undefined,
      });
      await onSaved(next, "Appointment marked completed.");
    } catch (cause) {
      onError(errorMessage(cause, "Could not mark the appointment completed."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <SectionHeading
        icon={<CalendarClock className="size-4" />}
        title="Manual appointment"
        subtitle="Only appointments you add here. Website booking form submissions are not included."
      />
      {isCompleted ? (
        <p className="mb-3 rounded-lg border border-admin-border-strong bg-admin-soft px-3 py-2 text-[13px] text-admin-text-strong">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Check className="size-3.5 text-admin-gold-deep" />
            Appointment completed
          </span>
          {lead.appointmentCompletedAt ? (
            <span className="mt-0.5 block text-[12px] text-admin-muted">
              Marked {formatDateTime(lead.appointmentCompletedAt)}
              {lead.appointmentAt
                ? ` · scheduled ${formatDateTime(lead.appointmentAt)}`
                : ""}
            </span>
          ) : null}
        </p>
      ) : null}
      <form
        onSubmit={(event) => void save(event)}
        className="grid gap-3 rounded-xl border border-admin-border-strong bg-admin-soft/40 p-3"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className={labelClass}>
              Date & time <span className="text-admin-danger">*</span>
            </span>
            <input
              type="datetime-local"
              value={appointmentAt}
              onChange={(event) => setAppointmentAt(event.target.value)}
              required
              className={inputClass}
            />
          </label>
          <label>
            <span className={labelClass}>Notes</span>
            <input
              value={appointmentNotes}
              onChange={(event) => setAppointmentNotes(event.target.value)}
              maxLength={5000}
              placeholder="Zoom link, agenda, location…"
              className={inputClass}
            />
          </label>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {lead.appointmentAt || isCompleted ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void clear()}
              className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-admin-border-strong bg-admin-surface px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft disabled:cursor-wait disabled:opacity-70"
            >
              Clear
            </button>
          ) : null}
          {!isCompleted && (lead.appointmentAt || appointmentAt.trim()) ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void markCompleted()}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft disabled:cursor-wait disabled:opacity-70"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}
              Mark completed
            </button>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {saving
              ? "Saving…"
              : isCompleted
                ? "Reschedule"
                : "Save appointment"}
          </button>
        </div>
      </form>
    </section>
  );
}

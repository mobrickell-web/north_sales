"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Loader2, Trash2, X } from "lucide-react";

import {
  ANNUAL_GROSS_REVENUE_KIND_LABELS,
  ANNUAL_GROSS_REVENUE_KINDS,
  EXISTING_SALES_FORCE_LABELS,
  EXISTING_SALES_FORCE_VALUES,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type AnnualGrossRevenueKind,
  type CreateLeadInput,
  type ExistingSalesForce,
  type Lead,
  type LeadActivity,
  type LeadDuplicateHit,
  type LeadOwner,
  type LeadStatus,
  type UpdateLeadInput,
  addLeadActivity,
  assignLead,
  createLead,
  deleteLead,
  isLeadDuplicatesError,
  leadDisplayName,
  leadOwnerLabel,
  listLeadActivities,
  updateLead,
} from "@/lib/leads-api";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-admin-border-strong bg-admin-surface px-3 py-2.5 text-[13px] text-admin-text-strong outline-none transition-colors placeholder:text-admin-subtle focus:border-admin-gold-deep focus:ring-2 focus:ring-admin-gold/25";

const selectClass = cn(inputClass, "cursor-pointer");

const labelClass =
  "mb-1.5 block text-[12px] font-medium text-admin-text-strong";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function errorMessage(cause: unknown, fallback: string) {
  return cause instanceof Error && cause.message ? cause.message : fallback;
}

function DialogFrame({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Dialog.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[92dvh] w-[calc(100vw-24px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-admin-surface font-sans shadow-2xl",
          className,
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-admin-border px-5 py-4 sm:px-6">
          <div>
            <Dialog.Title className="text-[18px] font-semibold text-admin-text-strong">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-[12px] leading-relaxed text-admin-muted">
              {description}
            </Dialog.Description>
          </div>
          <Dialog.Close
            aria-label="Close"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-admin-muted hover:bg-admin-soft hover:text-admin-text-strong"
          >
            <X className="size-4" />
          </Dialog.Close>
        </header>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

type FormState = {
  companyName: string;
  website: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  /** A12 — amount free-text. */
  annualRevenue: string;
  /** A12 — "" = unset. */
  annualGrossRevenueKind: AnnualGrossRevenueKind | "";
  /** A12 — "" = unset. */
  existingSalesForce: ExistingSalesForce | "";
  /** A12 — string in the input; parsed to int on save. */
  numberOfSalesRepresentatives: string;
  leadSource: string;
  notes: string;
  status: LeadStatus;
  notQualifiedReason: string;
  followUpAt: string;
  appointmentAt: string;
};

function toDatetimeLocalValue(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string) {
  if (!value.trim()) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

function toFormState(lead: Lead | null): FormState {
  return {
    companyName: lead?.companyName ?? "",
    website: lead?.website ?? "",
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    address: lead?.address ?? "",
    annualRevenue: lead?.annualRevenue ?? "",
    annualGrossRevenueKind: lead?.annualGrossRevenueKind ?? "",
    existingSalesForce: lead?.existingSalesForce ?? "",
    numberOfSalesRepresentatives:
      lead?.numberOfSalesRepresentatives != null
        ? String(lead.numberOfSalesRepresentatives)
        : "",
    leadSource: lead?.leadSource ?? "",
    notes: lead?.notes ?? "",
    status: lead?.status ?? "NEW_PROSPECT",
    notQualifiedReason: lead?.notQualifiedReason ?? "",
    followUpAt: toDatetimeLocalValue(lead?.followUpAt),
    appointmentAt: toDatetimeLocalValue(lead?.appointmentAt),
  };
}

function parseSalesRepCount(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return undefined;
  return Number(trimmed);
}

/** Matches OwnerFilterDropdown / leads list filter styling. */
function LeadStatusDropdown({
  value,
  onChange,
  id = "lead-status-options",
}: {
  value: LeadStatus;
  onChange: (value: LeadStatus) => void;
  id?: string;
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
    const closeOnKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnKey);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnKey);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label="Status"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-left text-[13px] font-medium text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info"
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
          id={id}
          role="listbox"
          aria-label="Status"
          className="mt-1.5 max-h-60 w-full overflow-y-auto overscroll-contain rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg [scrollbar-width:thin]"
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

export function LeadFormDialog({
  open,
  lead,
  assignees,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  lead: Lead | null;
  /** When provided (Admin CRM), create shows optional assignee (Unassigned allowed). */
  assignees?: LeadOwner[];
  onOpenChange: (open: boolean) => void;
  onSaved: (lead: Lead, mode: "created" | "updated") => void;
}) {
  const showOwnerPicker = Boolean(assignees && assignees.length > 0 && !lead);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogFrame
        title={lead ? "Edit lead" : "Add lead"}
        description={
          lead
            ? "Update company, status, contact details, and notes."
            : showOwnerPicker
              ? "Company name is required. Assignee is optional — leave Unassigned to assign later."
              : "Company name is required. Add whatever contact details you have."
        }
        className="max-w-[560px]"
      >
        {/* Remount per lead so the form starts from that lead's values. */}
        {open ? (
          <LeadForm
            key={lead?.id ?? "new"}
            lead={lead}
            assignees={assignees}
            onCancel={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        ) : null}
      </DialogFrame>
    </Dialog.Root>
  );
}

function LeadForm({
  lead,
  assignees,
  onCancel,
  onSaved,
}: {
  lead: Lead | null;
  assignees?: LeadOwner[];
  onCancel: () => void;
  onSaved: (lead: Lead, mode: "created" | "updated") => void;
}) {
  const showOwnerPicker = Boolean(assignees && assignees.length > 0 && !lead);
  const [form, setForm] = useState<FormState>(() => toFormState(lead));
  const [ownerId, setOwnerId] = useState("");
  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const ownerMenuRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [duplicates, setDuplicates] = useState<LeadDuplicateHit[]>([]);

  useEffect(() => {
    if (!ownerMenuOpen) return;
    const close = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !ownerMenuRef.current?.contains(event.target)
      ) {
        setOwnerMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [ownerMenuOpen]);

  const update =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setError("");
      setDuplicates([]);
    };

  const saveLead = async (acknowledgeDuplicates = false) => {
    const values: FormState = {
      companyName: form.companyName.trim(),
      website: form.website.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      annualRevenue: form.annualRevenue.trim(),
      annualGrossRevenueKind: form.annualGrossRevenueKind,
      existingSalesForce: form.existingSalesForce,
      numberOfSalesRepresentatives: form.numberOfSalesRepresentatives.trim(),
      leadSource: form.leadSource.trim(),
      notes: form.notes.trim(),
      status: form.status,
      notQualifiedReason: form.notQualifiedReason.trim(),
      followUpAt: form.followUpAt,
      appointmentAt: form.appointmentAt,
    };

    if (!values.companyName) {
      setError("Please enter the company name.");
      return;
    }
    if (values.email && !EMAIL_PATTERN.test(values.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const salesRepCount = parseSalesRepCount(
      values.numberOfSalesRepresentatives,
    );
    if (salesRepCount === undefined) {
      setError("Number of Sales Representatives must be a whole number.");
      return;
    }
    if (values.status === "NOT_QUALIFIED" && !values.notQualifiedReason) {
      setError("Not Qualified requires a reason.");
      return;
    }
    if (values.status === "CALLBACK_REQUIRED" && !values.followUpAt) {
      setError("Callback Required requires a follow-up date/time.");
      return;
    }
    if (values.status === "ZOOM_SCHEDULED" && !values.appointmentAt) {
      setError("Zoom Scheduled requires a date/time.");
      return;
    }
    if (values.status === "APPOINTMENT_COMPLETED" && !values.appointmentAt) {
      setError(
        "Appointment Completed needs a scheduled date/time (or use Mark completed in CRM).",
      );
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (lead) {
        const input: UpdateLeadInput = {
          companyName: values.companyName,
          website: values.website,
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          annualRevenue: values.annualRevenue,
          annualGrossRevenueKind: values.annualGrossRevenueKind,
          existingSalesForce: values.existingSalesForce,
          numberOfSalesRepresentatives: salesRepCount,
          leadSource: values.leadSource,
          notes: values.notes,
          status: values.status,
          notQualifiedReason: values.notQualifiedReason,
          followUpAt: fromDatetimeLocalValue(values.followUpAt),
          appointmentAt: fromDatetimeLocalValue(values.appointmentAt),
          acknowledgeDuplicates: acknowledgeDuplicates || undefined,
        };
        onSaved(await updateLead(lead.id, input), "updated");
      } else {
        const input: CreateLeadInput = { companyName: values.companyName };
        if (showOwnerPicker && ownerId) input.ownerId = ownerId;
        if (values.website) input.website = values.website;
        if (values.name) input.name = values.name;
        if (values.email) input.email = values.email;
        if (values.phone) input.phone = values.phone;
        if (values.address) input.address = values.address;
        if (values.annualRevenue) input.annualRevenue = values.annualRevenue;
        if (values.annualGrossRevenueKind) {
          input.annualGrossRevenueKind = values.annualGrossRevenueKind;
        }
        if (values.existingSalesForce) {
          input.existingSalesForce = values.existingSalesForce;
        }
        if (salesRepCount != null) {
          input.numberOfSalesRepresentatives = salesRepCount;
        }
        if (values.leadSource) input.leadSource = values.leadSource;
        if (values.notes) input.notes = values.notes;
        if (acknowledgeDuplicates) input.acknowledgeDuplicates = true;
        onSaved(await createLead(input), "created");
      }
    } catch (cause) {
      if (isLeadDuplicatesError(cause)) {
        setDuplicates(cause.duplicates);
        setError(
          "Possible duplicate leads found. Review the matches below, or save anyway.",
        );
      } else {
        setDuplicates([]);
        setError(
          errorMessage(cause, "Could not save the lead. Please try again."),
        );
      }
      setSaving(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void saveLead(false);
  };

  return (
    <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2 sm:px-6">
        <label className="sm:col-span-2">
          <span className={labelClass}>
            Company name <span className="text-admin-danger">*</span>
          </span>
          <input
            value={form.companyName}
            onChange={update("companyName")}
            required
            maxLength={200}
            autoComplete="off"
            autoFocus
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Company website</span>
          <input
            type="url"
            value={form.website}
            onChange={update("website")}
            maxLength={255}
            placeholder="https://"
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Annual Gross Revenue</span>
          <input
            value={form.annualRevenue}
            onChange={update("annualRevenue")}
            maxLength={100}
            placeholder="Amount or band"
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Revenue type</span>
          <select
            value={form.annualGrossRevenueKind}
            onChange={update("annualGrossRevenueKind")}
            className={selectClass}
          >
            <option value="">Select…</option>
            {ANNUAL_GROSS_REVENUE_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {ANNUAL_GROSS_REVENUE_KIND_LABELS[kind]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>Existing Sales Force</span>
          <select
            value={form.existingSalesForce}
            onChange={update("existingSalesForce")}
            className={selectClass}
          >
            <option value="">Select…</option>
            {EXISTING_SALES_FORCE_VALUES.map((value) => (
              <option key={value} value={value}>
                {EXISTING_SALES_FORCE_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>Number of Sales Representatives</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={99999}
            step={1}
            value={form.numberOfSalesRepresentatives}
            onChange={update("numberOfSalesRepresentatives")}
            placeholder="e.g. 5"
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Lead Source</span>
          <input
            value={form.leadSource}
            onChange={update("leadSource")}
            maxLength={150}
            placeholder="Referral, website, cold call…"
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Contact name</span>
          <input
            value={form.name}
            onChange={update("name")}
            maxLength={150}
            autoComplete="off"
            className={inputClass}
          />
        </label>
        {showOwnerPicker && assignees ? (
          <div className="sm:col-span-2">
            <span className={labelClass}>Assigned Sales Representative</span>
            <div ref={ownerMenuRef} className="relative">
              <button
                type="button"
                aria-label="Assigned Sales Representative"
                aria-haspopup="listbox"
                aria-expanded={ownerMenuOpen}
                onClick={() => setOwnerMenuOpen((open) => !open)}
                className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-left text-[13px] font-medium text-admin-text-strong shadow-admin-card hover:bg-admin-soft"
              >
                <span
                  className={cn(
                    "truncate",
                    !ownerId && "font-normal text-admin-muted",
                  )}
                >
                  {ownerId
                    ? (assignees.find((item) => item.id === ownerId)?.name ??
                      "Select rep")
                    : "Unassigned"}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-admin-muted transition-transform",
                    ownerMenuOpen && "rotate-180",
                  )}
                />
              </button>
              {ownerMenuOpen ? (
                <div
                  role="listbox"
                  className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full overflow-y-auto rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={!ownerId}
                    onClick={() => {
                      setOwnerId("");
                      setOwnerMenuOpen(false);
                      setError("");
                    }}
                    className={cn(
                      "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px]",
                      !ownerId
                        ? "bg-admin-navy font-medium text-admin-surface"
                        : "text-admin-text-strong hover:bg-admin-soft",
                    )}
                  >
                    Unassigned
                  </button>
                  {assignees.map((assignee) => (
                    <button
                      key={assignee.id}
                      type="button"
                      role="option"
                      aria-selected={assignee.id === ownerId}
                      onClick={() => {
                        setOwnerId(assignee.id);
                        setOwnerMenuOpen(false);
                        setError("");
                      }}
                      className={cn(
                        "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px]",
                        assignee.id === ownerId
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
          </div>
        ) : null}
        {lead ? (
          <>
            <div className="sm:col-span-2">
              <span className={labelClass}>Current Status</span>
              <LeadStatusDropdown
                id="lead-edit-status-options"
                value={form.status}
                onChange={(status) => {
                  setForm((current) => ({ ...current, status }));
                  setError("");
                }}
              />
            </div>
            {form.status === "NOT_QUALIFIED" ? (
              <label className="sm:col-span-2">
                <span className={labelClass}>
                  Not qualified reason{" "}
                  <span className="text-admin-danger">*</span>
                </span>
                <textarea
                  value={form.notQualifiedReason}
                  onChange={update("notQualifiedReason")}
                  rows={2}
                  maxLength={5000}
                  className={cn(inputClass, "resize-none")}
                />
              </label>
            ) : null}
            {form.status === "CALLBACK_REQUIRED" ? (
              <label className="sm:col-span-2">
                <span className={labelClass}>
                  Follow-up date/time{" "}
                  <span className="text-admin-danger">*</span>
                </span>
                <input
                  type="datetime-local"
                  value={form.followUpAt}
                  onChange={update("followUpAt")}
                  className={inputClass}
                />
              </label>
            ) : null}
            {form.status === "ZOOM_SCHEDULED" ||
            form.status === "APPOINTMENT_COMPLETED" ? (
              <label className="sm:col-span-2">
                <span className={labelClass}>
                  {form.status === "APPOINTMENT_COMPLETED"
                    ? "Appointment date/time"
                    : "Zoom date/time"}{" "}
                  <span className="text-admin-danger">*</span>
                </span>
                <input
                  type="datetime-local"
                  value={form.appointmentAt}
                  onChange={update("appointmentAt")}
                  className={inputClass}
                />
              </label>
            ) : null}
          </>
        ) : null}
        <label>
          <span className={labelClass}>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            maxLength={255}
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Phone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            maxLength={40}
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Address</span>
          <input
            value={form.address}
            onChange={update("address")}
            maxLength={300}
            autoComplete="off"
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Notes</span>
          <textarea
            value={form.notes}
            onChange={update("notes")}
            rows={5}
            maxLength={5000}
            className={cn(inputClass, "resize-none")}
          />
        </label>
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-[#f3c9c9] bg-[#fdf3f3] px-3 py-2 text-[13px] text-[#8f2d2d] sm:col-span-2"
          >
            {error}
          </p>
        ) : null}
        {duplicates.length > 0 ? (
          <div className="rounded-xl border border-[#f0d7a8] bg-[#fff8eb] px-3 py-3 sm:col-span-2">
            <p className="text-[12px] font-semibold text-admin-text-strong">
              Possible duplicates
            </p>
            <ul className="mt-2 space-y-2">
              {duplicates.map((hit) => (
                <li
                  key={hit.id}
                  className="rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-[12px] text-admin-text"
                >
                  <p className="font-medium text-admin-text-strong">
                    {hit.companyName}
                  </p>
                  <p className="mt-0.5 text-admin-muted">
                    {LEAD_STATUS_LABELS[hit.status]} ·{" "}
                    {hit.owner?.name ?? "Unassigned"}
                    {hit.matchedOn.length > 0
                      ? ` · matched on ${hit.matchedOn.join(", ")}`
                      : null}
                  </p>
                  {hit.phone || hit.website ? (
                    <p className="mt-0.5 truncate text-admin-muted">
                      {[hit.phone, hit.website].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-admin-border px-5 py-3 sm:px-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-admin-border-strong bg-admin-surface px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft"
        >
          Cancel
        </button>
        {duplicates.length > 0 ? (
          <button
            type="button"
            disabled={saving}
            onClick={() => void saveLead(true)}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#e2b35a] bg-[#fff8eb] px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-[#fff1d6] disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {saving ? "Saving…" : lead ? "Save anyway" : "Add anyway"}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface transition-colors hover:bg-admin-assessment-gold-hover disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving
            ? "Saving…"
            : duplicates.length > 0
              ? "Check again"
              : lead
                ? "Save changes"
                : "Add lead"}
        </button>
      </footer>
    </form>
  );
}

export function DeleteLeadDialog({
  lead,
  onOpenChange,
  onDeleted,
}: {
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: (lead: Lead) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    if (!lead) return;
    setDeleting(true);
    setError("");
    try {
      await deleteLead(lead.id);
      onDeleted(lead);
    } catch (cause) {
      setError(
        errorMessage(cause, "Could not delete the lead. Please try again."),
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog.Root
      open={lead !== null}
      onOpenChange={(open) => {
        if (!open) setError("");
        onOpenChange(open);
      }}
    >
      <DialogFrame
        title="Delete lead?"
        description={
          lead
            ? `${leadDisplayName(lead)} and their notes will be permanently removed.`
            : ""
        }
        className="max-w-[440px]"
      >
        <div className="px-5 py-4 sm:px-6">
          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-[#f3c9c9] bg-[#fdf3f3] px-3 py-2 text-[13px] text-[#8f2d2d]"
            >
              {error}
            </p>
          ) : (
            <p className="text-[13px] text-admin-muted">
              This can&apos;t be undone.
            </p>
          )}
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-admin-border px-5 py-3 sm:px-6">
          <Dialog.Close className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-admin-border-strong bg-admin-surface px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft">
            Cancel
          </Dialog.Close>
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={deleting}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#8f2d2d] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#7a2525] disabled:cursor-wait disabled:opacity-70"
          >
            {deleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {deleting ? "Deleting…" : "Delete lead"}
          </button>
        </footer>
      </DialogFrame>
    </Dialog.Root>
  );
}

export function AssignLeadDialog({
  lead,
  assignees,
  onOpenChange,
  onAssigned,
}: {
  lead: Lead | null;
  assignees: LeadOwner[];
  onOpenChange: (open: boolean) => void;
  onAssigned: (lead: Lead) => void;
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
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-24px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-2xl bg-admin-surface shadow-2xl">
          <header className="flex items-start justify-between gap-4 rounded-t-2xl border-b border-admin-border px-5 py-4">
            <div>
              <Dialog.Title className="text-[18px] font-semibold text-admin-text-strong">
                {lead?.owner ? "Reassign rep" : "Assign rep"}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-[12px] text-admin-muted">
                {lead
                  ? lead.owner
                    ? `Reassign ${leadDisplayName(lead)} to another Sales Representative. History stays on this record.`
                    : `Assign ${leadDisplayName(lead)} to an active Sales Representative.`
                  : ""}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-lg text-admin-muted hover:bg-admin-soft"
            >
              <X className="size-4" />
            </Dialog.Close>
          </header>
          {lead ? (
            <AssignLeadForm
              key={lead.id}
              lead={lead}
              assignees={assignees}
              onAssigned={onAssigned}
            />
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function AssignLeadForm({
  lead,
  assignees,
  onAssigned,
}: {
  lead: Lead;
  assignees: LeadOwner[];
  onAssigned: (lead: Lead) => void;
}) {
  const [ownerId, setOwnerId] = useState(lead.ownerId ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  const submit = async () => {
    if (!ownerId) {
      setError("Select a Sales Representative.");
      return;
    }
    if (ownerId === lead.ownerId) {
      setError(
        lead.ownerId
          ? "Choose a different rep to reassign."
          : "Select a Sales Representative.",
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      onAssigned(await assignLead(lead.id, ownerId));
    } catch (cause) {
      setError(errorMessage(cause, "Could not assign this lead."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="relative z-10 space-y-3 overflow-visible px-5 py-4">
        <p className="text-[12px] text-admin-muted">
          Currently{" "}
          {lead.owner ? (
            <>
              assigned to{" "}
              <span className="font-medium text-admin-text-strong">
                {leadOwnerLabel(lead)}
              </span>
            </>
          ) : (
            <span className="font-medium text-admin-text-strong">
              Unassigned
            </span>
          )}
        </p>
        <div ref={menuRef} className="relative w-full">
          <button
            type="button"
            aria-label="Assigned Account Rep"
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-left text-[13px] font-medium text-admin-text-strong shadow-admin-card hover:bg-admin-soft"
          >
            <span className={cn("truncate", !ownerId && "text-admin-muted")}>
              {assignees.find((item) => item.id === ownerId)?.name ??
                "Select rep"}
            </span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-admin-muted transition-transform",
                menuOpen && "rotate-180",
              )}
            />
          </button>
          {menuOpen ? (
            <div
              role="listbox"
              className="absolute top-[calc(100%+6px)] left-0 z-[60] max-h-60 w-full overflow-hidden rounded-xl border border-admin-border-strong bg-admin-surface shadow-lg"
            >
              <div className="max-h-60 overflow-y-auto p-1.5 [scrollbar-width:thin]">
                {assignees.map((assignee) => (
                  <button
                    key={assignee.id}
                    type="button"
                    role="option"
                    aria-selected={assignee.id === ownerId}
                    onClick={() => {
                      setOwnerId(assignee.id);
                      setMenuOpen(false);
                      setError("");
                    }}
                    className={cn(
                      "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px]",
                      assignee.id === ownerId
                        ? "bg-admin-navy font-medium text-admin-surface"
                        : "text-admin-text-strong hover:bg-admin-soft",
                    )}
                  >
                    {assignee.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-[#f3c9c9] bg-[#fdf3f3] px-3 py-2 text-[13px] text-[#8f2d2d]"
          >
            {error}
          </p>
        ) : null}
      </div>
      <footer className="flex justify-end gap-2 rounded-b-2xl border-t border-admin-border px-5 py-3">
        <Dialog.Close className="inline-flex h-10 items-center rounded-lg border border-admin-border-strong px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft">
          Cancel
        </Dialog.Close>
        <button
          type="button"
          disabled={saving}
          onClick={() => void submit()}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:opacity-70"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving ? "Assigning…" : "Assign"}
        </button>
      </footer>
    </>
  );
}

const noteDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatNoteDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : noteDateFormatter.format(date);
}

/** Append a timestamped note to the lead activity history. */
export function AddLeadNoteDialog({
  lead,
  onOpenChange,
  onSaved,
}: {
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (lead: Lead) => void;
}) {
  return (
    <Dialog.Root
      open={Boolean(lead)}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      {lead ? (
        <DialogFrame
          title="Add notes"
          description={`Add a note for ${leadDisplayName(lead)}. Notes stack over time so each call can be recorded separately.`}
          className="max-w-[520px]"
        >
          <AddLeadNoteForm
            lead={lead}
            onCancel={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        </DialogFrame>
      ) : null}
    </Dialog.Root>
  );
}

function AddLeadNoteForm({
  lead,
  onCancel,
  onSaved,
}: {
  lead: Lead;
  onCancel: () => void;
  onSaved: (lead: Lead) => void;
}) {
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) {
      setError("Enter a note before saving.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await addLeadActivity(lead.id, { type: "NOTE", body: trimmed });
      onSaved(lead);
    } catch (cause) {
      setError(errorMessage(cause, "Could not save the note."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
        <label>
          <span className={labelClass}>Note</span>
          <textarea
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setError("");
            }}
            rows={6}
            maxLength={10000}
            autoFocus
            placeholder="What happened on this call or follow-up…"
            className={cn(inputClass, "resize-none")}
          />
        </label>
        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-[#f3c9c9] bg-[#fdf3f3] px-3 py-2 text-[13px] text-[#8f2d2d]"
          >
            {error}
          </p>
        ) : null}
      </div>
      <footer className="flex justify-end gap-2 border-t border-admin-border px-5 py-3 sm:px-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center rounded-lg border border-admin-border-strong px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:opacity-70"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving ? "Saving…" : "Save note"}
        </button>
      </footer>
    </form>
  );
}

/** Read-only history of notes for a lead. */
export function ViewLeadNotesDialog({
  lead,
  onOpenChange,
}: {
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root
      open={Boolean(lead)}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      {lead ? (
        <DialogFrame
          title="View notes"
          description={`Notes for ${leadDisplayName(lead)}, newest first.`}
          className="max-w-[560px]"
        >
          <ViewLeadNotesBody
            key={lead.id}
            lead={lead}
            onClose={() => onOpenChange(false)}
          />
        </DialogFrame>
      ) : null}
    </Dialog.Root>
  );
}

function ViewLeadNotesBody({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void listLeadActivities(lead.id)
      .then((rows) => {
        if (cancelled) return;
        setNotes(rows.filter((row) => row.type === "NOTE"));
      })
      .catch((cause) => {
        if (cancelled) return;
        setError(errorMessage(cause, "Could not load notes."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lead.id]);

  const profileNotes = lead.notes?.trim() || "";

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
        {loading ? (
          <p className="flex items-center gap-2 text-[13px] text-admin-muted">
            <Loader2 className="size-4 animate-spin" />
            Loading notes…
          </p>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-[#f3c9c9] bg-[#fdf3f3] px-3 py-2 text-[13px] text-[#8f2d2d]"
          >
            {error}
          </p>
        ) : null}
        {!loading && !error ? (
          <div className="space-y-3">
            {profileNotes ? (
              <div className="rounded-xl border border-admin-border-strong bg-admin-soft/40 px-3.5 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.04em] text-admin-gold-deep uppercase">
                    Profile notes
                  </span>
                  <span className="text-[11px] text-admin-muted">
                    From lead record
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] whitespace-pre-wrap text-admin-text-strong">
                  {profileNotes}
                </p>
              </div>
            ) : null}
            {notes.length === 0 && !profileNotes ? (
              <p className="rounded-xl border border-dashed border-admin-border-strong px-4 py-8 text-center text-[13px] text-admin-muted">
                No notes yet. Use Add notes after each call to build history.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    className="rounded-xl border border-admin-border-strong bg-admin-surface px-3.5 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold tracking-[0.04em] text-admin-gold-deep uppercase">
                        Note
                      </span>
                      <span className="text-[11px] text-admin-muted">
                        {formatNoteDate(note.createdAt)} · {note.authorName}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] whitespace-pre-wrap text-admin-text-strong">
                      {note.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>
      <footer className="flex justify-end border-t border-admin-border px-5 py-3 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 items-center rounded-lg border border-admin-border-strong px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft"
        >
          Close
        </button>
      </footer>
    </>
  );
}

/** Quick Current Status update from the leads list. */
export function LeadStatusDialog({
  lead,
  onOpenChange,
  onSaved,
}: {
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (lead: Lead) => void;
}) {
  return (
    <Dialog.Root
      open={Boolean(lead)}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      {lead ? (
        <DialogFrame
          title="Lead status"
          description={`Update Current Status for ${leadDisplayName(lead)}.`}
          className="max-w-[480px]"
        >
          <LeadStatusForm
            key={lead.id}
            lead={lead}
            onCancel={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        </DialogFrame>
      ) : null}
    </Dialog.Root>
  );
}

function LeadStatusForm({
  lead,
  onCancel,
  onSaved,
}: {
  lead: Lead;
  onCancel: () => void;
  onSaved: (lead: Lead) => void;
}) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notQualifiedReason, setNotQualifiedReason] = useState(
    lead.notQualifiedReason ?? "",
  );
  const [followUpAt, setFollowUpAt] = useState(
    toDatetimeLocalValue(lead.followUpAt),
  );
  const [appointmentAt, setAppointmentAt] = useState(
    toDatetimeLocalValue(lead.appointmentAt),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "NOT_QUALIFIED" && !notQualifiedReason.trim()) {
      setError("Not Qualified requires a reason.");
      return;
    }
    if (status === "CALLBACK_REQUIRED" && !followUpAt.trim()) {
      setError("Callback Required needs a follow-up date/time.");
      return;
    }
    if (status === "ZOOM_SCHEDULED" && !appointmentAt.trim()) {
      setError("Zoom Scheduled needs a meeting date/time.");
      return;
    }
    if (status === "APPOINTMENT_COMPLETED" && !appointmentAt.trim()) {
      setError(
        "Appointment Completed needs a scheduled date/time (or use Mark completed in CRM).",
      );
      return;
    }

    const payload: UpdateLeadInput = { status };
    if (status === "NOT_QUALIFIED") {
      payload.notQualifiedReason = notQualifiedReason.trim();
    }
    if (status === "CALLBACK_REQUIRED") {
      payload.followUpAt = fromDatetimeLocalValue(followUpAt);
    }
    if (status === "ZOOM_SCHEDULED" || status === "APPOINTMENT_COMPLETED") {
      payload.appointmentAt = fromDatetimeLocalValue(appointmentAt);
    }

    setSaving(true);
    setError("");
    try {
      const updated = await updateLead(lead.id, payload);
      onSaved(updated);
    } catch (cause) {
      setError(errorMessage(cause, "Could not update lead status."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
        <div>
          <span className={labelClass}>Current Status</span>
          <LeadStatusDropdown
            id="lead-status-dialog-options"
            value={status}
            onChange={(next) => {
              setStatus(next);
              setError("");
            }}
          />
        </div>
        {status === "NOT_QUALIFIED" ? (
          <label>
            <span className={labelClass}>
              Not qualified reason <span className="text-admin-danger">*</span>
            </span>
            <textarea
              value={notQualifiedReason}
              onChange={(event) => {
                setNotQualifiedReason(event.target.value);
                setError("");
              }}
              rows={3}
              maxLength={5000}
              className={cn(inputClass, "resize-none")}
            />
          </label>
        ) : null}
        {status === "CALLBACK_REQUIRED" ? (
          <label>
            <span className={labelClass}>
              Follow-up date/time <span className="text-admin-danger">*</span>
            </span>
            <input
              type="datetime-local"
              value={followUpAt}
              onChange={(event) => {
                setFollowUpAt(event.target.value);
                setError("");
              }}
              className={inputClass}
            />
          </label>
        ) : null}
        {status === "ZOOM_SCHEDULED" || status === "APPOINTMENT_COMPLETED" ? (
          <label>
            <span className={labelClass}>
              {status === "APPOINTMENT_COMPLETED"
                ? "Appointment date/time"
                : "Zoom date/time"}{" "}
              <span className="text-admin-danger">*</span>
            </span>
            <input
              type="datetime-local"
              value={appointmentAt}
              onChange={(event) => {
                setAppointmentAt(event.target.value);
                setError("");
              }}
              className={inputClass}
            />
          </label>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-[#f3c9c9] bg-[#fdf3f3] px-3 py-2 text-[13px] text-[#8f2d2d]"
          >
            {error}
          </p>
        ) : null}
      </div>
      <footer className="flex justify-end gap-2 border-t border-admin-border px-5 py-3 sm:px-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center rounded-lg border border-admin-border-strong px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:opacity-70"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving ? "Saving…" : "Update status"}
        </button>
      </footer>
    </form>
  );
}

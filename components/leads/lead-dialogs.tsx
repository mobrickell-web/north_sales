"use client";

import { type FormEvent, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, Trash2, X } from "lucide-react";

import {
  type Lead,
  type LeadInput,
  createLead,
  deleteLead,
  updateLead,
} from "@/lib/leads-api";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-admin-border-strong bg-admin-surface px-3 py-2.5 text-[13px] text-admin-text-strong outline-none transition-colors placeholder:text-admin-subtle focus:border-admin-gold-deep focus:ring-2 focus:ring-admin-gold/25";

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

type FormState = Required<LeadInput>;

function toFormState(lead: Lead | null): FormState {
  return {
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    address: lead?.address ?? "",
    notes: lead?.notes ?? "",
  };
}

export function LeadFormDialog({
  open,
  lead,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  lead: Lead | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (lead: Lead, mode: "created" | "updated") => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogFrame
        title={lead ? "Edit lead" : "Add lead"}
        description={
          lead
            ? "Update this lead's contact details and notes."
            : "Only the name is required. Add whatever contact details you have."
        }
        className="max-w-[560px]"
      >
        {/* Remount per lead so the form starts from that lead's values. */}
        {open ? (
          <LeadForm
            key={lead?.id ?? "new"}
            lead={lead}
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
  onCancel,
  onSaved,
}: {
  lead: Lead | null;
  onCancel: () => void;
  onSaved: (lead: Lead, mode: "created" | "updated") => void;
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(lead));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setError("");
    };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values: FormState = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
    };

    if (!values.name) {
      setError("Please enter the lead's name.");
      return;
    }
    if (values.email && !EMAIL_PATTERN.test(values.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (lead) {
        // Send every field: an empty string clears it on the server.
        onSaved(await updateLead(lead.id, values), "updated");
      } else {
        const input: LeadInput = { name: values.name };
        if (values.email) input.email = values.email;
        if (values.phone) input.phone = values.phone;
        if (values.address) input.address = values.address;
        if (values.notes) input.notes = values.notes;
        onSaved(await createLead(input), "created");
      }
    } catch (cause) {
      setError(
        errorMessage(cause, "Could not save the lead. Please try again."),
      );
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(event) => void submit(event)}
      noValidate
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2 sm:px-6">
        <label className="sm:col-span-2">
          <span className={labelClass}>
            Name <span className="text-admin-danger">*</span>
          </span>
          <input
            value={form.name}
            onChange={update("name")}
            required
            maxLength={160}
            autoComplete="off"
            autoFocus
            className={inputClass}
          />
        </label>
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
            className={cn(inputClass, "resize-y")}
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
      </div>
      <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-admin-border px-5 py-3 sm:px-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-admin-border-strong bg-admin-surface px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface transition-colors hover:bg-admin-assessment-gold-hover disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving ? "Saving…" : lead ? "Save changes" : "Add lead"}
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
            ? `${lead.name} and their notes will be permanently removed.`
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

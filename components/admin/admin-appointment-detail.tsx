"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";

import {
  ACTION_LABELS,
  ACTION_TONE,
  type AdminAppointmentDetail,
  type AdminAppointmentLog,
  type AdminEmailDeliverySummary,
  type AdminStatusAction,
  STATUS_TONE,
  formatInTimezone,
  getAdminAppointment,
  humanizeEnum,
  updateAdminAppointmentStatus,
} from "@/lib/admin-appointments";
import { AdminApiError, hasSession } from "@/lib/admin-auth";
import { buildCalendarLinks } from "@/lib/calendar-links";
import { cn } from "@/lib/utils";
import { AdminAlert } from "@/components/admin/admin-ui";
import { AddToCalendar } from "@/components/schedule/add-to-calendar";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#EFEBE3] px-4 py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <span className="font-body text-[11px] font-bold tracking-[0.06em] text-[#5C5F66] uppercase">
        {label}
      </span>
      <span className="font-body text-[14px] font-semibold break-words text-[#001528] sm:text-right">
        {value}
      </span>
    </div>
  );
}

/** Keeps a recognisable tail so admin can tell the two links apart without
 *  printing the full token on screen. The full value only ever reaches the
 *  clipboard via the Copy button. */
function maskToken(token: string) {
  if (token.length <= 4) return "•".repeat(token.length);
  return `${"•".repeat(12)}${token.slice(-4)}`;
}

function TokenField({
  label,
  token,
  href,
}: {
  label: string;
  token: string;
  href: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="rounded-xl border border-[#E8E4DC] bg-[#FAF9F5] p-4">
      <p className="font-body text-[11px] font-bold tracking-[0.06em] text-[#5C5F66] uppercase">
        {label}
      </p>
      <p
        className="mt-2 font-mono text-[12px] tracking-[0.08em] text-[#8A8F98] select-none"
        aria-hidden="true"
      >
        {maskToken(token)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-[34px] items-center justify-center rounded-full border border-[#E8E4DC] bg-white px-3 font-secondary text-[11px] font-bold tracking-[0.08em] text-[#001528] uppercase transition-colors hover:border-[#b17411] hover:text-[#b17411]"
        >
          {copied ? (
            <Check className="mr-1.5 size-3.5" />
          ) : (
            <Copy className="mr-1.5 size-3.5" />
          )}
          {copied ? "Copied link" : "Copy link"}
        </button>
        <Link
          href={href}
          target="_blank"
          className="inline-flex h-[34px] items-center justify-center rounded-full border border-[#E8E4DC] bg-white px-3 font-secondary text-[11px] font-bold tracking-[0.08em] text-[#001528] uppercase transition-colors hover:border-[#b17411] hover:text-[#b17411]"
        >
          <ExternalLink className="mr-1.5 size-3.5" />
          Open
        </Link>
      </div>
    </div>
  );
}

function DeliveryRow({ delivery }: { delivery: AdminEmailDeliverySummary }) {
  const base =
    "rounded-full border px-2.5 py-0.5 font-secondary text-[11px] font-bold tracking-[0.06em] uppercase";
  const statusStyle: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    DELIVERED: {
      bg: "bg-[#f1faf3]",
      text: "text-[#1f6b33]",
      border: "border-[#bfe3c4]",
    },
    BOUNCED: {
      bg: "bg-[#fdf3f3]",
      text: "text-[#8f2d2d]",
      border: "border-[#f3c9c9]",
    },
    DROPPED: {
      bg: "bg-[#fdf3f3]",
      text: "text-[#8f2d2d]",
      border: "border-[#f3c9c9]",
    },
    DEFERRED: {
      bg: "bg-[#f6f4ee]",
      text: "text-[#5c5f66]",
      border: "border-[#d8d3c4]",
    },
    SPAMREPORT: {
      bg: "bg-[#fdf3f3]",
      text: "text-[#8f2d2d]",
      border: "border-[#f3c9c9]",
    },
    UNSUBSCRIBED: {
      bg: "bg-[#f2f7fd]",
      text: "text-[#1c4e80]",
      border: "border-[#c9dcf5]",
    },
    ACCEPTED: {
      bg: "bg-[#f7f5f0]",
      text: "text-[#5c5f66]",
      border: "border-[#e8e4dc]",
    },
  };
  const style = statusStyle[delivery.status] ?? statusStyle.ACCEPTED;

  return (
    <li className="relative pl-7">
      <span className="absolute top-1.5 left-0 size-2.5 rounded-full bg-[#b17411]" />
      <span className="absolute top-4 bottom-0 left-[4.5px] w-px bg-[#E8E4DC]" />
      <div className="flex flex-col gap-1.5 pb-5 last:pb-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(base, style.bg, style.text, style.border)}
            title={delivery.statusReason ?? undefined}
          >
            {delivery.kind} · {humanizeEnum(delivery.status)}
          </span>
          <span className="font-body text-[12px] text-[#8A8F98]">
            {formatInTimezone(delivery.createdAt, "UTC")}
          </span>
          {delivery.statusAt && (
            <span className="font-body text-[12px] text-[#8A8F98]">
              · status at {formatInTimezone(delivery.statusAt, "UTC")}
            </span>
          )}
        </div>
        {delivery.statusReason ? (
          <p className="font-body text-[13px] break-words text-[#8f2d2d]">
            {delivery.statusReason}
          </p>
        ) : null}
        <p className="font-mono text-[10.5px] text-[#8A8F98]">
          id={delivery.id} · kind={delivery.kind}
        </p>
      </div>
    </li>
  );
}

function HistoryEntry({ entry }: { entry: AdminAppointmentLog }) {
  const label = ACTION_LABELS[entry.action] ?? humanizeEnum(entry.action);
  const previous = entry.previousTime;
  const next = entry.newTime;
  const moved = Boolean(previous && next && previous !== next);
  return (
    <li className="relative pl-7">
      <span className="absolute top-1.5 left-0 size-2.5 rounded-full bg-[#b17411]" />
      <span className="absolute top-4 bottom-0 left-[4.5px] w-px bg-[#E8E4DC]" />
      <div className="flex flex-col gap-1.5 pb-5 last:pb-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 font-secondary text-[11px] font-bold tracking-[0.06em] uppercase",
              ACTION_TONE[entry.action] ??
                "border-[#E8E4DC] bg-[#F7F5F0] text-[#5C5F66]",
            )}
          >
            {label}
          </span>
          <span className="font-body text-[12px] text-[#8A8F98]">
            {formatInTimezone(entry.createdAt, "UTC")}
          </span>
        </div>

        {moved && previous && next ? (
          <p className="font-body text-[13px] text-[#5C5F66]">
            Moved from {formatInTimezone(previous, "UTC")} to{" "}
            {formatInTimezone(next, "UTC")}
          </p>
        ) : next ? (
          <p className="font-body text-[13px] text-[#5C5F66]">
            {formatInTimezone(next, "UTC")}
          </p>
        ) : null}

        {entry.adminUserName ? (
          <p className="font-body text-[12px] text-[#5C5F66]">
            by{" "}
            <span className="font-semibold text-[#001528]">
              {entry.adminUserName}
            </span>
          </p>
        ) : null}

        {entry.notes ? (
          <p className="font-body text-[13px] text-[#8A8F98]">{entry.notes}</p>
        ) : null}
      </div>
    </li>
  );
}

export function AdminAppointmentDetailView({ id }: { id: string }) {
  const router = useRouter();

  const [detail, setDetail] = useState<AdminAppointmentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [pending, setPending] = useState<AdminStatusAction | null>(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [actionError, setActionError] = useState<{
    tone: "error" | "info";
    message: string;
  } | null>(null);

  const load = useCallback(() => {
    if (!hasSession()) {
      router.replace("/admin/login");
      return;
    }

    getAdminAppointment(id)
      .then((data) => {
        setDetail(data);
        setError(null);
      })
      .catch((err: Error) => {
        if (!hasSession()) {
          router.replace("/admin/login");
          return;
        }
        setError(err.message);
      });
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  const applyStatus = async (status: AdminStatusAction) => {
    setSaving(true);
    setActionError(null);

    try {
      await updateAdminAppointmentStatus(id, status, reason);
      setPending(null);
      setReason("");
      load();
    } catch (err) {
      const apiError = err as AdminApiError;
      setActionError({
        tone: apiError.status === 400 ? "info" : "error",
        message: apiError.message,
      });
      if (apiError.status === 409) setPending(null);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <main className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
        <Link
          href="/admin/dashboard"
          className="mb-6 inline-flex items-center font-secondary text-[12px] font-bold tracking-[0.08em] text-[#b17411] uppercase hover:text-[#8f5d0e]"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to dashboard
        </Link>
        <AdminAlert>{error}</AdminAlert>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#FAF9F5]">
        <p className="flex items-center gap-2 font-body text-[14px] text-[#5C5F66]">
          <Loader2 className="size-4 animate-spin" />
          Loading appointment…
        </p>
      </main>
    );
  }

  const rescheduleUrl =
    typeof window === "undefined"
      ? undefined
      : `${window.location.origin}/appointments/reschedule/${detail.rescheduleToken}`;

  return (
    <main className="min-h-screen bg-[#FAF9F5] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-[900px] flex-col gap-6">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center font-secondary text-[12px] font-bold tracking-[0.08em] text-[#b17411] uppercase hover:text-[#8f5d0e]"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to dashboard
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-body text-[22px] font-extrabold tracking-[0.03em] text-[#001528] uppercase sm:text-[26px]">
              {detail.contactName}
            </h1>
            <span
              className={cn(
                "rounded-full border px-3 py-1 font-secondary text-[11px] font-bold tracking-[0.06em] uppercase",
                STATUS_TONE[detail.status] ??
                  "border-[#E8E4DC] bg-[#F7F5F0] text-[#5C5F66]",
              )}
            >
              {humanizeEnum(detail.status)}
            </span>
          </div>
          <p className="mt-1 font-body text-[14px] text-[#5C5F66]">
            {detail.companyName}
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white">
          <div className="h-1 w-full bg-gradient-to-r from-[#b17411] via-[#C99B31] to-[#b17411]" />
          <h2 className="border-b border-[#EFEBE3] px-4 py-3 font-body text-[13px] font-bold tracking-[0.06em] text-[#5C5F66] uppercase">
            Booking
          </h2>
          <div>
            <DetailRow label="Contact" value={detail.contactName} />
            <DetailRow label="Company" value={detail.companyName} />
            <DetailRow
              label="Email"
              value={
                <a
                  href={`mailto:${detail.email}`}
                  className="text-[#b17411] hover:underline"
                >
                  {detail.email}
                </a>
              }
            />
            {detail.phone ? (
              <DetailRow
                label="Phone"
                value={
                  <a
                    href={`tel:${detail.phone}`}
                    className="text-[#b17411] hover:underline"
                  >
                    {detail.phone}
                  </a>
                }
              />
            ) : null}
            <DetailRow
              label="Type"
              value={`${humanizeEnum(detail.appointmentType)} · ${detail.durationMinutes} min`}
            />
            <DetailRow
              label="Scheduled"
              value={formatInTimezone(
                detail.scheduledAtUtc,
                detail.prospectTimezone,
              )}
            />
            <DetailRow label="Time zone" value={detail.prospectTimezone} />
            <DetailRow
              label="Reminders"
              value={`24h ${detail.reminder24hSent ? "sent" : "pending"} · 1h ${
                detail.reminder1hSent ? "sent" : "pending"
              }`}
            />
            {detail.cancellationReason ? (
              <DetailRow
                label="Cancellation reason"
                value={detail.cancellationReason}
              />
            ) : null}
            {detail.notes ? (
              <DetailRow label="Notes" value={detail.notes} />
            ) : null}
            <DetailRow
              label="Created"
              value={formatInTimezone(detail.createdAt, "UTC")}
            />
            <DetailRow
              label="Last updated"
              value={formatInTimezone(detail.updatedAt, "UTC")}
            />
            <DetailRow
              label="ID"
              value={<span className="font-mono text-[12px]">{detail.id}</span>}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white">
          <div className="h-1 w-full bg-gradient-to-r from-[#b17411] via-[#C99B31] to-[#b17411]" />
          <div className="px-4 py-4 sm:px-6">
            <h2 className="font-body text-[15px] font-bold tracking-[0.03em] text-[#001528] uppercase">
              Admin actions
            </h2>

            {detail.status === "CANCELLED" ? (
              <p className="mt-3 font-body text-[14px] text-[#8f2d2d]">
                This appointment is cancelled and can no longer be changed.
              </p>
            ) : (
              <>
                <p className="mt-1 font-body text-[13px] text-[#8A8F98]">
                  Mark the meeting as done, or cancel it with an optional
                  reason.
                </p>

                {actionError ? (
                  <div className="mt-4">
                    <AdminAlert tone={actionError.tone}>
                      {actionError.message}
                    </AdminAlert>
                  </div>
                ) : null}

                {pending === null ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPending("COMPLETED");
                        setActionError(null);
                      }}
                      disabled={detail.status === "COMPLETED"}
                      className="inline-flex h-[42px] items-center justify-center rounded-full bg-[#b17411] px-5 font-secondary text-[12px] font-bold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#8f5d0e] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Mark completed
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPending("CANCELLED");
                        setActionError(null);
                      }}
                      className="inline-flex h-[42px] items-center justify-center rounded-full border border-[#f3c9c9] bg-white px-5 font-secondary text-[12px] font-bold tracking-[0.08em] text-[#8f2d2d] uppercase transition-colors hover:border-[#8f2d2d]"
                    >
                      Cancel appointment
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-[#E8E4DC] bg-[#FAF9F5] p-4">
                    <p className="font-body text-[13px] font-semibold text-[#001528]">
                      {pending === "COMPLETED"
                        ? "Mark this appointment as completed?"
                        : "Cancel this appointment?"}
                    </p>

                    {pending === "CANCELLED" ? (
                      <div className="mt-3">
                        <label
                          htmlFor="cancel-reason"
                          className="mb-1.5 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase"
                        >
                          Reason (optional)
                        </label>
                        <textarea
                          id="cancel-reason"
                          rows={3}
                          maxLength={500}
                          value={reason}
                          onChange={(event) => setReason(event.target.value)}
                          placeholder="e.g. Prospect requested a different date"
                          className="w-full resize-y rounded-lg border border-[#E8E4DC] bg-white px-3.5 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-[#8A8F98] focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20"
                        />
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => applyStatus(pending)}
                        disabled={saving}
                        className="inline-flex h-[42px] items-center justify-center rounded-full bg-[#001528] px-5 font-secondary text-[12px] font-bold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#0b2540] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {saving
                          ? "Saving…"
                          : pending === "COMPLETED"
                            ? "Confirm completed"
                            : "Confirm cancellation"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPending(null);
                          setReason("");
                          setActionError(null);
                        }}
                        disabled={saving}
                        className="inline-flex h-[42px] items-center justify-center rounded-full border border-[#E8E4DC] bg-white px-5 font-secondary text-[12px] font-bold tracking-[0.08em] text-[#001528] uppercase transition-colors hover:border-[#b17411] hover:text-[#b17411] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* `overflow-hidden` is lifted while the calendar panel is open so the
            absolutely-positioned dropdown is not clipped by this card. */}
        <section
          className={`relative rounded-2xl border border-[#E8E4DC] bg-white ${calendarOpen ? "z-30" : "overflow-hidden"}`}
        >
          <div
            className={`h-1 w-full bg-gradient-to-r from-[#b17411] via-[#C99B31] to-[#b17411] ${calendarOpen ? "" : "rounded-t-2xl"}`}
          />
          <div className="px-4 py-4 sm:px-6">
            <h2 className="flex items-center gap-2 font-body text-[15px] font-bold tracking-[0.03em] text-[#001528] uppercase">
              <CalendarClock className="size-4 text-[#b17411]" />
              Prospect links
            </h2>
            <p className="mt-1 font-body text-[13px] text-[#8A8F98]">
              Share these with the prospect so they can reschedule or cancel.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TokenField
                label="Reschedule link"
                token={detail.rescheduleToken}
                href={`/appointments/reschedule/${detail.rescheduleToken}`}
              />
              <TokenField
                label="Cancel link"
                token={detail.cancelToken}
                href={`/appointments/cancel/${detail.cancelToken}`}
              />
            </div>

            {detail.status !== "CANCELLED" ? (
              <div className="mt-6 border-t border-[#EFEBE3] pt-5">
                <AddToCalendar
                  links={buildCalendarLinks(detail, rescheduleUrl)}
                  heading="Put this meeting on your own calendar — opens in a new tab, no download."
                  variant="admin"
                  onOpenChange={setCalendarOpen}
                />
              </div>
            ) : null}
          </div>
        </section>
        <section className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white">
          <div className="h-1 w-full bg-gradient-to-r from-[#b17411] via-[#C99B31] to-[#b17411]" />
          <div className="px-4 py-4 sm:px-6">
            <h2 className="font-body text-[15px] font-bold tracking-[0.03em] text-[#001528] uppercase">
              Email delivery
            </h2>
            <p className="mt-1 font-body text-[13px] text-[#8A8F98]">
              {detail.emailDeliveries?.length ?? 0} email
              {detail.emailDeliveries?.length === 1 ? "" : "s"} · times in UTC
            </p>

            {!detail.emailDeliveries || detail.emailDeliveries.length === 0 ? (
              <p className="mt-4 font-body text-[14px] text-[#8A8F98]">
                No emails sent yet.
              </p>
            ) : (
              <ul className="mt-5">
                {detail.emailDeliveries.map((delivery) => (
                  <DeliveryRow key={delivery.id} delivery={delivery} />
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white">
          <div className="h-1 w-full bg-gradient-to-r from-[#b17411] via-[#C99B31] to-[#b17411]" />
          <div className="px-4 py-4 sm:px-6">
            <h2 className="font-body text-[15px] font-bold tracking-[0.03em] text-[#001528] uppercase">
              Audit trail
            </h2>
            <p className="mt-1 font-body text-[13px] text-[#8A8F98]">
              {detail.history.length} event
              {detail.history.length === 1 ? "" : "s"} · times in UTC
            </p>

            {detail.history.length === 0 ? (
              <p className="mt-4 font-body text-[14px] text-[#8A8F98]">
                No history recorded.
              </p>
            ) : (
              <ul className="mt-5">
                {detail.history.map((entry) => (
                  <HistoryEntry key={entry.id} entry={entry} />
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

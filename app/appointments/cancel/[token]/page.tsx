"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import {
  AppointmentDetailRow,
  AppointmentPageShell,
  AppointmentStateMessage,
  appointmentButtonClass,
  appointmentInputClass,
  appointmentLabelClass,
  appointmentSecondaryButtonClass,
} from "@/components/schedule/appointment";
import {
  type AppointmentRecord,
  cancelAppointment,
  formatScheduledAt,
  getAppointmentByToken,
} from "@/lib/appointment-api";

export default function CancelAppointmentPage() {
  const { token } = useParams<{ token: string }>();

  const [appointment, setAppointment] = useState<AppointmentRecord | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!token) return;
    getAppointmentByToken(token)
      .then(setAppointment)
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await cancelAppointment(
        token,
        reason.trim() ? { reason: reason.trim() } : {},
      );
      setDone(true);
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppointmentPageShell title="Cancel appointment">
        <AppointmentStateMessage tone="info">
          Loading your appointment…
        </AppointmentStateMessage>
      </AppointmentPageShell>
    );
  }

  if (loadError || !appointment) {
    return (
      <AppointmentPageShell title="Cancel appointment">
        <AppointmentStateMessage>
          {loadError ?? "This appointment link is no longer valid."}
        </AppointmentStateMessage>
      </AppointmentPageShell>
    );
  }

  if (done) {
    return (
      <AppointmentPageShell title="Appointment cancelled">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <CheckCircle2 className="size-12 text-[#b17411]" />
          <p className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
            Your appointment has been cancelled. A confirmation email has been
            sent to you.
          </p>
          <Link href="/" className={appointmentButtonClass}>
            Back to home
          </Link>
        </div>
      </AppointmentPageShell>
    );
  }

  const cancelled = appointment.status === "CANCELLED";
  const completed = appointment.status === "COMPLETED";

  return (
    <AppointmentPageShell
      title="Cancel appointment"
      subtitle="We're sorry to see this go. Confirm below to cancel your appointment."
    >
      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-xl border border-[#E8E4DC]">
          <AppointmentDetailRow
            label="Company"
            value={appointment.companyName}
          />
          <AppointmentDetailRow
            label="Date & Time"
            value={formatScheduledAt(appointment.scheduledAtUtc)}
          />
        </div>

        {cancelled || completed ? (
          <AppointmentStateMessage tone="info">
            {cancelled
              ? "This appointment is already cancelled."
              : "This appointment is marked as completed and can no longer be cancelled."}
          </AppointmentStateMessage>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="reason" className={appointmentLabelClass}>
                Reason for cancelling (optional)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Let us know if there's anything we can help with."
                className={appointmentInputClass}
              />
            </div>

            {submitError ? (
              <AppointmentStateMessage>{submitError}</AppointmentStateMessage>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className={`${appointmentButtonClass} flex-1`}
              >
                {submitting ? "Cancelling…" : "Confirm cancellation"}
              </button>
              <Link
                href="/"
                className={`${appointmentSecondaryButtonClass} flex-1`}
              >
                Back to home
              </Link>
            </div>
          </form>
        )}
      </div>
    </AppointmentPageShell>
  );
}

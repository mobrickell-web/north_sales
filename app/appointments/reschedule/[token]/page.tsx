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
import { AddToCalendar } from "@/components/schedule/add-to-calendar";
import { siteConfig } from "@/config/site";
import {
  type AppointmentRecord,
  formatScheduledAt,
  getAppointmentByToken,
  rescheduleAppointment,
} from "@/lib/appointment-api";
import { buildCalendarLinks, ianaForTimezone } from "@/lib/calendar-links";

function slotParts(slot: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.trim());
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

/** UTC ms for a wall-clock time in an IANA zone (samples the offset twice to
 *  stay correct across daylight-saving boundaries). */
function zonedTimeToUtcMs(
  dateValue: string,
  hour: number,
  minute: number,
  iana: string,
) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const offsetAt = (ts: number) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: iana,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(new Date(ts));
    const get = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value ?? 0);
    const asUtc = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour") % 24,
      get("minute"),
      get("second"),
    );
    return asUtc - ts;
  };
  let ts = utcGuess - offsetAt(utcGuess);
  ts = utcGuess - offsetAt(ts);
  return ts;
}

function isPastSlot(dateValue: string, slot: string, timezone: string) {
  if (!dateValue) return false;
  const parts = slotParts(slot);
  if (!parts) return false;
  return (
    zonedTimeToUtcMs(
      dateValue,
      parts.hour,
      parts.minute,
      ianaForTimezone(timezone),
    ) <= Date.now()
  );
}

export default function RescheduleAppointmentPage() {
  const { token } = useParams<{ token: string }>();
  const { timeSlots, timezones } = siteConfig.appointmentForm;

  const [appointment, setAppointment] = useState<AppointmentRecord | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    if (!token) return;
    getAppointmentByToken(token)
      .then((record) => {
        setAppointment(record);
        setTimezone(record.prospectTimezone ?? timezones[0]);
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [token, timezones]);

  const today = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  })();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !date || !time || !timezone) {
      setSubmitError("Please choose a new date, time and time zone.");
      return;
    }
    if (isPastSlot(date, time, timezone)) {
      setSubmitError("Please choose a future date and time.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const updated = await rescheduleAppointment(token, {
        date,
        time,
        timezone,
      });
      // The calendar links must reflect the NEW time, not the loaded one.
      setAppointment(updated);
      setDone(true);
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppointmentPageShell title="Reschedule appointment">
        <AppointmentStateMessage tone="info">
          Loading your appointment…
        </AppointmentStateMessage>
      </AppointmentPageShell>
    );
  }

  if (loadError || !appointment) {
    return (
      <AppointmentPageShell title="Reschedule appointment">
        <AppointmentStateMessage>
          {loadError ?? "This appointment link is no longer valid."}
        </AppointmentStateMessage>
      </AppointmentPageShell>
    );
  }

  if (done) {
    return (
      <AppointmentPageShell title="Appointment rescheduled">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle2 className="size-12 text-[#b17411]" />
            <p className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
              Your appointment has been rescheduled. A confirmation email is on
              its way.
            </p>
          </div>

          <AddToCalendar links={buildCalendarLinks(appointment)} />

          <Link href="/" className={appointmentSecondaryButtonClass}>
            Back to home
          </Link>
        </div>
      </AppointmentPageShell>
    );
  }

  const locked =
    appointment.status === "COMPLETED" || appointment.status === "NO_SHOW";

  return (
    <AppointmentPageShell
      title="Reschedule appointment"
      subtitle="Pick a new date and time that works for you."
    >
      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-xl border border-[#E8E4DC]">
          <AppointmentDetailRow
            label="Current Date & Time"
            value={formatScheduledAt(appointment.scheduledAtUtc)}
          />
          <AppointmentDetailRow
            label="Company"
            value={appointment.companyName}
          />
        </div>

        {appointment.status === "CANCELLED" ? (
          <AppointmentStateMessage tone="info">
            This appointment was cancelled. Pick a new date and time below to
            reinstate it — the time must be different from the cancelled slot.
          </AppointmentStateMessage>
        ) : null}

        {locked ? (
          <AppointmentStateMessage>
            This appointment can no longer be rescheduled.
          </AppointmentStateMessage>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="date" className={appointmentLabelClass}>
                New Date
              </label>
              <input
                id="date"
                type="date"
                min={today}
                value={date}
                onChange={(event) => {
                  const nextDate = event.target.value;
                  setDate(nextDate);
                  if (isPastSlot(nextDate, time, timezone)) setTime("");
                  setSubmitError(null);
                }}
                className={appointmentInputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="time" className={appointmentLabelClass}>
                New Time
              </label>
              <select
                id="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className={appointmentInputClass}
                required
              >
                <option value="" disabled>
                  Select a time
                </option>
                {timeSlots.map((slot) => (
                  <option
                    key={slot}
                    value={slot}
                    disabled={isPastSlot(date, slot, timezone)}
                  >
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className={appointmentLabelClass}>
                Time Zone
              </label>
              <select
                id="timezone"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className={appointmentInputClass}
                required
              >
                {timezones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>

            {submitError ? (
              <AppointmentStateMessage>{submitError}</AppointmentStateMessage>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className={appointmentButtonClass}
            >
              {submitting ? "Rescheduling…" : "Confirm new time"}
            </button>
          </form>
        )}
      </div>
    </AppointmentPageShell>
  );
}

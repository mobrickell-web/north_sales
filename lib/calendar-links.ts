const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

import { humanizeAppointmentType } from "./appointment-api";

const TIMEZONE_IANA: Record<string, string> = {
  "Eastern Time (ET) — US East Coast": "America/New_York",
  "Central Time (CT) — US Central": "America/Chicago",
  "Mountain Time (MT) — US Mountain": "America/Denver",
  "Mountain Time (MT) — Arizona (no daylight saving)": "America/Phoenix",
  "Pacific Time (PT) — US West Coast": "America/Los_Angeles",
  "Alaska Time (AKT) — Alaska": "America/Anchorage",
  "Hawaii-Aleutian Time (HAT) — Aleutian Islands, Alaska": "America/Adak",
  "Hawaii Time (HT) — Hawaii": "Pacific/Honolulu",
  "Atlantic Time (AST) — Puerto Rico & US Virgin Islands":
    "America/Puerto_Rico",
  "Chamorro Time (ChST) — Guam & Northern Mariana Islands": "Pacific/Guam",
  "Samoa Time (SST) — American Samoa": "Pacific/Pago_Pago",
};

export const CALENDAR_ORG = "NORTH POINT SALES GROUP";
export const CALENDAR_CONTACT = "contact@northpointsalesgroup.com";

export type CalendarLinkSet = {
  google: string;
  outlook: string;
  ics: string;
};

export type CalendarEventInput = {
  appointmentType: string;
  contactName: string;
  companyName: string | null;
  scheduledAtUtc: string;
  durationMinutes: number | null;
  prospectTimezone: string | null;
  rescheduleToken: string;
};

/** Compact UTC stamp Google/Outlook expect: 20261220T150000Z */
function compactUtc(date: Date): string {
  return date
    .toISOString()
    .replaceAll(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function ianaForTimezone(label: string | null): string {
  if (!label) return "UTC";
  return TIMEZONE_IANA[label] ?? "UTC";
}

/**
 * Builds Google / Outlook deep links plus the .ics fallback. Google and Outlook
 * open their own composer in a new tab, so nothing is downloaded; the .ics link
 * is only for manual import (Apple Calendar, desktop clients).
 *
 * Mirrors backend/src/modules/appointments/calendar-links.ts — keep in sync.
 */
export function buildCalendarLinks(
  appointment: CalendarEventInput,
  rescheduleUrl?: string,
): CalendarLinkSet {
  const start = new Date(appointment.scheduledAtUtc);
  const end = new Date(
    start.getTime() + (appointment.durationMinutes || 30) * 60 * 1000,
  );

  const timezoneLabel = appointment.prospectTimezone || "UTC";
  const iana = ianaForTimezone(timezoneLabel);
  const when = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: iana,
  }).format(start);

  const summary = `${humanizeAppointmentType(appointment.appointmentType)} with ${CALENDAR_ORG}`;
  const description = [
    `${humanizeAppointmentType(appointment.appointmentType)} with ${CALENDAR_ORG}.`,
    `When: ${when} (${timezoneLabel})`,
    `Contact: ${appointment.contactName}${appointment.companyName ? ` — ${appointment.companyName}` : ""}`,
    ...(rescheduleUrl
      ? [`Need to change this? Reschedule: ${rescheduleUrl}`]
      : []),
  ].join("\n");

  const location = `Contact: ${CALENDAR_CONTACT}`;

  const google = new URLSearchParams({
    action: "TEMPLATE",
    text: summary,
    dates: `${compactUtc(start)}/${compactUtc(end)}`,
    details: description,
    location,
    ctz: iana,
  });

  const outlook = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: summary,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: description,
    location,
  });

  return {
    google: `https://calendar.google.com/calendar/render?${google.toString()}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?${outlook.toString()}`,
    ics: `${API_URL.replace(/\/+$/, "")}/api/v1/appointments/${encodeURIComponent(appointment.rescheduleToken)}/calendar.ics`,
  };
}

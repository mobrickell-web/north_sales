import { adminFetch } from "@/lib/admin-auth";

export const ADMIN_TABS = ["upcoming", "completed", "cancelled"] as const;
export type AdminTab = (typeof ADMIN_TABS)[number];

/** The latest provider-reported outcome for one outbound email on an appointment. */
export type AdminEmailDeliverySummary = {
  id: string;
  kind: string;
  status: string;
  statusReason: string | null;
  statusAt: string | null;
  createdAt: string;
};

export type AdminAppointment = {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string | null;
  notes: string | null;
  appointmentType: string;
  durationMinutes: number;
  scheduledAtUtc: string;
  prospectTimezone: string;
  status: string;
  rescheduleToken: string;
  cancelToken: string;
  cancellationReason: string | null;
  reminder24hSent: boolean;
  reminder24hSentAt: string | null;
  reminder1hSent: boolean;
  reminder1hSentAt: string | null;
  createdAt: string;
  updatedAt: string;
  emailDelivery: AdminEmailDeliverySummary | null;
};

export type AdminAppointmentList = {
  items: AdminAppointment[];
  total: number;
  skip: number;
  take: number;
};

export type AdminAppointmentLog = {
  id: string;
  appointmentId: string;
  action: string;
  previousTime: string | null;
  newTime: string | null;
  notes: string | null;
  adminUserId: string | null;
  /** Name of the admin who performed the action. Null for prospect/system actions. */
  adminUserName: string | null;
  createdAt: string;
};

export type AdminAppointmentDetail = AdminAppointment & {
  history: AdminAppointmentLog[];
  emailDeliveries: AdminEmailDeliverySummary[];
};

export type AdminAppointmentQuery = {
  status?: AdminTab;
  search?: string;
  from?: string;
  to?: string;
  skip?: number;
  take?: number;
};

export function listAdminAppointments(query: AdminAppointmentQuery) {
  const params = new URLSearchParams();

  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.skip !== undefined) params.set("skip", String(query.skip));
  if (query.take !== undefined) params.set("take", String(query.take));

  const suffix = params.toString();
  return adminFetch<AdminAppointmentList>(
    `/api/v1/admin/appointments${suffix ? `?${suffix}` : ""}`,
  );
}

export function getAdminAppointment(id: string) {
  return adminFetch<AdminAppointmentDetail>(
    `/api/v1/admin/appointments/${encodeURIComponent(id)}`,
  );
}

export type AdminStatusAction = "COMPLETED" | "CANCELLED";

export function updateAdminAppointmentStatus(
  id: string,
  status: AdminStatusAction,
  reason?: string,
) {
  const trimmed = reason?.trim();
  return adminFetch<AdminAppointment>(
    `/api/v1/admin/appointments/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(trimmed ? { status, reason: trimmed } : { status }),
    },
  );
}

function addUtcDays(date: string, days: number) {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

export function buildAppointmentQuery(
  state: Omit<AdminAppointmentQuery, "to"> & { to?: string },
): AdminAppointmentQuery {
  return {
    ...state,
    to: state.to ? addUtcDays(state.to, 1) : undefined,
  };
}

export const TIMEZONE_IANA: Record<string, string> = {
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

function resolveTimezone(label: string) {
  const mapped = TIMEZONE_IANA[label];
  if (mapped) return mapped;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: label });
    return label;
  } catch {
    return "UTC";
  }
}

export function formatInTimezone(iso: string, timeZoneLabel: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat("en-US", {
    timeZone: resolveTimezone(timeZoneLabel),
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function humanizeEnum(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export const STATUS_TONE: Record<string, string> = {
  CONFIRMED: "border-[#bfe3c4] bg-[#f1faf3] text-[#1f6b33]",
  RESCHEDULED: "border-[#c9dcf5] bg-[#f2f7fd] text-[#1c4e80]",
  COMPLETED: "border-[#d8d3c4] bg-[#f6f4ee] text-[#5c5f66]",
  CANCELLED: "border-[#f3c9c9] bg-[#fdf3f3] text-[#8f2d2d]",
  NO_SHOW: "border-[#f3dcc4] bg-[#fdf7f0] text-[#8a5a10]",
};

export const ACTION_TONE: Record<string, string> = {
  BOOKED: "border-[#c9dcf5] bg-[#f2f7fd] text-[#1c4e80]",
  CONFIRMATION_EMAIL_SENT: "border-[#bfe3c4] bg-[#f1faf3] text-[#1f6b33]",
  REMINDER_24H_SENT: "border-[#d8d3c4] bg-[#f6f4ee] text-[#5c5f66]",
  REMINDER_1H_SENT: "border-[#d8d3c4] bg-[#f6f4ee] text-[#5c5f66]",
  RESCHEDULED_BY_PROSPECT: "border-[#c9dcf5] bg-[#f2f7fd] text-[#1c4e80]",
  RESCHEDULED_BY_ADMIN: "border-[#c9dcf5] bg-[#f2f7fd] text-[#1c4e80]",
  CANCELLED_BY_PROSPECT: "border-[#f3c9c9] bg-[#fdf3f3] text-[#8f2d2d]",
  CANCELLED_BY_ADMIN: "border-[#f3c9c9] bg-[#fdf3f3] text-[#8f2d2d]",
  MARKED_COMPLETED_BY_ADMIN: "border-[#bfe3c4] bg-[#f1faf3] text-[#1f6b33]",
  EMAIL_RESENT_BY_ADMIN: "border-[#d8d3c4] bg-[#f6f4ee] text-[#5c5f66]",
};

export const ACTION_LABELS: Record<string, string> = {
  BOOKED: "Booked",
  CONFIRMATION_EMAIL_SENT: "Confirmation email sent",
  REMINDER_24H_SENT: "24h reminder sent",
  REMINDER_1H_SENT: "1h reminder sent",
  RESCHEDULED_BY_PROSPECT: "Rescheduled by prospect",
  RESCHEDULED_BY_ADMIN: "Rescheduled by admin",
  CANCELLED_BY_PROSPECT: "Cancelled by prospect",
  CANCELLED_BY_ADMIN: "Cancelled by admin",
  MARKED_COMPLETED_BY_ADMIN: "Marked completed by admin",
  EMAIL_RESENT_BY_ADMIN: "Email resent by admin",
};

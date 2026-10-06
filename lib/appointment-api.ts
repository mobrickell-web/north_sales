export type AppointmentRecord = {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  appointmentType: string;
  durationMinutes: number;
  scheduledAtUtc: string;
  prospectTimezone: string | null;
  status: string;
  cancellationReason: string | null;
  rescheduleToken: string;
  cancelToken: string;
};

export type ReschedulePayload = {
  date: string;
  time: string;
  timezone: string;
};

export type CancelPayload = {
  reason?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const body = (await response.json().catch(() => null)) as {
    status?: boolean;
    data?: T;
    message?: string | string[];
  } | null;

  if (!response.ok) {
    const message = Array.isArray(body?.message)
      ? body?.message.join(", ")
      : body?.message;
    throw new Error(message || "Something went wrong. Please try again.");
  }

  return (body && "data" in body ? body.data : body) as T;
}

export function getAppointmentByToken(token: string) {
  return request<AppointmentRecord>(
    `/api/v1/appointments/manage/${encodeURIComponent(token)}`,
  );
}

export function rescheduleAppointment(
  token: string,
  payload: ReschedulePayload,
) {
  return request<AppointmentRecord>(
    `/api/v1/appointments/${encodeURIComponent(token)}/reschedule`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );
}

export function cancelAppointment(token: string, payload: CancelPayload) {
  return request<AppointmentRecord>(
    `/api/v1/appointments/${encodeURIComponent(token)}/cancel`,
    { method: "DELETE", body: JSON.stringify(payload) },
  );
}

export function humanizeAppointmentType(value: string) {
  const text = String(value ?? "").trim();
  if (!text) return "—";
  return text
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatScheduledAt(scheduledAtUtc: string) {
  const date = new Date(scheduledAtUtc);
  if (Number.isNaN(date.getTime())) {
    return scheduledAtUtc;
  }
  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

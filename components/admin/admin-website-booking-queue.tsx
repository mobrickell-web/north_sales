"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2, X } from "lucide-react";

import { AdminAlert } from "@/components/admin/admin-ui";
import {
  type AdminAppointment,
  acceptAdminAppointment,
  formatInTimezone,
  humanizeEnum,
  listAdminAppointments,
  rejectAdminAppointment,
} from "@/lib/admin-appointments";
import { cn } from "@/lib/utils";

/** A6 — compact pending website-booking queue for Admin CRM. */
export function AdminWebsiteBookingQueue() {
  const [items, setItems] = useState<AdminAppointment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminAppointments({
        status: "pending",
        take: 5,
        skip: 0,
      });
      setItems(data.items);
      setTotal(data.total);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load pending website bookings.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const handleAccept = async (id: string) => {
    setActionId(id);
    setNotice("");
    setError("");
    try {
      await acceptAdminAppointment(id);
      setNotice("Booking accepted. Confirmation email will be sent.");
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not accept booking.",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Reject reason (optional):", "") ?? undefined;
    setActionId(id);
    setNotice("");
    setError("");
    try {
      await rejectAdminAppointment(id, reason || undefined);
      setNotice("Booking rejected.");
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not reject booking.",
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-admin-border-strong bg-admin-surface">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-admin-border px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-admin-text-strong">
            Website booking queue
          </h2>
          <p className="mt-0.5 text-[12px] text-admin-muted">
            Form submissions awaiting accept/reject. Separate from specialist
            CRM appointments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-admin-muted">
            {loading ? "Loading…" : `${total} pending`}
          </span>
          <Link
            href="/appointments"
            className="text-[12px] font-semibold text-admin-navy underline underline-offset-2"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="px-4 py-3 sm:px-5">
        {notice ? (
          <div className="mb-3">
            <AdminAlert tone="info">{notice}</AdminAlert>
          </div>
        ) : null}
        {error ? (
          <div className="mb-3">
            <AdminAlert>{error}</AdminAlert>
          </div>
        ) : null}

        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-8 text-[13px] text-admin-muted">
            <Loader2 className="size-4 animate-spin" />
            Loading pending bookings…
          </div>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-admin-muted">
            No pending website bookings.
          </p>
        ) : (
          <ul className="divide-y divide-admin-border-subtle">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-admin-text-strong">
                    {item.contactName}
                    <span className="font-normal text-admin-muted">
                      {" "}
                      · {item.companyName}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-admin-muted">
                    {formatInTimezone(
                      item.scheduledAtUtc,
                      item.prospectTimezone,
                    )}{" "}
                    · {humanizeEnum(item.appointmentType)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={actionId === item.id}
                    onClick={() => void handleAccept(item.id)}
                    className={cn(
                      "inline-flex h-8 items-center gap-1 rounded-lg bg-admin-assessment-gold px-3 text-[11px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:opacity-60",
                    )}
                  >
                    {actionId === item.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Check className="size-3.5" />
                    )}
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={actionId === item.id}
                    onClick={() => void handleReject(item.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#f3c9c9] px-3 text-[11px] font-semibold text-[#8f2d2d] hover:bg-[#fdf3f3] disabled:opacity-60"
                  >
                    <X className="size-3.5" />
                    Reject
                  </button>
                  <Link
                    href={`/appointments/${item.id}`}
                    className="inline-flex h-8 items-center rounded-lg border border-admin-border-strong px-3 text-[11px] font-semibold text-admin-text-strong hover:bg-admin-soft"
                  >
                    Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

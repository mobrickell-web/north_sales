"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";

import {
  ADMIN_TABS,
  type AdminAppointment,
  type AdminAppointmentQuery,
  type AdminEmailDeliverySummary,
  type AdminTab,
  STATUS_TONE,
  buildAppointmentQuery,
  formatInTimezone,
  humanizeEnum,
  listAdminAppointments,
} from "@/lib/admin-appointments";
import { hasSession } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import {
  AdminAlert,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-ui";

function renderEmailDeliveryBadge(delivery: AdminEmailDeliverySummary | null) {
  if (!delivery) {
    return null;
  }

  // Status-based styling
  const baseClasses =
    "rounded-full border px-2.5 py-1 font-secondary text-[11px] font-bold tracking-[0.06em] uppercase";
  let bgColor, textColor, borderColor, label;

  switch (delivery.status) {
    case "DELIVERED":
      bgColor = "bg-[#f1faf3]"; // light green
      textColor = "text-[#1f6b33]"; // green
      borderColor = "border-[#bfe3c4]";
      label = "Delivered";
      break;
    case "BOUNCED":
    case "DROPPED":
    case "SPAMREPORT":
      bgColor = "bg-[#fdf3f3]"; // light red
      textColor = "text-[#8f2d2d]"; // red
      borderColor = "border-[#f3c9c9]";
      label = "Failed";
      break;
    case "DEFERRED":
      bgColor = "bg-[#f6f4ee]"; // light gray
      textColor = "text-[#5c5f66]"; // gray
      borderColor = "border-[#d8d3c4]";
      label = "Deferred";
      break;
    case "UNSUBSCRIBED":
      bgColor = "bg-[#f2f7fd]"; // light blue
      textColor = "text-[#1c4e80]"; // blue
      borderColor = "border-[#c9dcf5]";
      label = "Unsubscribed";
      break;
    case "ACCEPTED":
    default:
      bgColor = "bg-[#f7f5f0]"; // neutral
      textColor = "text-[#5c5f66]"; // gray
      borderColor = "border-[#e8e4dc]";
      label = "Accepted";
      break;
  }

  const tooltip = delivery.statusReason ? delivery.statusReason : undefined;

  return (
    <span
      className={cn(baseClasses, bgColor, textColor, borderColor)}
      title={tooltip}
    >
      {label}
    </span>
  );
}

const TAB_LABELS: Record<AdminTab, string> = {
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

const PAGE_SIZES = [10, 20, 50];

type Result = { key: string; items: AdminAppointment[]; total: number };
type Failure = { key: string; message: string };

export function AdminAppointmentsPanel() {
  const router = useRouter();

  const [tab, setTab] = useState<AdminTab>("upcoming");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(20);

  const [result, setResult] = useState<Result | null>(null);
  const [failure, setFailure] = useState<Failure | null>(null);

  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setSkip(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo<AdminAppointmentQuery>(
    () =>
      buildAppointmentQuery({
        status: tab,
        search: search || undefined,
        from: from || undefined,
        to: to || undefined,
        skip,
        take,
      }),
    [from, search, skip, tab, take, to],
  );

  const queryKey = JSON.stringify(query);

  useEffect(() => {
    if (!hasSession()) {
      router.replace("/admin/login");
      return;
    }

    const current = ++requestId.current;

    listAdminAppointments(query)
      .then((data) => {
        if (current !== requestId.current) return;
        setResult({ key: queryKey, items: data.items, total: data.total });
        setFailure(null);
      })
      .catch((err: Error) => {
        if (current !== requestId.current) return;
        if (!hasSession()) {
          router.replace("/admin/login");
          return;
        }
        setFailure({ key: queryKey, message: err.message });
      });
  }, [query, queryKey, router]);

  const inSync = result?.key === queryKey;
  const items = inSync ? result.items : [];
  const total = inSync ? result.total : 0;
  const loading = !inSync;
  const error = failure?.key === queryKey ? failure.message : null;

  const page = Math.floor(skip / take) + 1;
  const pages = Math.max(1, Math.ceil(total / take));
  const hasFilters = Boolean(searchInput || from || to);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-[0_8px_28px_rgba(0,21,40,0.08)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#b17411] via-[#C99B31] to-[#b17411]" />

      <div className="border-b border-[#EFEBE3] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-body text-[18px] font-extrabold tracking-[0.03em] text-[#001528] uppercase">
            Appointments
          </h2>
          <p className="flex items-center gap-2 font-body text-[13px] text-[#8A8F98]">
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : null}
            {loading ? "Loading…" : `${total} result${total === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {ADMIN_TABS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTab(value);
                setSkip(0);
              }}
              aria-pressed={tab === value}
              className={cn(
                "rounded-full px-4 py-2 font-secondary text-[12px] font-bold tracking-[0.08em] uppercase transition-colors",
                tab === value
                  ? "bg-[#001528] text-white"
                  : "border border-[#E8E4DC] bg-white text-[#5C5F66] hover:border-[#b17411] hover:text-[#b17411]",
              )}
            >
              {TAB_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 border-b border-[#EFEBE3] px-5 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label htmlFor="admin-search" className={adminLabelClass}>
            Search
          </label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8A8F98]" />
            <input
              id="admin-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name, company or email"
              className={`${adminInputClass} pl-9`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="admin-from" className={adminLabelClass}>
            From
          </label>
          <input
            id="admin-from"
            type="date"
            value={from}
            onChange={(event) => {
              setFrom(event.target.value);
              setSkip(0);
            }}
            className={adminInputClass}
          />
        </div>

        <div>
          <label htmlFor="admin-to" className={adminLabelClass}>
            To
          </label>
          <input
            id="admin-to"
            type="date"
            value={to}
            onChange={(event) => {
              setTo(event.target.value);
              setSkip(0);
            }}
            className={adminInputClass}
          />
        </div>
      </div>

      {hasFilters ? (
        <div className="border-b border-[#EFEBE3] px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setFrom("");
              setTo("");
              setSkip(0);
            }}
            className="font-secondary text-[12px] font-bold tracking-[0.08em] text-[#b17411] uppercase hover:text-[#8f5d0e]"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      <div
        className={cn(
          "px-5 py-4 transition-opacity sm:px-6",
          loading && items.length > 0 && "opacity-60",
        )}
      >
        {error ? (
          <AdminAlert>{error}</AdminAlert>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#E8E4DC] bg-[#FAF9F5] px-6 py-12 text-center">
            {loading ? (
              <Loader2 className="size-8 animate-spin text-[#C99B31]" />
            ) : (
              <AlertCircle className="size-8 text-[#C99B31]" />
            )}
            <p className="font-body text-[14px] font-semibold text-[#001528]">
              {loading
                ? "Loading appointments…"
                : `No ${TAB_LABELS[tab].toLowerCase()} appointments`}
            </p>
            {!loading ? (
              <p className="font-body text-[13px] text-[#8A8F98]">
                {hasFilters
                  ? "Try clearing the search or date filters."
                  : "Nothing here yet."}
              </p>
            ) : null}
          </div>
        ) : (
          <ul className="divide-y divide-[#EFEBE3]">
            {items.map((appointment) => (
              <li key={appointment.id}>
                <Link
                  href={`/admin/appointments/${appointment.id}`}
                  className="flex flex-col gap-3 py-4 transition-opacity hover:opacity-80 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-body text-[15px] font-bold text-[#001528]">
                      {appointment.contactName}
                    </p>
                    <p className="font-body text-[13px] text-[#5C5F66]">
                      {appointment.companyName}
                    </p>
                    <p className="font-body text-[13px] break-all text-[#8A8F98]">
                      {appointment.email}
                      {appointment.phone ? ` · ${appointment.phone}` : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
                    <p className="font-body text-[13px] font-semibold text-[#001528]">
                      {formatInTimezone(
                        appointment.scheduledAtUtc,
                        appointment.prospectTimezone,
                      )}
                    </p>
                    <p className="font-body text-[12px] text-[#8A8F98]">
                      {humanizeEnum(appointment.appointmentType)} ·{" "}
                      {appointment.durationMinutes} min
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 font-secondary text-[11px] font-bold tracking-[0.06em] uppercase",
                          STATUS_TONE[appointment.status] ??
                            "border-[#E8E4DC] bg-[#F7F5F0] text-[#5C5F66]",
                        )}
                      >
                        {humanizeEnum(appointment.status)}
                      </span>
                      {appointment.reminder24hSent ? (
                        <span className="rounded-full border border-[#c9dcf5] bg-[#f2f7fd] px-2.5 py-1 font-secondary text-[11px] font-bold tracking-[0.06em] text-[#1c4e80] uppercase">
                          24h sent
                        </span>
                      ) : null}
                      {appointment.reminder1hSent ? (
                        <span className="rounded-full border border-[#c9dcf5] bg-[#f2f7fd] px-2.5 py-1 font-secondary text-[11px] font-bold tracking-[0.06em] text-[#1c4e80] uppercase">
                          1h sent
                        </span>
                      ) : null}
                      {renderEmailDeliveryBadge(appointment.emailDelivery)}
                    </div>

                    {appointment.cancellationReason ? (
                      <p className="max-w-[42ch] text-right font-body text-[12px] text-[#8f2d2d]">
                        {appointment.cancellationReason}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#EFEBE3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-body text-[12px] tracking-[0.04em] text-[#8A8F98] uppercase">
            Rows
          </span>
          <select
            value={take}
            onChange={(event) => {
              setTake(Number(event.target.value));
              setSkip(0);
            }}
            className="rounded-lg border border-[#E8E4DC] bg-white px-2.5 py-1.5 font-body text-[13px] text-[#001528] outline-none focus:border-[#b17411]"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-body text-[13px] text-[#5C5F66]">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            onClick={() => setSkip(Math.max(0, skip - take))}
            disabled={skip === 0 || loading}
            aria-label="Previous page"
            className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8E4DC] text-[#001528] transition-colors hover:border-[#b17411] hover:text-[#b17411] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setSkip(skip + take)}
            disabled={skip + take >= total || loading}
            aria-label="Next page"
            className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8E4DC] text-[#001528] transition-colors hover:border-[#b17411] hover:text-[#b17411] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

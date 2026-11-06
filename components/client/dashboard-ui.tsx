"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

const dateOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
};

// Server renders in UTC; the browser then switches to the viewer's own time
// zone without a hydration mismatch.
export function LocalDate({
  value,
  options = dateOptions,
}: {
  value: string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const label = useSyncExternalStore(
    noopSubscribe,
    () => formatDate(value, options),
    () => formatDate(value, { ...options, timeZone: "UTC" }),
  );
  return <time dateTime={value}>{label}</time>;
}

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatScore(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function ScoreBar({
  score,
  max,
  tone = "gold",
  label,
}: {
  score: number;
  max: number;
  tone?: "gold" | "navy";
  label?: string;
}) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (score / max) * 100)) : 0;
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={score}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-admin-step"
    >
      <div
        className={cn(
          "h-full rounded-full",
          tone === "gold"
            ? "bg-gradient-to-r from-admin-gold to-admin-gold-deep"
            : "bg-admin-sidebar",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function DashboardCard({
  title,
  description,
  action,
  className,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-admin-card",
        className,
      )}
    >
      <div className="flex flex-col gap-2 border-b border-admin-border-subtle px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-admin-text-strong">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-[12px] leading-relaxed text-admin-muted">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

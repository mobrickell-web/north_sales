"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarPlus, ChevronDown, Download, Mail, Globe } from "lucide-react";

import type { CalendarLinkSet } from "@/lib/calendar-links";

const OPTIONS: {
  key: keyof CalendarLinkSet;
  label: string;
  hint: string;
  Icon: typeof Globe;
  /** Brand colour for the leading chip so the three rows read apart at a glance. */
  accent: string;
}[] = [
  {
    key: "google",
    label: "Google Calendar",
    hint: "Opens Google Calendar in a new tab",
    Icon: Globe,
    accent: "bg-[#4285F4]",
  },
  {
    key: "outlook",
    label: "Outlook",
    hint: "Opens Outlook in a new tab",
    Icon: Mail,
    accent: "bg-[#0F6CBD]",
  },
  {
    key: "ics",
    label: "Apple / Other (.ics)",
    hint: "Downloads a file to import manually",
    Icon: Download,
    accent: "bg-[#8A8F98]",
  },
];

type AddToCalendarProps = {
  links: CalendarLinkSet;
  heading?: string;
  /** Match the tall primary buttons used on the public appointment pages. */
  variant?: "appointment" | "admin";
  /** Lets the parent lift stacking/overflow while the panel is open. */
  onOpenChange?: (open: boolean) => void;
};

export function AddToCalendar({
  links,
  heading = "Add to your calendar",
  variant = "appointment",
  onOpenChange,
}: AddToCalendarProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const setOpenState = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpenState(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenState(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const triggerClass =
    variant === "admin"
      ? "inline-flex h-[42px] shrink-0 items-center justify-center rounded-full bg-[#b17411] px-5 font-secondary text-[12px] font-bold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#8f5d0e]"
      : "inline-flex h-[46px] w-full items-center justify-center rounded-full bg-[#001528] px-6 font-secondary text-[13px] font-bold tracking-[0.1em] text-white uppercase transition-colors hover:bg-[#0b2540]";

  // `admin` trigger hugs its label, so a full-bleed panel would be unreadably
  // narrow. Give it a real minimum and let the text wrap instead of clipping.
  const panelWidth =
    variant === "admin" ? "w-[min(20rem,calc(100vw-2rem))]" : "inset-x-0";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpenState(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={triggerClass}
      >
        <CalendarPlus className="mr-2 size-4 shrink-0" />
        Add to Calendar
        <ChevronDown
          className={`ml-2 size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute left-0 z-50 mt-2 overflow-hidden rounded-xl border border-[#E8E4DC] bg-white shadow-[0_12px_32px_rgba(0,21,40,0.14)] ${panelWidth}`}
        >
          {OPTIONS.map((option) => (
            <a
              key={option.key}
              role="menuitem"
              href={links[option.key]}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpenState(false)}
              className="flex items-start gap-3 border-b border-[#EFEBE3] px-4 py-3 transition-colors last:border-b-0 hover:bg-[#FAF9F5] focus:bg-[#FAF9F5] focus:outline-none"
            >
              <span
                className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ${option.accent}`}
              >
                <option.Icon className="size-3.5 text-white" />
              </span>
              <span className="min-w-0">
                <span className="block font-body text-[14px] font-semibold text-[#001528]">
                  {option.label}
                </span>
                <span className="mt-0.5 block font-body text-[12px] leading-snug text-[#8A8F98]">
                  {option.hint}
                </span>
              </span>
            </a>
          ))}
        </div>
      ) : null}

      <p className="mt-3 font-body text-[12px] leading-relaxed text-[#8A8F98]">
        {heading === "Add to your calendar"
          ? "Opens your calendar app in a new tab — nothing is downloaded."
          : heading}
      </p>
    </div>
  );
}

"use client";

import { useScheduleAppointment } from "@/components/schedule/schedule-provider";
import Link from "next/link";

export function BlogPostCta() {
  const { openSchedule } = useScheduleAppointment();

  return (
    <div className="legal-page__contact flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/#investment" className="legal-page__link">
        EXPLORE OUR SALES PERFORMANCE ENGAGEMENTS
      </Link>
      <button
        type="button"
        onClick={openSchedule}
        className="cursor-pointer text-left font-semibold text-[var(--bronze)] underline underline-offset-[3px] transition-colors hover:text-[#8f5d0e]"
      >
        SCHEDULE A CONSULTATION
      </button>
    </div>
  );
}

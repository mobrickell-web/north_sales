"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useScheduleAppointment } from "@/components/schedule/schedule-provider";
import {
  adminProfile,
  getStoredAdmin,
  type AdminProfile,
} from "@/lib/auth-api";

export function BlogPostCta() {
  const { openSchedule } = useScheduleAppointment();
  const [account, setAccount] = useState<AdminProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadAccount = async () => {
      const profile =
        getStoredAdmin() ?? (await adminProfile().catch(() => null));
      if (!cancelled) setAccount(profile);
    };
    void loadAccount();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="legal-page__contact flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/#investment" className="legal-page__link">
        EXPLORE OUR SALES PERFORMANCE ENGAGEMENTS
      </Link>
      {!account ? (
        <button
          type="button"
          onClick={openSchedule}
          className="cursor-pointer text-left font-semibold text-[var(--bronze)] underline underline-offset-[3px] transition-colors hover:text-[#8f5d0e]"
        >
          SCHEDULE A CONSULTATION
        </button>
      ) : null}
    </div>
  );
}

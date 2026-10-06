"use client";

import { useScheduleAppointment } from "@/components/schedule/schedule-provider";
import { siteConfig } from "@/config/site";

export function BlogPostCta({ text }: { text: string }) {
  const { openSchedule } = useScheduleAppointment();

  return (
    <div className="legal-page__contact">
      <p className="legal-page__contact-label">{text}</p>
      <button type="button" onClick={openSchedule} className="legal-page__link">
        {siteConfig.cta.label}
      </button>
    </div>
  );
}

import Link from "next/link";

import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScheduleAppointmentProvider } from "@/components/schedule/schedule-provider";
import { requireAssessmentAccess } from "@/lib/server-auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await requireAssessmentAccess();

  // Clients only reach the assessment here; the private-website header and
  // footer link to pages they cannot open, so they get a way back instead.
  if (account.role === "USER") {
    return (
      <ScheduleAppointmentProvider>
        <div className="bg-[#020B1E] px-5 py-3">
          <Link
            href="/dashboard"
            className="font-secondary text-xs font-bold tracking-[0.08em] text-gold uppercase hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>
        <main id="main" className="relative z-0 flex-1">
          {children}
        </main>
      </ScheduleAppointmentProvider>
    );
  }

  return (
    <ScheduleAppointmentProvider>
      <SiteHeader />
      <main id="main" className="relative z-0 flex-1">
        {children}
      </main>
      <SiteFooter />
      <ScrollToTop />
    </ScheduleAppointmentProvider>
  );
}

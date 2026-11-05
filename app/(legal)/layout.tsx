import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScheduleAppointmentProvider } from "@/components/schedule/schedule-provider";
import { requireRepresentative } from "@/lib/server-auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRepresentative();

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

import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScheduleAppointmentProvider } from "@/components/schedule/schedule-appointment-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

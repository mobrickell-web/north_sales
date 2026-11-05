import { HeroSection } from "@/components/landing/hero-section";
import { AboutUsSection } from "@/components/landing/about-us-section";
import { FaqSection } from "@/components/landing/faq-section";
import { ProvenResultsSection } from "@/components/landing/proven-results-section";
import WhyPartnerSection from "@/components/landing/why-partner-section";
import { Steps } from "@/components/landing/steps";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Challenges } from "@/components/landing/chellanges";
import { InvestmentSection } from "@/components/landing/investment-section";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScheduleAppointmentProvider } from "@/components/schedule/schedule-provider";

export function PrivateWebsiteHome() {
  return (
    <ScheduleAppointmentProvider>
      <SiteHeader />
      <main id="main" className="relative z-0 flex-1">
        <HeroSection />
        <AboutUsSection />
        <WhyPartnerSection />
        <ProvenResultsSection />
        <HowItWorks />
        <Steps />
        <Challenges />
        <InvestmentSection />
        <FaqSection />
      </main>
      <SiteFooter />
      <ScrollToTop />
    </ScheduleAppointmentProvider>
  );
}

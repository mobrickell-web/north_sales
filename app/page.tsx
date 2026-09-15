import { HeroSection } from "@/components/landing/hero-section";
import { FaqSection } from "@/components/landing/faq-section";
import { ProvenResultsSection } from "@/components/landing/proven-results-section";
import { SolutionSection } from "@/components/landing/solution-section";
import WhyPartnerSection from "@/components/landing/why-partner-section";
import { Steps } from "@/components/landing/steps";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Challenges } from "@/components/landing/chellanges";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <WhyPartnerSection />
      <ProvenResultsSection />
      <HowItWorks />
      <Steps />
      <Challenges />
      <SolutionSection />
      <FaqSection />
    </>
  );
}

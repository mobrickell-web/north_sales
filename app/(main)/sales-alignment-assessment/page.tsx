import type { Metadata } from "next";

import { SalesAlignmentAssessment } from "@/components/assessment/sales-alignment-assessment";
import { siteConfig } from "@/config/site";
import { fetchClientFacingAssessment } from "@/lib/published-assessments";
import { getServerAccount } from "@/lib/server-auth";

/** Always hit the API — Primary OFF / delete must hide immediately. */
export const dynamic = "force-dynamic";

const pageConfig = siteConfig.salesAlignmentAssessment;

export async function generateMetadata(): Promise<Metadata> {
  const assessment = await fetchClientFacingAssessment();

  return {
    title: assessment?.title
      ? `${assessment.title} · North Point Sales Group`
      : pageConfig.title,
    description:
      assessment?.document?.settings?.introduction || pageConfig.description,
    alternates: {
      canonical: pageConfig.canonical,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SalesAlignmentAssessmentRoute() {
  const account = await getServerAccount();
  const publishedAssessment = await fetchClientFacingAssessment();

  // Public visitors + Super Admin can complete the free assessment.
  // Sales reps preview only — client completion uses Zoom on-behalf links.
  const mode =
    account?.role === "SALES_REPRESENTATIVE" ? "preview" : "interactive";

  return (
    <SalesAlignmentAssessment
      assessmentData={publishedAssessment}
      mode={mode}
    />
  );
}

import type { Metadata } from "next";

import { SalesAlignmentAssessment } from "@/components/assessment/sales-alignment-assessment";
import { siteConfig } from "@/config/site";
import { fetchClientFacingAssessment } from "@/lib/published-assessments";
import { requireRepresentative } from "@/lib/server-auth";

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
  // Super Admin + Sales Representatives only
  const account = await requireRepresentative();

  const publishedAssessment = await fetchClientFacingAssessment();
  // Reps may preview the client-facing assessment, but must use an
  // admin-issued Zoom on-behalf link to complete it for a client.
  const mode =
    account.role === "SALES_REPRESENTATIVE" ? "preview" : "interactive";

  return (
    <SalesAlignmentAssessment
      assessmentData={publishedAssessment}
      mode={mode}
    />
  );
}

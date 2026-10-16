import type { Metadata } from "next";

import { SalesAlignmentAssessment } from "@/components/assessment/sales-alignment-assessment";
import { siteConfig } from "@/config/site";

const page = siteConfig.salesAlignmentAssessment;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: {
    canonical: page.canonical,
  },
};

export default function SalesAlignmentAssessmentRoute() {
  return <SalesAlignmentAssessment />;
}

import type { Metadata } from "next";

import { OnBehalfAssessmentPage } from "@/components/on-behalf/on-behalf-assessment-page";
import { requireRepresentative } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Zoom Assessment Completion · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default async function OnBehalfTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  await requireRepresentative();
  const { token } = await params;

  return <OnBehalfAssessmentPage token={token} />;
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Assessment editor · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default async function AdminAssessmentEditorPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  redirect(`/assessments/${encodeURIComponent(assessmentId)}`);
}

import type { Metadata } from "next";
import { AdminAssessmentEditor } from "@/components/admin/admin-assessment-editor";

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
  return <AdminAssessmentEditor assessmentId={assessmentId} />;
}

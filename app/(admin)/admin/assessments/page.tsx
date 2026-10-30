import type { Metadata } from "next";
import { AdminAssessmentsScreen } from "@/components/admin/admin-assessments";

export const metadata: Metadata = {
  title: "Assessments · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AdminAssessmentsPage() {
  return <AdminAssessmentsScreen />;
}

import type { Metadata } from "next";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Assessment Results · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AssessmentResultsPage() {
  return <AdminDashboardShell page="assessment-results" />;
}

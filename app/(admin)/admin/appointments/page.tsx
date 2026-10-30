import type { Metadata } from "next";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Appointments · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AdminAppointmentsPage() {
  return <AdminDashboardShell page="appointments" />;
}

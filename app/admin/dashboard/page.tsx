import type { Metadata } from "next";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <AdminDashboardShell />;
}

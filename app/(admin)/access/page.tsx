import type { Metadata } from "next";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Access Management · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AccessPage() {
  return <AdminDashboardShell page="access" />;
}

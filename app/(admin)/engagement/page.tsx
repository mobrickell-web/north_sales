import type { Metadata } from "next";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Client Engagement · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function EngagementPage() {
  return <AdminDashboardShell page="engagement" />;
}

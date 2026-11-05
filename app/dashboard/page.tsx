import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard";
import { ClientDashboard } from "@/components/client/client-dashboard";
import { getServerAccount } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Dashboard · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const account = await getServerAccount();

  if (!account) redirect("/login");
  if (account.role === "USER") {
    return <ClientDashboard name={account.name} email={account.email} />;
  }
  if (account.role === "SUPER_ADMIN") return <AdminDashboardShell />;

  if (account.role === "SALES_REPRESENTATIVE") redirect("/");
  redirect("/login");
}

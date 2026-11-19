import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard";
import { ClientDashboard } from "@/components/client/client-dashboard";
import { getClientDashboard } from "@/lib/client-dashboard";
import { getServerAccount, isEads } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Dashboard · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const account = await getServerAccount();

  if (!account) redirect("/login");

  if (account.role === "USER") {
    const dashboard = await getClientDashboard();

    return (
      <ClientDashboard
        name={account.name}
        email={account.email}
        data={dashboard.ok ? dashboard.data : null}
        errorMessage={dashboard.ok ? undefined : dashboard.message}
      />
    );
  }

  if (account.role === "SUPER_ADMIN") return <AdminDashboardShell />;

  if (isEads(account)) redirect("/leads");
  if (account.role === "SALES_REPRESENTATIVE") redirect("/");
  redirect("/login");
}

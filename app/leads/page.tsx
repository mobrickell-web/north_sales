import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LeadsDashboard } from "@/components/leads/leads-dashboard";
import {
  getAccountHomePath,
  getServerAccount,
  isAccountExecutive,
} from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Leads · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default async function LeadsPage() {
  const account = await getServerAccount();

  if (!account) redirect("/login");
  if (!isAccountExecutive(account)) redirect(getAccountHomePath(account));

  return <LeadsDashboard name={account.name} email={account.email} />;
}

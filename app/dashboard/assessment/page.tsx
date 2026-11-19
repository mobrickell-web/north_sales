import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerAccount } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Assessment · Client Dashboard · North Point Sales Group",
  robots: { index: false, follow: false },
};

/** Clients never take assessments themselves — redirect to results dashboard. */
export default async function DashboardAssessmentPage() {
  const account = await getServerAccount();

  if (!account) redirect("/login");
  redirect("/dashboard");
}

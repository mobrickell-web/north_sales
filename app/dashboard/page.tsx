import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard";
import { ClientDashboard } from "@/components/client/client-dashboard";
import type { AssessmentResultSummary } from "@/lib/assessment-results-api";
import {
  ServerApiError,
  getServerAccount,
  isAccountExecutive,
  serverApiFetch,
} from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Dashboard · North Point Sales Group",
  robots: { index: false, follow: false },
};

async function loadMyResults(): Promise<{
  results: AssessmentResultSummary[];
  error: string | null;
}> {
  try {
    const results = await serverApiFetch<AssessmentResultSummary[]>(
      "/api/v1/assessment-results/mine",
    );
    return {
      results: [...results].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
      error: null,
    };
  } catch (cause) {
    if (cause instanceof ServerApiError && cause.status === 401) {
      redirect("/login");
    }
    return {
      results: [],
      error: "We could not load your assessment results. Please refresh.",
    };
  }
}

export default async function DashboardPage() {
  const account = await getServerAccount();

  if (!account) redirect("/login");
  if (account.role === "USER") {
    const { results, error } = await loadMyResults();
    return (
      <ClientDashboard
        name={account.name}
        email={account.email}
        results={results}
        loadError={error}
      />
    );
  }
  if (account.role === "SUPER_ADMIN") return <AdminDashboardShell />;

  if (isAccountExecutive(account)) redirect("/leads");
  if (account.role === "SALES_REPRESENTATIVE") redirect("/");
  redirect("/login");
}

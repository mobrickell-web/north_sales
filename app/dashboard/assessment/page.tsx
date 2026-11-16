import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ClientAssessmentPage } from "@/components/client/client-assessment-page";
import { getServerAccount } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Assessment · Client Dashboard · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default async function DashboardAssessmentPage() {
  const account = await getServerAccount();

  if (!account) redirect("/login");
  if (account.role !== "USER") redirect("/dashboard");

  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#020B1E] text-white/70">
          Loading assessment…
        </main>
      }
    >
      <ClientAssessmentPage />
    </Suspense>
  );
}

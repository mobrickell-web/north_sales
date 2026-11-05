import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Overview · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  redirect("/dashboard");
}

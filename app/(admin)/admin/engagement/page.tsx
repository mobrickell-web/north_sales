import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Client Engagement · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AdminEngagementRedirectPage() {
  redirect("/engagement");
}

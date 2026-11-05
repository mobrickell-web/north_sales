import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Access Management · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AdminAccessPage() {
  redirect("/access");
}

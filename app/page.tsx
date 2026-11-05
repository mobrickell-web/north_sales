import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PublicCoverPage } from "@/components/landing/public-cover-page";
import { PrivateWebsiteHome } from "@/components/landing/private-website-home";
import { getServerAccount } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const account = await getServerAccount();

  return {
    title: siteConfig.name,
    description:
      "Learn how prospective clients can review the NORTH POINT SALES GROUP website during a private Zoom presentation.",
    // This URL serves the private website to signed-in accounts, so only the
    // public cover render may be indexed or crawled.
    robots: account
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export default async function HomePage() {
  const account = await getServerAccount();

  if (!account) return <PublicCoverPage />;
  if (account.role === "USER") redirect("/dashboard");
  if (
    account.role !== "SUPER_ADMIN" &&
    account.role !== "SALES_REPRESENTATIVE"
  ) {
    redirect("/login");
  }

  return <PrivateWebsiteHome />;
}

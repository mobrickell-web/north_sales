import type { Metadata } from "next";

import { PrivacyPolicyPage } from "@/components/legal/privacy-policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How North Point Sales Group collects, uses, discloses, and protects personal information when you visit our website or interact with our services.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyRoute() {
  return <PrivacyPolicyPage />;
}

import type { Metadata } from "next";

import { TermsOfUsePage } from "@/components/legal/terms-of-use-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing access to and use of the North Point Sales Group website and related materials.",
  alternates: {
    canonical: "/terms-of-use",
  },
};

export default function TermsOfUseRoute() {
  return <TermsOfUsePage />;
}

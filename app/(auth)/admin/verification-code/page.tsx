import type { Metadata } from "next";
import { Suspense } from "react";

import { VerificationCodeScreen } from "@/components/auth/verification-code-screen";

export const metadata: Metadata = {
  title: "Verification Code",
  description: "Verify your email address to reset your admin password.",
};

export default function AdminVerificationCodePage() {
  return (
    <Suspense>
      <VerificationCodeScreen />
    </Suspense>
  );
}

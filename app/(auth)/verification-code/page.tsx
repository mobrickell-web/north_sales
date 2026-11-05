import type { Metadata } from "next";
import { Suspense } from "react";

import { VerificationCodeScreen } from "@/components/auth/verification-code";

export const metadata: Metadata = {
  title: "Verification Code",
  description: "Verify your email address to reset your password.",
};

export default function VerificationCodePage() {
  return (
    <Suspense>
      <VerificationCodeScreen />
    </Suspense>
  );
}

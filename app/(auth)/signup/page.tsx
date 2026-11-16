import type { Metadata } from "next";
import { Suspense } from "react";

import { SignupScreen } from "@/components/auth/signup";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Create your NORTH POINT SALES GROUP account.",
};

// Self sign-up remains available for client access requests.
export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupScreen />
    </Suspense>
  );
}

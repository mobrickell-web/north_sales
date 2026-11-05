import type { Metadata } from "next";
import { Suspense } from "react";

import { UpdatePasswordScreen } from "@/components/auth/update-pass";

export const metadata: Metadata = {
  title: "Update Password",
  description: "Update your NORTH POINT SALES GROUP password.",
};

export default function UpdatePasswordPage() {
  return (
    <Suspense>
      <UpdatePasswordScreen />
    </Suspense>
  );
}

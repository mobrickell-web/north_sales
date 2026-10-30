import type { Metadata } from "next";
import { Suspense } from "react";

import { UpdatePasswordScreen } from "@/components/auth/update-password-screen";

export const metadata: Metadata = {
  title: "Update Password",
  description: "Update your NORTH POINT SALES GROUP admin password.",
};

export default function AdminUpdatePasswordPage() {
  return (
    <Suspense>
      <UpdatePasswordScreen />
    </Suspense>
  );
}

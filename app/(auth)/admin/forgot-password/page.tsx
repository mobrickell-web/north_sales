import type { Metadata } from "next";

import { ForgotPasswordScreen } from "@/components/auth/forgot-pass-screen";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your NORTH POINT SALES GROUP admin password.",
};

export default function AdminForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}

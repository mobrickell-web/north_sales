import type { Metadata } from "next";

import { ForgotPasswordScreen } from "@/components/auth/forgot-pass";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your NORTH POINT SALES GROUP password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}

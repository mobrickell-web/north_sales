import type { Metadata } from "next";

import { SignupScreen } from "@/components/auth/signup";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Create your NORTH POINT SALES GROUP account.",
};

export default function SignupPage() {
  return <SignupScreen />;
}

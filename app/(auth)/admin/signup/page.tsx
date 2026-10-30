import type { Metadata } from "next";

import { SignupScreen } from "@/components/auth/signup-screen";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Create your NORTH POINT SALES GROUP account.",
};

export default function AdminSignupPage() {
  return <SignupScreen />;
}

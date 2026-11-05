import type { Metadata } from "next";
import { LoginScreen } from "@/components/auth/login";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your NORTH POINT SALES GROUP account.",
};

export default function LoginPage() {
  return <LoginScreen />;
}

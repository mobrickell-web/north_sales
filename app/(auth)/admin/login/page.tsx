import type { Metadata } from "next";
import { LoginScreen } from "@/components/auth/login-screen";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Log in to your NORTH POINT SALES GROUP admin account.",
};

export default function AdminLoginPage() {
  return <LoginScreen />;
}

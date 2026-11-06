import { redirect } from "next/navigation";

// Self sign-up is disabled: the Master Admin creates client accounts and
// shares their login credentials.
export default function SignupPage() {
  redirect("/login");
}

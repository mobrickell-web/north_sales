import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Appointments · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AdminAppointmentsPage() {
  redirect("/appointments");
}

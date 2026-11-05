import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Appointment · North Point Sales Group",
  robots: { index: false, follow: false },
};

export default async function AdminAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/appointments/${encodeURIComponent(id)}`);
}

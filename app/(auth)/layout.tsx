import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "North Point Sales Group",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

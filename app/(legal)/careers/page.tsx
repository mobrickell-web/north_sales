import type { Metadata } from "next";

import { CareersPage } from "@/components/legal/careers-page";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Build your career with NORTH POINT SALES GROUP. Explore performance-based roles in executive account development, sales implementation, fractional VP of sales, and regional sales management.",
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersRoute() {
  return <CareersPage />;
}

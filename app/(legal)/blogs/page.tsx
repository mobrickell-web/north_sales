import type { Metadata } from "next";

import { BlogsIndexPage } from "@/components/legal/blogs-index-page";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Sales-performance insights from NORTH POINT SALES GROUP on diagnosing the real constraints on growth, adding sales capacity, sales training, and outside consulting engagements.",
  alternates: {
    canonical: "/blogs",
  },
};

export default function BlogsRoute() {
  return <BlogsIndexPage />;
}

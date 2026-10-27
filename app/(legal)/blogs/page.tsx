import type { Metadata } from "next";

import { BlogsIndexPage } from "@/components/legal/blogs-index-page";

export const metadata: Metadata = {
  title: "EXECUTIVE INSIGHTS",
  description:
    "Practical perspectives on sales performance, leadership, systems, and sustainable revenue growth.",
  alternates: {
    canonical: "/blogs",
  },
};

export default function BlogsRoute() {
  return <BlogsIndexPage />;
}

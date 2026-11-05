import type { MetadataRoute } from "next";

import { protectedRoutes } from "@/config/protected-routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: protectedRoutes,
    },
  };
}

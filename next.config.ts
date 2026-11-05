import type { NextConfig } from "next";

import { protectedRoutes } from "./config/protected-routes";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  headers() {
    return protectedRoutes.map((route) => ({
      source: `${route}/:path*`,
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
        },
        { key: "Cache-Control", value: "no-store, must-revalidate" },
      ],
    }));
  },
};

export default nextConfig;

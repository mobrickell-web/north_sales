import type { NextConfig } from "next";

import { protectedRoutes } from "./config/protected-routes";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // The browser talks to the backend through this same-origin path so the
  // auth cookies land on the frontend domain, where proxy.ts can read them.
  rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${API_URL}/api/v1/:path*` },
    ];
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

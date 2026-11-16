import type { NextConfig } from "next";

import { protectedRoutes } from "./config/protected-routes";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
).replace(/\/+$/, "");

const NOINDEX_HEADERS = [
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
  },
  { key: "Cache-Control", value: "no-store, must-revalidate" },
] as const;

function protectedRouteHeaderSources(route: string) {
  // Exact path + nested paths (Next does not treat /:path* as matching the root).
  return [
    { source: route, headers: [...NOINDEX_HEADERS] },
    { source: `${route}/:path*`, headers: [...NOINDEX_HEADERS] },
  ];
}

/**
 * Optional host canonicalization (Chunk 11).
 * Set CANONICAL_HOST=www.example.com to permanently redirect the apex host
 * to www (or the reverse if CANONICAL_HOST is apex-only).
 */
function canonicalHostRedirects() {
  const canonical = (process.env.CANONICAL_HOST ?? "").trim().toLowerCase();
  if (!canonical || canonical.includes("/") || canonical.includes(":")) {
    return [] as const;
  }

  const isWww = canonical.startsWith("www.");
  const alternate = isWww ? canonical.slice(4) : `www.${canonical}`;
  if (!alternate || alternate === canonical) return [] as const;

  return [
    {
      source: "/:path*",
      has: [{ type: "host" as const, value: alternate }],
      destination: `https://${canonical}/:path*`,
      permanent: true,
    },
  ];
}

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // The browser talks to the backend through this same-origin path so the
  // auth cookies land on the frontend domain, where proxy.ts can read them.
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${API_URL}/api/v1/:path*` },
    ];
  },
  async headers() {
    return [
      ...protectedRoutes.flatMap(protectedRouteHeaderSources),
      // Tokenized appointment links stay reachable without login but must not
      // be indexed or cached.
      ...protectedRouteHeaderSources("/appointments/cancel"),
      ...protectedRouteHeaderSources("/appointments/reschedule"),
    ];
  },
  async redirects() {
    return [...canonicalHostRedirects()];
  },
};

export default nextConfig;

import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { SessionRevocationMonitor } from "@/components/auth/session-revocation-monitor";
import {
  fontBody,
  fontHeading,
  fontMono,
  fontSans,
  fontSecondary,
} from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Fail-safe default: every route is unindexable unless it opts in. The only
  // page that does is the public cover page, which renders its own robots.
  robots: { index: false, follow: false },
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} ${fontSecondary.variable} ${fontHeading.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SessionRevocationMonitor />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:bg-secondary focus:px-3 focus:py-2 focus:text-secondary-foreground"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

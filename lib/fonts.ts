import { Arimo, Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const fontSecondary = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Self-hosted so Next.js does not need to reach fonts.googleapis.com at build/dev.
export const fontHeading = localFont({
  src: [
    {
      path: "../fonts/lora/lora-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/lora/lora-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lora",
  display: "swap",
});

export const fontBody = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

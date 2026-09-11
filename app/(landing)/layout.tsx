import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:bg-secondary focus:px-3 focus:py-2 focus:text-secondary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="relative z-0 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

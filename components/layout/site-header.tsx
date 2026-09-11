"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Must render identically on server and client to avoid hydration mismatch;
  // the real hash is applied in the mount effect below.
  const [activeHash, setActiveHash] = useState<string>("#top");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || "#top");
    };

    // Sync with the actual URL hash after hydration.
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setIsMenuOpen(false);

    // If it's a hash link on the current page
    if (href.startsWith("#")) {
      e.preventDefault();

      const targetId = href.replace("#", "");

      if (targetId === "top" || !targetId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveHash("#top");
        window.history.pushState(null, "", " ");
        return;
      }

      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Calculate offset to prevent sticky header from hiding section top
        const headerOffset = 110; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        setActiveHash(href);
        window.history.pushState(null, "", href);
      } else {
        console.warn(`Element with id "${targetId}" not found in DOM.`);
      }
    } else if (href.includes("#") && pathname !== "/") {
      // If navigating from another route back to home hash
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary shadow-md">
      <div className="mx-auto flex min-h-[80px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-[110px] lg:min-h-0 lg:grid lg:grid-cols-[270px_minmax(0,1fr)_auto] lg:gap-x-0 lg:px-[24px]">
        {/* Logo Link */}
        <Link
          href="#top"
          className="flex shrink-0 items-center gap-px self-center transition-opacity hover:opacity-90 lg:justify-start"
          onClick={(e) => handleNavClick(e, "#top")}
        >
          <Image
            src="/logo/north-logo.svg"
            alt={siteConfig.name}
            width={328}
            height={104}
            priority
            className="h-auto w-[220px] lg:w-[270px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="hidden h-[89px] items-center justify-center gap-[21px] lg:flex"
        >
          {siteConfig.nav.map((item) => {
            const isCurrent = activeHash === item.href;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "relative flex h-full shrink-0 items-center justify-center whitespace-nowrap font-secondary text-[12px] font-bold uppercase leading-none tracking-[0.1em] text-white transition-colors hover:text-gold xl:text-[14px]",
                  isCurrent &&
                    "text-gold after:absolute after:bottom-6 after:left-0 after:right-0 after:h-0.5 after:bg-gold",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <Link
          href={siteConfig.cta.href}
          onClick={(e) => handleNavClick(e, siteConfig.cta.href)}
          className="relative z-10 hidden h-[58px] w-[225px] shrink-0 flex-col items-center justify-center gap-[2px] bg-gold p-[10px_24px] text-center font-secondary text-[16px] font-bold uppercase leading-[1.2] tracking-[0.011em] text-[#001528] transition-all hover:bg-gold/90 hover:shadow-lg lg:flex"
        >
          <span className="w-full text-center leading-none">
            {siteConfig.cta.labelLines[0]}
          </span>
          <span className="w-full text-center leading-none">
            {siteConfig.cta.labelLines[1]}
          </span>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          className="relative z-10 flex size-11 items-center justify-center text-white lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="border-t border-white/15 bg-primary px-4 py-5 lg:hidden">
          <nav aria-label="Mobile primary" className="flex flex-col">
            {siteConfig.nav.map((item) => (
              <Link
                key={`mobile-${item.href}-${item.label}`}
                href={item.href}
                className="border-b border-white/10 py-4 font-secondary text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:text-gold"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={siteConfig.cta.href}
              className="mt-5 flex min-h-[52px] items-center justify-center bg-gold px-5 text-center font-secondary text-sm font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-gold/90"
              onClick={(e) => handleNavClick(e, siteConfig.cta.href)}
            >
              Schedule a Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

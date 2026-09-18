"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const HEADER_OFFSET = 110;

function toHash(href: string) {
  if (href.includes("#")) return `#${href.split("#")[1]}`;
  return null;
}

function toRoute(href: string) {
  const hash = toHash(href);
  if (!hash || hash === "#top") return "/";
  return `/${hash}`;
}

function scrollToHash(hash: string) {
  const targetId = hash.replace("#", "");

  if (!targetId || targetId === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "/");
    return;
  }

  const el = document.getElementById(targetId);
  if (!el) return;

  const top =
    el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;

  window.scrollTo({ top, behavior: "smooth" });
  window.history.pushState(null, "", hash);
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("#top");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash || "#top");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const hash = window.location.hash || "#top";
    if (hash === "#top") return;

    const timer = window.setTimeout(() => scrollToHash(hash), 100);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = siteConfig.nav
      .map((item) => toHash(item.href)?.slice(1))
      .filter((id): id is string => Boolean(id));

    const updateActive = () => {
      const marker = HEADER_OFFSET + 24;
      let current = "#top";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) {
          current = id === "top" ? "#top" : `#${id}`;
        }
      }

      setActiveHash((prev) => (prev === current ? prev : current));
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setIsMenuOpen(false);

    const hash = toHash(href);
    if (!hash) return;

    e.preventDefault();
    setActiveHash(hash);

    if (pathname !== "/") {
      router.push(toRoute(href));
      return;
    }

    scrollToHash(hash);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary shadow-md">
      <div className="mx-auto flex min-h-[80px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-[110px] lg:min-h-0 lg:grid lg:grid-cols-[270px_minmax(0,1fr)_auto] lg:gap-x-0 lg:px-[24px]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-px self-center transition-opacity hover:opacity-90 lg:justify-start"
          onClick={(e) => handleNavClick(e, "/#top")}
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

        <nav
          aria-label="Primary"
          className="hidden h-[89px] items-center justify-center gap-[21px] lg:flex"
        >
          {siteConfig.nav.map((item) => {
            const itemHash = toHash(item.href);
            const isCurrent = pathname === "/" && activeHash === itemHash;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={toRoute(item.href)}
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

        <Link
          href="/#cta"
          onClick={(e) => handleNavClick(e, "/#cta")}
          className="relative z-10 hidden h-[58px] w-[225px] shrink-0 flex-col items-center justify-center gap-[2px] bg-gold p-[10px_24px] text-center font-secondary text-[16px] font-bold uppercase leading-[1.2] tracking-[0.011em] text-[#001528] transition-all hover:bg-gold/90 hover:shadow-lg lg:flex"
        >
          <span className="w-full text-center leading-none">
            {siteConfig.cta.labelLines[0]}
          </span>
          <span className="w-full text-center leading-none">
            {siteConfig.cta.labelLines[1]}
          </span>
        </Link>

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

      {isMenuOpen && (
        <div className="border-t border-white/15 bg-primary px-4 py-5 lg:hidden">
          <nav aria-label="Mobile primary" className="flex flex-col">
            {siteConfig.nav.map((item) => {
              const itemHash = toHash(item.href);
              const isCurrent = pathname === "/" && activeHash === itemHash;

              return (
                <Link
                  key={`mobile-${item.href}-${item.label}`}
                  href={toRoute(item.href)}
                  className={cn(
                    "border-b border-white/10 py-4 font-secondary text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:text-gold",
                    isCurrent && "text-gold",
                  )}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/#cta"
              className="mt-5 flex min-h-[52px] items-center justify-center bg-gold px-5 text-center font-secondary text-sm font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-gold/90"
              onClick={(e) => handleNavClick(e, "/#cta")}
            >
              Schedule a Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

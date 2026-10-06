"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScheduleAppointment } from "@/components/schedule/schedule-provider";

function toHash(href: string) {
  if (href.includes("#")) return `#${href.split("#")[1]}`;
  return null;
}

function toRoute(href: string) {
  const hash = toHash(href);
  if (!hash || hash === "#top") return "/";
  return `/${hash}`;
}

function getHeaderOffset() {
  const bar = document.querySelector<HTMLElement>("[data-site-header-bar]");
  const height = bar?.getBoundingClientRect().height ?? 80;
  return Math.round(height);
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
    el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.pushState(null, "", hash);
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [activeHash, setActiveHash] = useState<string>("#top");
  const pathname = usePathname();
  const router = useRouter();
  const { openSchedule } = useScheduleAppointment();

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash || "#top");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMoreOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!moreMenuRef.current?.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMoreOpen]);

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
      const marker = getHeaderOffset() + 24;
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
    const hash = toHash(href);
    if (!hash) {
      setIsMenuOpen(false);
      return;
    }

    e.preventDefault();
    setActiveHash(hash);
    setIsMenuOpen(false);

    const goToSection = () => {
      if (pathname !== "/") {
        router.push(toRoute(href));
        return;
      }

      scrollToHash(hash);
    };

    // Wait until the mobile menu unmounts so section positions are accurate.
    requestAnimationFrame(() => {
      requestAnimationFrame(goToSection);
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary shadow-md">
      <div
        data-site-header-bar
        className="mx-auto flex min-h-[80px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 xl:h-[110px] xl:min-h-0 xl:grid xl:grid-cols-[270px_minmax(0,1fr)_auto] xl:gap-x-0 xl:px-[24px]"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-px self-center transition-opacity hover:opacity-90 lg:justify-start"
          onClick={(e) => handleNavClick(e, "/#top")}
        >
          <Image
            src="/logo/north-logo-01.svg"
            alt={siteConfig.name}
            width={328}
            height={104}
            priority
            className="h-auto w-[220px] lg:w-[270px]"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden h-[89px] items-center justify-center gap-[10px] xl:flex 2xl:gap-[18px]"
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
                  "relative flex h-full shrink-0 items-center justify-center whitespace-nowrap font-secondary text-[10px] font-bold uppercase leading-none tracking-[0.05em] text-white transition-colors hover:text-gold 2xl:text-[13px]",
                  isCurrent &&
                    "text-gold after:absolute after:bottom-6 after:left-0 after:right-0 after:h-0.5 after:bg-gold",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div ref={moreMenuRef} className="relative flex h-full shrink-0">
            <button
              type="button"
              id="site-nav-more-trigger"
              aria-expanded={isMoreOpen}
              aria-haspopup="true"
              aria-controls="site-nav-more-menu"
              onClick={() => setIsMoreOpen((open) => !open)}
              className={cn(
                "relative flex h-full shrink-0 items-center justify-center gap-1 whitespace-nowrap font-secondary text-[10px] font-bold uppercase leading-none tracking-[0.05em] text-white transition-colors hover:text-gold 2xl:text-[13px]",
                isMoreOpen && "text-gold",
              )}
            >
              {siteConfig.navMore.label}
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 transition-transform",
                  isMoreOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {isMoreOpen && (
              <div
                id="site-nav-more-menu"
                role="menu"
                aria-labelledby="site-nav-more-trigger"
                className="absolute left-1/2 top-full z-50 min-w-[180px] -translate-x-1/2 pt-2"
              >
                <div className="overflow-hidden rounded-md border border-white/15 bg-primary py-1 shadow-lg">
                  {siteConfig.navMore.links.map((link) => {
                    const isCurrent = pathname === link.href;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        role="menuitem"
                        aria-current={isCurrent ? "page" : undefined}
                        onClick={() => setIsMoreOpen(false)}
                        className={cn(
                          "block px-4 py-2.5 font-secondary text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white/10 hover:text-gold 2xl:text-[13px]",
                          isCurrent && "text-gold",
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(false);
            openSchedule();
          }}
          className="relative z-10 hidden h-[58px] w-[225px] shrink-0 flex-col items-center justify-center gap-[2px] bg-gold p-[10px_24px] text-center font-secondary text-[16px] font-bold uppercase leading-[1.2] tracking-[0.011em] text-[#001528] transition-all hover:bg-gold/90 hover:shadow-lg xl:flex"
        >
          <span className="w-full text-center leading-none">
            {siteConfig.cta.labelLines[0]}
          </span>
          <span className="w-full text-center leading-none">
            {siteConfig.cta.labelLines[1]}
          </span>
        </button>

        <button
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          className="relative z-10 flex size-11 items-center justify-center text-white xl:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-x-0 top-[80px] bottom-0 z-40 overflow-y-auto overscroll-contain border-t border-white/15 bg-primary px-4 py-5 xl:hidden">
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
            <p className="border-b border-white/10 py-3 pt-5 font-secondary text-xs font-bold uppercase tracking-[0.12em] text-white/60">
              {siteConfig.navMore.label}
            </p>
            {siteConfig.navMore.links.map((link) => (
              <Link
                key={`mobile-${link.href}`}
                href={link.href}
                className={cn(
                  "border-b border-white/10 py-4 pl-3 font-secondary text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:text-gold",
                  pathname === link.href && "text-gold",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="mt-5 flex min-h-[52px] w-full items-center justify-center bg-gold px-5 text-center font-secondary text-sm font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-gold/90"
              onClick={() => {
                setIsMenuOpen(false);
                openSchedule();
              }}
            >
              Schedule a Consultation
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

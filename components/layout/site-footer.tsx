// components/layout/site-footer.tsx

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const { footer, cta, name } = siteConfig;

  return (
    <footer className="relative z-10 w-full bg-[#030D22] text-white">
      {/* Top CTA Band */}
      <section
        id="cta"
        aria-label="Schedule a consultation"
        className="border-y border-white/10 py-8"
        style={{
          background:
            "linear-gradient(90deg, #030D22 0%, #071630 50%, #030D22 100%)",
        }}
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-4 px-5 py-3 sm:gap-6 sm:py-4 lg:flex-row lg:px-12">
          <div className="flex flex-row items-center text-left gap-3 sm:gap-5">
            {/* Icon — hidden on small mobile to save space */}
            <div className="hidden sm:flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#d48c27]">
              <Image
                src="/icons/footer-icon.svg"
                alt=""
                width={48}
                height={48}
                className="size-10 shrink-0"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="font-heading text-[14px] font-bold leading-snug text-white sm:text-[20px] lg:text-[26px]">
                {footer.ctaTitle}
              </h2>
              <p className="font-body text-[11px] text-white/60 sm:text-[13px]">
                {footer.ctaSubtitle}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-1.5 sm:w-auto sm:items-end sm:gap-2">
            <Link
              href={cta.href}
              className="flex h-[40px] w-full items-center justify-center bg-[#d48c27] font-body text-[11px] font-bold tracking-[0.08em] text-white uppercase shadow-sm transition-colors hover:bg-[#b8781e] sm:h-[46px] sm:w-[260px] sm:text-[13px]"
            >
              {cta.label}
            </Link>
            <Link
              href={footer.contactHref}
              className="font-body text-[11px] text-white/80 underline-offset-4 hover:underline sm:text-[13px]"
            >
              {footer.contactLinkLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Main Dynamic Footer Link Grid */}
      <section className="bg-[#020B1E] py-12" id="contact">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 lg:px-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
            {/* Column 1: Brand Logo Only */}
            <div className="flex flex-col gap-3 lg:col-span-2">
              <Link href="#top" className="flex items-center">
                <Image
                  src="/logo/north-logo.svg"
                  alt={name}
                  width={500}
                  height={160}
                  className="h-auto w-[320px] sm:w-[380px] lg:w-[380px]"
                />
              </Link>
            </div>

            {/* Dynamic Content Columns */}
            {footer.columns.map((col) => (
              <div key={col.id} className="flex flex-col gap-6">
                {col.groups.map((group) => (
                  <div key={group.title} className="flex flex-col gap-3">
                    <h3 className="font-body text-[13px] font-extrabold tracking-wider text-white uppercase">
                      {group.title}
                    </h3>
                    <ul className="flex flex-col gap-2 font-body text-[13px] text-white/70">
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className="hover:text-white">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}

            {/* Column 5: Contact Details */}
            <div className="flex flex-col gap-3">
              <h3 className="font-body text-[13px] font-extrabold tracking-wider text-white uppercase">
                CONTACT
              </h3>
              <ul className="flex flex-col gap-3 font-body text-[13px] text-white/80">
                <li>
                  <a
                    href={`tel:${footer.contact.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2.5 hover:text-white"
                  >
                    <Image
                      src="/icons/call.svg"
                      alt=""
                      width={14}
                      height={14}
                      className="size-[14px] shrink-0"
                      unoptimized
                    />
                    <span>{footer.contact.phone}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${footer.contact.email}`}
                    className="flex items-center gap-2.5 break-all hover:text-white"
                  >
                    <Image
                      src="/icons/email.svg"
                      alt=""
                      width={14}
                      height={14}
                      className="size-[14px] shrink-0"
                      unoptimized
                    />
                    <span>{footer.contact.email}</span>
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Image
                    src="/icons/location.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="size-[14px] shrink-0"
                    unoptimized
                  />
                  <span>{footer.contact.location}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Image
                    src="/icons/domain.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="size-[14px] shrink-0"
                    unoptimized
                  />
                  <span>{footer.contact.scope}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Bar */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 font-body text-[12px] text-white/50 sm:flex-row">
              <p className="text-center sm:text-left">
                © {new Date().getFullYear()} {name}. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {footer.legal.map((item, index) => (
                  <span key={item.label} className="flex items-center gap-4">
                    {index > 0 && (
                      <span className="h-3 w-px bg-white/20" aria-hidden />
                    )}
                    <Link href={item.href} className="hover:text-white">
                      {item.label}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ScheduleAppointmentProvider,
  useScheduleAppointment,
} from "@/components/schedule/schedule-provider";
import { HeroSection } from "@/components/landing/hero-section";
import { siteConfig } from "@/config/site";

function PublicCoverContent() {
  const { openSchedule } = useScheduleAppointment();
  const { publicCover } = siteConfig;

  return (
    <div className="flex min-h-screen flex-col bg-[#020B1E] text-white">
      {/* Same 1600px column and px-5 / sm:px-8 inset as the hero below, so the
          logo and the hero copy share one left edge. */}
      <header className="sticky top-0 z-50 w-full bg-primary shadow-md">
        <div className="mx-auto flex min-h-[80px] w-full max-w-[1600px] items-center justify-between gap-2 px-5 sm:gap-4 sm:px-8 xl:h-[110px]">
          <Image
            src="/logo/Group%20151.svg"
            alt={siteConfig.name}
            width={345}
            height={116}
            priority
            className="h-auto w-[170px] shrink-0 sm:w-[210px] lg:w-[270px]"
          />
          <button
            type="button"
            onClick={openSchedule}
            className="flex h-[44px] shrink-0 cursor-pointer flex-col items-center justify-center gap-[1px] bg-gold px-3 text-center font-secondary text-[9px] font-bold uppercase leading-[1.15] text-primary transition-colors hover:bg-gold/90 sm:px-6 sm:text-[11px] xl:h-[58px] xl:w-[225px] xl:gap-[2px] xl:p-[10px_24px] xl:text-[16px] xl:leading-[1.2]"
          >
            <span className="w-full text-center leading-none">
              {siteConfig.cta.labelLines[0]}
            </span>
            <span className="w-full text-center leading-none">
              {siteConfig.cta.labelLines[1]}
            </span>
          </button>
        </div>
      </header>

      <main id="main" className="flex flex-1 flex-col">
        <HeroSection hideSecondaryCta />

        <section className="flex w-full flex-1 justify-center bg-background">
          <div className="flex w-full max-w-4xl flex-col items-center px-5 py-12 text-center sm:px-8 sm:py-16">
            <h2 className="font-heading text-2xl font-bold tracking-wide text-primary uppercase sm:text-3xl">
              {publicCover.title}
            </h2>
            <p className="mt-3 font-secondary text-sm font-semibold tracking-[0.08em] text-bronze uppercase sm:text-base">
              {publicCover.tagline}
            </p>
            <p className="mt-5 max-w-3xl text-base leading-7 text-foreground sm:text-lg sm:leading-8">
              {publicCover.introduction}
            </p>

            <h2 className="mt-10 font-heading text-xl font-bold tracking-[0.06em] text-primary uppercase sm:mt-12 sm:text-2xl">
              {publicCover.privacyTitle}
            </h2>
            <div className="mt-5 flex max-w-3xl flex-col gap-4 text-[15px] leading-7 text-foreground sm:text-base sm:leading-8">
              {publicCover.privacyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-9 flex flex-col items-center gap-2 text-base sm:text-lg">
              <a
                href={publicCover.phone.href}
                className="font-semibold tracking-wide text-primary transition-colors hover:text-bronze"
              >
                {publicCover.phone.label}
              </a>
              <a
                href={publicCover.email.href}
                className="text-bronze underline decoration-bronze/40 underline-offset-4 transition-colors hover:text-primary"
              >
                {publicCover.email.label}
              </a>
            </div>

            <div className="mt-9 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={publicCover.representativeLogin.href}
                className="inline-flex min-h-12 items-center justify-center border border-bronze px-5 text-center font-secondary text-xs font-bold tracking-[0.08em] text-bronze uppercase transition-colors hover:bg-bronze hover:text-white"
              >
                {publicCover.representativeLogin.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function PublicCoverPage() {
  return (
    <ScheduleAppointmentProvider>
      <PublicCoverContent />
    </ScheduleAppointmentProvider>
  );
}

import Image from "next/image";
import type { ReactNode } from "react";

import { authConfig } from "@/config/auth";

type AuthScreenLayoutProps = {
  children: ReactNode;
};

export function AuthScreenLayout({ children }: AuthScreenLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary p-4 sm:p-[18px]">
      <Image
        src={authConfig.assets.backgroundImage}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-primary/70" aria-hidden="true" />

      <div className="absolute bottom-6 left-6 z-20 hidden lg:block xl:bottom-[54px] xl:left-[55px]">
        <Image
          src={authConfig.assets.logo}
          alt="NORTH POINT SALES GROUP"
          width={328}
          height={104}
          priority
          className="h-auto w-[328px]"
        />
      </div>

      <section className="relative z-10 flex min-h-[calc(100dvh-2rem)] w-full max-w-[851px] items-center justify-center rounded-[30px] bg-white px-6 py-12 shadow-2xl sm:min-h-[calc(100dvh-36px)] sm:px-10 lg:ml-auto lg:mr-0 lg:translate-y-[-1px] xl:mr-0">
        <div className="w-full max-w-[432px] lg:-translate-y-7">{children}</div>
      </section>
    </main>
  );
}

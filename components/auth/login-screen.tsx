"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { AdminLoginForm } from "@/components/admin/admin-login";
import { AuthScreenLayout } from "@/components/shared/auth-screen-layout";
import { authConfig } from "@/config/auth";

export function LoginScreen() {
  const [notice, setNotice] = useState("");
  const { login } = authConfig;

  return (
    <AuthScreenLayout>
      <div className="mb-5 text-center">
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[30px] leading-[1.15] font-bold tracking-[-0.04em] text-primary sm:text-[36px]">
          {login.title}
        </h1>
        <p className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-[14px] leading-[1.5] text-muted-foreground sm:text-[16px]">
          {login.description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setNotice(login.googleUnavailableMessage)}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-input px-4 font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
      >
        <Image
          src="/images/auth/google-icon.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          unoptimized
          className="size-4"
        />
        {login.googleButtonLabel}
      </button>

      <div className="my-4 border-t border-border" aria-hidden="true" />

      <AdminLoginForm
        forgotPasswordControl={
          <div className="flex justify-end">
            <Link
              href={login.forgotPasswordHref}
              className="cursor-pointer font-[family-name:var(--font-plus-jakarta)] text-[12px] font-semibold text-bronze hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
            >
              {login.forgotPasswordLabel}
            </Link>
          </div>
        }
      />

      {notice ? (
        <p
          role="status"
          className="mt-3 font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground"
        >
          {notice}
        </p>
      ) : null}

      <p className="mt-6 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground">
        {login.signupPrompt}{" "}
        <Link
          href={login.signupHref}
          className="cursor-pointer font-semibold text-bronze underline underline-offset-2 hover:brightness-90"
        >
          {login.signupLinkLabel}
        </Link>
      </p>
    </AuthScreenLayout>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AuthScreenLayout } from "@/components/shared/auth-screen-layout";
import { authConfig } from "@/config/auth";

export function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const { signup } = authConfig;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(signup.accountUnavailableMessage);
  };

  return (
    <AuthScreenLayout>
      <div className="mb-8 text-center">
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[30px] leading-[1.15] font-bold tracking-[-0.04em] text-primary sm:text-[36px]">
          {signup.title}
        </h1>
        <p className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-[14px] leading-[1.5] text-muted-foreground sm:text-[16px]">
          {signup.description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setNotice(signup.googleUnavailableMessage)}
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
        {signup.googleButtonLabel}
      </button>

      <div className="my-4 border-t border-border" aria-hidden="true" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="signup-name">
          {signup.fields.name.label}
        </label>
        <input
          id="signup-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={signup.fields.name.placeholder}
          required
          className="h-12 w-full rounded-xl border border-input px-3 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
        />

        <label className="sr-only" htmlFor="signup-email">
          {signup.fields.email.label}
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={signup.fields.email.placeholder}
          required
          className="h-12 w-full rounded-xl border border-input px-3 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
        />

        <div className="relative">
          <label className="sr-only" htmlFor="signup-password">
            {signup.fields.password.label}
          </label>
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={signup.fields.password.placeholder}
            minLength={8}
            required
            className="h-12 w-full rounded-xl border border-input px-3 pr-12 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={
              showPassword
                ? signup.passwordVisibility.hide
                : signup.passwordVisibility.show
            }
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
          >
            {showPassword ? (
              <EyeOff className="size-[18px]" />
            ) : (
              <Eye className="size-[18px]" />
            )}
          </button>
        </div>

        {notice ? (
          <p
            role="status"
            className="font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground"
          >
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-bronze font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-white transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
        >
          {signup.continueButtonLabel}
        </button>
      </form>

      <p className="mt-4 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground">
        {signup.loginPrompt}{" "}
        <Link
          href={signup.loginHref}
          className="cursor-pointer font-semibold text-bronze underline underline-offset-2 hover:brightness-90"
        >
          {signup.loginLinkLabel}
        </Link>
      </p>
    </AuthScreenLayout>
  );
}

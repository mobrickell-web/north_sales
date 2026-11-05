"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthScreenLayout } from "@/components/shared/auth-screen-layout";
import { authConfig } from "@/config/auth";
import { requestPasswordReset } from "@/lib/auth-api";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword } = authConfig;
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    setSubmitting(true);
    setNotice("");
    try {
      await requestPasswordReset(email);
      router.push(
        `${forgotPassword.verificationHref}?purpose=PASSWORD_RESET&email=${encodeURIComponent(email)}`,
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not request a password reset code.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenLayout>
      <div className="mb-8 text-center">
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[30px] leading-[1.15] font-bold tracking-[-0.04em] text-primary sm:text-[36px]">
          {forgotPassword.title}
        </h1>
        <p className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-[14px] leading-[1.5] text-muted-foreground sm:text-[16px]">
          {forgotPassword.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="forgot-password-email">
          {forgotPassword.email.label}
        </label>
        <input
          id="forgot-password-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={forgotPassword.email.placeholder}
          required
          className="h-12 w-full rounded-xl border border-input px-3 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
        />

        {notice ? (
          <p role="alert" className="text-[12px] text-destructive">
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-bronze font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-white transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : forgotPassword.sendCodeButtonLabel}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link
          href={forgotPassword.loginHref}
          className="cursor-pointer font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-foreground hover:text-bronze"
        >
          {forgotPassword.backLabel}
        </Link>
      </div>

      <p className="mt-6 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground">
        {forgotPassword.loginPrompt}{" "}
        <Link
          href={forgotPassword.loginHref}
          className="cursor-pointer font-semibold text-bronze underline underline-offset-2 hover:brightness-90"
        >
          {forgotPassword.loginLinkLabel}
        </Link>
      </p>
    </AuthScreenLayout>
  );
}

"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore, type FormEvent } from "react";

import { AuthScreenLayout } from "@/components/shared/auth-screen-layout";
import { authConfig } from "@/config/auth";
import {
  AdminApiError,
  clearPasswordResetToken,
  getPasswordResetToken,
  submitPasswordReset,
} from "@/lib/auth-api";

export function UpdatePasswordScreen() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { updatePassword } = authConfig;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updated, setUpdated] = useState(false);
  const tokenReady = useSyncExternalStore(
    subscribeToPasswordResetToken,
    getPasswordResetTokenReady,
    getServerPasswordResetTokenReady,
  );
  const resetToken = useSyncExternalStore(
    subscribeToPasswordResetToken,
    getPasswordResetToken,
    getServerPasswordResetToken,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resetToken) {
      setNotice("Your password reset session is missing. Request a new code.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setNotice(updatePassword.passwordMismatchMessage);
      return;
    }

    setSubmitting(true);
    setNotice("");
    try {
      await submitPasswordReset(resetToken, password);
      clearPasswordResetToken();
      setUpdated(true);
      setNotice("Your password has been updated. You can now sign in.");
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 401) {
        clearPasswordResetToken();
      }
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not update your password. Request a new reset code.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenLayout>
      <div className="mb-5 text-center">
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[30px] leading-[1.15] font-bold tracking-[-0.04em] text-primary sm:text-[36px]">
          {updatePassword.title}
        </h1>
        <p className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-[14px] leading-[1.5] text-muted-foreground sm:text-[16px]">
          {updatePassword.description}
        </p>
        {email ? (
          <p className="mt-2 break-all font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-foreground">
            {email}
          </p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <label className="sr-only" htmlFor="update-password">
            {updatePassword.password.label}
          </label>
          <input
            id="update-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={updatePassword.password.placeholder}
            minLength={8}
            required
            className="h-12 w-full rounded-xl border border-input px-3 pr-12 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={
              showPassword
                ? updatePassword.passwordVisibility.hide
                : updatePassword.passwordVisibility.show
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

        <div className="relative">
          <label className="sr-only" htmlFor="confirm-update-password">
            {updatePassword.confirmPassword.label}
          </label>
          <input
            id="confirm-update-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={updatePassword.confirmPassword.placeholder}
            minLength={8}
            required
            className="h-12 w-full rounded-xl border border-input px-3 pr-12 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((visible) => !visible)}
            aria-label={
              showConfirmPassword
                ? updatePassword.passwordVisibility.hide
                : updatePassword.passwordVisibility.show
            }
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
          >
            {showConfirmPassword ? (
              <EyeOff className="size-[18px]" />
            ) : (
              <Eye className="size-[18px]" />
            )}
          </button>
        </div>

        {notice ? (
          <p
            role={updated ? "status" : "alert"}
            className="font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground"
          >
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!tokenReady || !resetToken || submitting || updated}
          className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-bronze font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-white transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Updating…"
            : updated
              ? "Password updated"
              : updatePassword.continueButtonLabel}
        </button>
      </form>

      {(!tokenReady || !resetToken) && (
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="cursor-pointer font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-bronze underline underline-offset-2 hover:brightness-90"
          >
            Request another reset code
          </Link>
        </div>
      )}

      <p className="mt-6 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground">
        {updatePassword.loginPrompt}{" "}
        <Link
          href={updatePassword.loginHref}
          className="cursor-pointer font-semibold text-bronze underline underline-offset-2 hover:brightness-90"
        >
          {updatePassword.loginLinkLabel}
        </Link>
      </p>
    </AuthScreenLayout>
  );
}

function subscribeToPasswordResetToken() {
  return () => {};
}

function getPasswordResetTokenReady() {
  return true;
}

function getServerPasswordResetTokenReady() {
  return false;
}

function getServerPasswordResetToken() {
  return null;
}

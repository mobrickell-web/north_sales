"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthScreenLayout } from "@/components/shared/auth-screen-layout";
import { authConfig } from "@/config/auth";

export function UpdatePasswordScreen() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { updatePassword } = authConfig;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setNotice(updatePassword.passwordMismatchMessage);
      return;
    }

    setNotice(updatePassword.unavailableMessage);
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
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="update-password-email">
          {updatePassword.email.label}
        </label>
        <input
          id="update-password-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={updatePassword.email.placeholder}
          defaultValue={email}
          required
          className="h-12 w-full rounded-xl border border-input px-3 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
        />

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
          {updatePassword.continueButtonLabel}
        </button>
      </form>

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

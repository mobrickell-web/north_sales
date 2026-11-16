"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
} from "react";

import { AuthRedirectOverlay } from "@/components/shared/app-toast";
import { AuthScreenLayout } from "@/components/shared/auth-screen-layout";
import { authConfig } from "@/config/auth";
import {
  resendAuthCode,
  storePasswordResetToken,
  verifyAuthCode,
  type VerificationPurpose,
} from "@/lib/auth-api";
import { toast } from "@/lib/toast";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const CODE_EXPIRES_IN_SECONDS = 5 * 60;

export function VerificationCodeScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const purpose: VerificationPurpose =
    searchParams.get("purpose") === "SIGNUP" ? "SIGNUP" : "PASSWORD_RESET";
  const { verificationCode } = authConfig;
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [codeExpiresIn, setCodeExpiresIn] = useState(CODE_EXPIRES_IN_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(
      () => setResendCooldown((remaining) => Math.max(remaining - 1, 0)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (codeExpiresIn <= 0) return;
    const timer = window.setTimeout(
      () => setCodeExpiresIn((remaining) => Math.max(remaining - 1, 0)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [codeExpiresIn]);

  const formatCountdown = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const startFreshCodeTimers = (
    retryAfterSeconds = RESEND_COOLDOWN_SECONDS,
  ) => {
    setResendCooldown(retryAfterSeconds);
    setCodeExpiresIn(CODE_EXPIRES_IN_SECONDS);
  };

  const updateDigits = (startIndex: number, value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, CODE_LENGTH - startIndex);
    if (!numbers) return;

    setDigits((current) => {
      const next = [...current];
      numbers.split("").forEach((digit, index) => {
        next[startIndex + index] = digit;
      });
      return next;
    });

    const focusIndex = Math.min(startIndex + numbers.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    updateDigits(0, event.clipboardData.getData("text"));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      toast.error(
        purpose === "SIGNUP"
          ? "Email address is missing. Return to sign up and try again."
          : "Email address is missing. Request a new password reset code.",
      );
      return;
    }
    if (digits.some((digit) => !digit)) {
      const firstEmptyIndex = digits.findIndex((digit) => !digit);
      inputRefs.current[firstEmptyIndex]?.focus();
      toast.error("Enter all six digits to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await verifyAuthCode(email, digits.join(""), purpose);
      if (purpose === "SIGNUP") {
        toast.afterRedirect("Email verified. You can sign in now.");
        router.replace(verificationCode.loginHref);
        return;
      }

      if (!result.resetToken) {
        throw new Error(
          "The password reset token was not returned. Request a new code.",
        );
      }
      storePasswordResetToken(result.resetToken);
      toast.afterRedirect("Code verified. Set your new password.");
      const query = `?email=${encodeURIComponent(email)}`;
      router.push(`${verificationCode.updatePasswordHref}${query}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Code verification failed.",
      );
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resending || resendCooldown > 0) return;
    if (!email) {
      toast.error(
        purpose === "SIGNUP"
          ? "Email address is missing. Return to sign up and try again."
          : "Email address is missing. Request a new password reset code.",
      );
      return;
    }
    setResending(true);
    try {
      const result = await resendAuthCode(email, purpose);
      toast.success("A new verification code has been sent.");
      startFreshCodeTimers(
        typeof result.retryAfterSeconds === "number"
          ? result.retryAfterSeconds
          : RESEND_COOLDOWN_SECONDS,
      );
      setDigits(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not resend the code.",
      );
      if (error instanceof Error) {
        const cooldown = error.message.match(/wait (\d+) seconds/i);
        if (cooldown) setResendCooldown(Number(cooldown[1]));
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthScreenLayout>
      <AuthRedirectOverlay
        open={submitting || resending}
        message={
          resending
            ? "Sending new code…"
            : purpose === "SIGNUP"
              ? "Verifying email…"
              : "Verifying code…"
        }
      />
      <div className="mb-8 text-center">
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[30px] leading-[1.15] font-bold tracking-[-0.04em] text-primary sm:text-[36px]">
          {verificationCode.title}
        </h1>
        <p className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-[14px] leading-[1.5] text-muted-foreground sm:text-[16px]">
          {verificationCode.description}
        </p>
        {email ? (
          <p className="mt-1 break-all font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-foreground">
            {email}
          </p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div
          role="group"
          aria-label={verificationCode.title}
          className="flex w-full justify-center gap-2 sm:gap-3"
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              pattern="[0-9]*"
              maxLength={CODE_LENGTH}
              aria-label={`${verificationCode.codeLabel} ${index + 1}`}
              value={digit}
              onChange={(event) => updateDigits(index, event.target.value)}
              onPaste={handlePaste}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digits[index] && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
                if (event.key === "ArrowLeft" && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
                if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
              className="size-10 rounded-lg border border-input text-center font-[family-name:var(--font-plus-jakarta)] text-[18px] font-semibold text-foreground outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/15 sm:size-11"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting || resending || codeExpiresIn <= 0}
          className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-bronze font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-white transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Verifying…" : verificationCode.verifyButtonLabel}
        </button>
      </form>

      <p
        role="status"
        className="mt-3 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground"
      >
        {codeExpiresIn > 0
          ? `Code expires in ${formatCountdown(codeExpiresIn)}`
          : "Code expired. Resend a new code to continue."}
      </p>

      <p className="mt-2 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground">
        {resendCooldown > 0 ? (
          <>Resend code will be available in {resendCooldown}s</>
        ) : (
          <>
            {verificationCode.resendPrompt}{" "}
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={resending || submitting}
              className="cursor-pointer font-semibold text-bronze underline underline-offset-2 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending ? "Sending…" : verificationCode.resendButtonLabel}
            </button>
          </>
        )}
      </p>

      <p className="mt-6 text-center">
        <Link
          href={verificationCode.loginHref}
          className="cursor-pointer font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-foreground hover:text-bronze"
        >
          {verificationCode.backToLoginLabel}
        </Link>
      </p>
    </AuthScreenLayout>
  );
}

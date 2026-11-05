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

import { AuthScreenLayout } from "@/components/shared/auth-screen-layout";
import { authConfig } from "@/config/auth";
import {
  resendAuthCode,
  storePasswordResetToken,
  verifyAuthCode,
  type VerificationPurpose,
} from "@/lib/auth-api";

const CODE_LENGTH = 6;

export function VerificationCodeScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const purpose: VerificationPurpose =
    searchParams.get("purpose") === "SIGNUP" ? "SIGNUP" : "PASSWORD_RESET";
  const { verificationCode } = authConfig;
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [notice, setNotice] = useState("");
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(
      () => setResendCooldown((remaining) => Math.max(remaining - 1, 0)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

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
      setNotice(
        purpose === "SIGNUP"
          ? "Email address is missing. Return to sign up and try again."
          : "Email address is missing. Request a new password reset code.",
      );
      setNoticeIsError(true);
      return;
    }
    if (digits.some((digit) => !digit)) {
      const firstEmptyIndex = digits.findIndex((digit) => !digit);
      inputRefs.current[firstEmptyIndex]?.focus();
      setNotice("Enter all six digits to continue.");
      setNoticeIsError(true);
      return;
    }

    setSubmitting(true);
    setNotice("");
    setNoticeIsError(false);
    try {
      const result = await verifyAuthCode(email, digits.join(""), purpose);
      if (purpose === "SIGNUP") {
        setNoticeIsError(false);
        router.replace(verificationCode.loginHref);
        return;
      }

      if (!result.resetToken) {
        throw new Error(
          "The password reset token was not returned. Request a new code.",
        );
      }
      storePasswordResetToken(result.resetToken);
      const query = `?email=${encodeURIComponent(email)}`;
      router.push(`${verificationCode.updatePasswordHref}${query}`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Code verification failed.",
      );
      setNoticeIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resending || resendCooldown > 0) return;
    if (!email) {
      setNotice(
        purpose === "SIGNUP"
          ? "Email address is missing. Return to sign up and try again."
          : "Email address is missing. Request a new password reset code.",
      );
      setNoticeIsError(true);
      return;
    }
    setResending(true);
    try {
      const result = await resendAuthCode(email, purpose);
      setNotice(result.message);
      setNoticeIsError(false);
      if (typeof result.retryAfterSeconds === "number") {
        setResendCooldown(result.retryAfterSeconds);
        setDigits(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        setResendCooldown(0);
      }
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not resend the code.",
      );
      setNoticeIsError(true);
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

        {notice ? (
          <p
            role={noticeIsError ? "alert" : "status"}
            className="mt-3 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground"
          >
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting || resending}
          className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-bronze font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-white transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Verifying…" : verificationCode.verifyButtonLabel}
        </button>
      </form>

      <p className="mt-3 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground">
        {verificationCode.resendPrompt}{" "}
        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={resending || submitting || resendCooldown > 0}
          className="cursor-pointer font-semibold text-bronze underline underline-offset-2 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending
            ? "Sending…"
            : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : verificationCode.resendButtonLabel}
        </button>
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

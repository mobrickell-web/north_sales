"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type ClipboardEvent, type FormEvent } from "react";

import { AuthScreenLayout } from "@/components/shared/auth-screen-layout";
import { authConfig } from "@/config/auth";

const CODE_LENGTH = 6;

export function VerificationCodeScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { verificationCode } = authConfig;
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [notice, setNotice] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (digits.some((digit) => !digit)) {
      const firstEmptyIndex = digits.findIndex((digit) => !digit);
      inputRefs.current[firstEmptyIndex]?.focus();
      setNotice("Enter all six digits to continue.");
      return;
    }

    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`${verificationCode.updatePasswordHref}${query}`);
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
            role="status"
            className="mt-3 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground"
          >
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-bronze font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-white transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
        >
          {verificationCode.verifyButtonLabel}
        </button>
      </form>

      <p className="mt-3 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground">
        {verificationCode.resendPrompt}{" "}
        <button
          type="button"
          onClick={() => setNotice(verificationCode.resendUnavailableMessage)}
          className="cursor-pointer font-semibold text-bronze underline underline-offset-2 hover:brightness-90"
        >
          {verificationCode.resendButtonLabel}
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

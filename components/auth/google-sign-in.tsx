"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { MouseEvent } from "react";

import {
  googleLogin,
  getRoleHomePath,
  storeSession,
  type LoginCategory,
} from "@/lib/auth-api";

type GoogleCredentialResponse = {
  credential?: string;
};

type PromptMoment = {
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
};

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        auto_select: false;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      prompt: (callback?: (moment: PromptMoment) => void) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInScript({
  onReady,
  onError,
}: {
  onReady: () => void;
  onError: () => void;
}) {
  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onReady={onReady}
      onError={onError}
    />
  );
}

export function useGoogleSignIn(category: LoginCategory = "CLIENT") {
  const router = useRouter();
  const initialized = useRef(false);
  const submitting = useRef(false);
  // Google keeps the callback registered at initialize time, so the selected
  // category has to be read through a ref instead of a captured value.
  const categoryRef = useRef(category);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    categoryRef.current = category;
  }, [category]);

  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential || submitting.current) return;

      submitting.current = true;
      setIsSubmitting(true);
      setError("");
      try {
        const session = await googleLogin(
          response.credential,
          categoryRef.current,
        );
        storeSession(session);
        router.replace(getRoleHomePath(session.admin.role));
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Google sign-in failed. Please try again.",
        );
        submitting.current = false;
        setIsSubmitting(false);
      }
    },
    [router],
  );

  const initialize = useCallback(() => {
    if (initialized.current || !GOOGLE_CLIENT_ID || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      auto_select: false,
      callback: (response) => void handleCredential(response),
    });
    initialized.current = true;
  }, [handleCredential]);

  const handleScriptError = useCallback(() => {
    setError("Google sign-in could not load. Please try again.");
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (category === "OTHER") {
        event.preventDefault();
        router.replace("/");
        return;
      }
      if (!GOOGLE_CLIENT_ID) {
        setError("Google sign-in is not configured.");
        return;
      }
      if (!initialized.current || !window.google) {
        setError("Google sign-in is still loading. Please try again.");
        return;
      }
      if (submitting.current) return;

      event.preventDefault();
      setError("");
      window.google.accounts.id.prompt((moment) => {
        if (moment.isNotDisplayed()) {
          setError(
            moment.getNotDisplayedReason() === "browser_not_supported"
              ? "Google sign-in is not supported in this browser."
              : "Google sign-in could not open. Check your browser's popup or privacy settings and try again.",
          );
        } else if (moment.isSkippedMoment()) {
          setError(
            moment.getSkippedReason() === "user_cancel"
              ? "Google sign-in was cancelled."
              : "Google sign-in was skipped. Please try again.",
          );
        } else if (moment.isDismissedMoment()) {
          setError(
            moment.getDismissedReason() === "credential_returned"
              ? ""
              : "Google sign-in was dismissed.",
          );
        }
      });
    },
    [category, router],
  );

  return {
    handleClick,
    initialize,
    handleScriptError,
    error,
    isSubmitting,
  };
}

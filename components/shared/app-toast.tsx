"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";

import {
  dismissToast,
  flushQueuedToast,
  getToasts,
  subscribeToasts,
  type ToastItem,
} from "@/lib/toast";
import { cn } from "@/lib/utils";

const EMPTY_TOASTS: ToastItem[] = [];
const getServerToasts = () => EMPTY_TOASTS;

const subscribeNoop = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

function useIsClient() {
  return useSyncExternalStore(
    subscribeNoop,
    getClientMounted,
    getServerMounted,
  );
}

function ToastCard({ item }: { item: ToastItem }) {
  useEffect(() => {
    const timer = window.setTimeout(() => dismissToast(item.id), 4200);
    return () => window.clearTimeout(timer);
  }, [item.id]);

  return (
    <div
      role={item.tone === "error" ? "alert" : "status"}
      className={cn(
        "flex w-[min(calc(100vw-3rem),356px)] items-start gap-3 rounded-md border bg-white px-4 py-3 text-slate-950 shadow-lg",
        "animate-in fade-in-0 slide-in-from-bottom-5 duration-300",
        item.tone === "success" && "border-emerald-200",
        item.tone === "error" && "border-red-200",
        item.tone === "info" && "border-slate-200",
      )}
    >
      {item.tone === "success" ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
      ) : item.tone === "error" ? (
        <XCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
      ) : (
        <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-slate-500" />
      )}
      <div className="grid min-w-0 flex-1 gap-0.5 pr-1">
        <p className="font-[family-name:var(--font-plus-jakarta)] text-[13px] leading-5 font-semibold">
          {item.title}
        </p>
        <p className="font-[family-name:var(--font-plus-jakarta)] text-[12px] leading-5 text-slate-600">
          {item.message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => dismissToast(item.id)}
        aria-label="Dismiss notification"
        className="shrink-0 cursor-pointer rounded-sm p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

/** Global toaster — mount once in the root layout. */
export function AppToaster() {
  const pathname = usePathname();
  const mounted = useIsClient();
  const items = useSyncExternalStore(
    subscribeToasts,
    getToasts,
    getServerToasts,
  );

  useEffect(() => {
    flushQueuedToast();
  }, [pathname]);

  if (!mounted || items.length === 0) return null;

  return createPortal(
    <div className="fixed right-6 bottom-10 z-[9999] flex flex-col-reverse gap-2">
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>,
    document.body,
  );
}

export function AuthRedirectOverlay({
  open,
  message = "Signing you in…",
}: {
  open: boolean;
  message?: string;
}) {
  const mounted = useIsClient();

  if (!mounted || !open) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/50 backdrop-blur-[1px]"
    >
      <div className="flex min-w-[240px] flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-8 py-7 shadow-xl">
        <Loader2 className="size-6 animate-spin text-bronze" />
        <p className="font-[family-name:var(--font-plus-jakarta)] text-[14px] font-semibold text-slate-900">
          {message}
        </p>
      </div>
    </div>,
    document.body,
  );
}

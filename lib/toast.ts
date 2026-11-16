export type ToastTone = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  tone: ToastTone;
  title: string;
  message: string;
};

type Listener = () => void;

type QueuedToast = {
  tone: ToastTone;
  message: string;
  title?: string;
};

const PENDING_TOAST_KEY = "north:pending-toast";

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

function push(tone: ToastTone, message: string, title?: string) {
  const item: ToastItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tone,
    title:
      title ??
      (tone === "success" ? "Success" : tone === "error" ? "Error" : "Notice"),
    message,
  };
  toasts = [...toasts, item].slice(-3);
  emit();
  return item.id;
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToasts() {
  return toasts;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

/** Show after navigation so it never overlaps the login loader overlay. */
export function queueToast(tone: ToastTone, message: string, title?: string) {
  if (typeof window === "undefined") return;
  const payload: QueuedToast = { tone, message, title };
  sessionStorage.setItem(PENDING_TOAST_KEY, JSON.stringify(payload));
}

export function flushQueuedToast() {
  if (typeof window === "undefined") return;
  const raw = sessionStorage.getItem(PENDING_TOAST_KEY);
  if (!raw) return;
  sessionStorage.removeItem(PENDING_TOAST_KEY);
  try {
    const queued = JSON.parse(raw) as QueuedToast;
    if (queued?.message) push(queued.tone, queued.message, queued.title);
  } catch {
    // Ignore corrupt queue payloads.
  }
}

export const toast = {
  success(message: string, title?: string) {
    return push("success", message, title);
  },
  error(message: string, title?: string) {
    return push("error", message, title);
  },
  info(message: string, title?: string) {
    return push("info", message, title);
  },
  /** Prefer this when a full-screen loader is showing before redirect. */
  afterRedirect(message: string, title?: string) {
    queueToast("success", message, title);
  },
};

/** Login / Google failures — pending access uses info, denials use error. */
export function toastAuthFailure(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong. Please try again.";

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: number }).status === 429
  ) {
    toast.info(message, "Please wait");
    return;
  }

  if (/pending Super Admin approval|waiting for Super Admin/i.test(message)) {
    toast.info(message, "Access pending");
    return;
  }

  if (
    /access request was not approved|no approved client access|Guests do not need an account/i.test(
      message,
    )
  ) {
    toast.error(message, "Access denied");
    return;
  }

  if (/inactive/i.test(message)) {
    toast.error(message, "Account inactive");
    return;
  }

  toast.error(message);
}

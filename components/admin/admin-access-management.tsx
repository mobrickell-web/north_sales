"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  Search,
  UserPlus,
  X,
} from "lucide-react";

import {
  AdminAlert,
  AdminCard,
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-ui";
import {
  STAFF_POSITION_LABELS,
  createClientAccount,
  createSalesRepresentative,
  deactivateClientAccess,
  decideClientAccessRequest,
  deactivateSalesRepresentative,
  listClientAccessRequests,
  listSalesRepresentatives,
  restoreClientAccess,
  restoreSalesRepresentative,
  validateAccountEmail,
  type ClientAccessRequest,
  type SalesRepresentative,
  type StaffPosition,
} from "@/lib/auth-api";
import { cn } from "@/lib/utils";

type PauseTarget =
  | { kind: "client"; request: ClientAccessRequest }
  | { kind: "rep"; representative: SalesRepresentative };

const staffPositionOptions = Object.entries(STAFF_POSITION_LABELS) as [
  StaffPosition,
  string,
][];

/** Match /appointments Rows control (10 / 20 / 50). */
const ACCESS_PAGE_SIZES = [10, 20, 50] as const;
type AccessPageSize = (typeof ACCESS_PAGE_SIZES)[number];

function isStaffPosition(value: string): value is StaffPosition {
  return value in STAFF_POSITION_LABELS;
}

function AccessRowsPager({
  total,
  take,
  skip,
  onTakeChange,
  onSkipChange,
  rowsLabel,
}: {
  total: number;
  take: AccessPageSize;
  skip: number;
  onTakeChange: (take: AccessPageSize) => void;
  onSkipChange: (skip: number) => void;
  rowsLabel: string;
}) {
  const pages = Math.max(1, Math.ceil(total / take) || 1);
  const safeSkip = Math.min(skip, Math.max(0, (pages - 1) * take));
  const page = Math.floor(safeSkip / take) + 1;

  return (
    <div className="flex flex-col gap-3 border-t border-[#EFEBE3] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="font-body text-[12px] tracking-[0.04em] text-[#8A8F98] uppercase">
          Rows
        </span>
        <select
          value={take}
          onChange={(event) => {
            onTakeChange(Number(event.target.value) as AccessPageSize);
            onSkipChange(0);
          }}
          aria-label={rowsLabel}
          className="rounded-lg border border-[#E8E4DC] bg-white px-2.5 py-1.5 font-body text-[13px] text-[#001528] outline-none focus:border-[#b17411]"
        >
          {ACCESS_PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-body text-[13px] text-[#5C5F66]">
          Page {page} of {pages}
        </span>
        <button
          type="button"
          onClick={() => onSkipChange(Math.max(0, safeSkip - take))}
          disabled={safeSkip === 0}
          aria-label="Previous page"
          className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8E4DC] text-[#001528] transition-colors hover:border-[#b17411] hover:text-[#b17411] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onSkipChange(safeSkip + take)}
          disabled={safeSkip + take >= total}
          aria-label="Next page"
          className="inline-flex size-9 items-center justify-center rounded-full border border-[#E8E4DC] text-[#001528] transition-colors hover:border-[#b17411] hover:text-[#b17411] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function PasswordField({
  name,
  label = "Initial password",
}: {
  name: string;
  label?: string;
}) {
  const [visible, setVisible] = useState(true);

  return (
    <label className="block">
      <span className={adminLabelClass}>{label}</span>
      <div className="relative">
        <input
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={8}
          maxLength={72}
          className={cn(adminInputClass, "pr-10")}
          autoComplete="new-password"
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-admin-muted hover:bg-admin-soft hover:text-admin-text-strong"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </label>
  );
}

function PositionDropdown({
  value,
  onChange,
}: {
  value: StaffPosition | "";
  onChange: (value: StaffPosition) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = value ? STAFF_POSITION_LABELS[value] : null;

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label="Position"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="team-member-position-options"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-left text-[13px] font-medium text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info"
      >
        <span
          className={cn(
            "truncate",
            !selectedLabel && "font-normal text-admin-muted",
          )}
        >
          {selectedLabel ?? "Select position"}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-admin-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id="team-member-position-options"
          role="listbox"
          aria-label="Position"
          className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full overflow-y-auto rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
        >
          {staffPositionOptions.map(([optionValue, label]) => (
            <button
              key={optionValue}
              type="button"
              role="option"
              aria-selected={optionValue === value}
              onClick={() => {
                onChange(optionValue);
                setOpen(false);
              }}
              className={cn(
                "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-admin-info",
                optionValue === value
                  ? "bg-admin-navy font-medium text-admin-surface"
                  : "text-admin-text-strong hover:bg-admin-soft",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PauseAccessDialogForm({
  who,
  submitting,
  onConfirm,
}: {
  who: string;
  submitting: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [localError, setLocalError] = useState("");

  return (
    <>
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-admin-border px-5 py-4 sm:px-6">
        <div>
          <Dialog.Title className="text-[18px] font-semibold text-admin-text-strong">
            Pause access for {who}?
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-[12px] leading-relaxed text-admin-muted">
            Enter a required comment. Active sessions will be revoked. Accounts
            are never deleted.
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label="Close"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-admin-muted hover:bg-admin-soft hover:text-admin-text-strong"
        >
          <X className="size-4" />
        </Dialog.Close>
      </header>

      <div className="space-y-3 px-5 py-4 sm:px-6">
        <label className="block">
          <span className={adminLabelClass}>Comment</span>
          <textarea
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              if (localError) setLocalError("");
            }}
            rows={3}
            placeholder="Why is access being paused?"
            className={cn(adminInputClass, "min-h-[88px] resize-none")}
          />
        </label>
        {localError ? (
          <p
            role="alert"
            className="rounded-lg border border-[#f3c9c9] bg-[#fdf3f3] px-3 py-2 text-[13px] text-[#8f2d2d]"
          >
            {localError}
          </p>
        ) : null}
      </div>

      <footer className="flex items-center justify-end gap-2 border-t border-admin-border px-5 py-3 sm:px-6">
        <Dialog.Close className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-admin-border-strong bg-admin-surface px-4 text-[12px] font-semibold text-admin-text-strong hover:bg-admin-soft">
          Cancel
        </Dialog.Close>
        <button
          type="button"
          disabled={submitting}
          onClick={() => {
            const trimmed = reason.trim();
            if (!trimmed) {
              setLocalError("A pause comment is required.");
              return;
            }
            onConfirm(trimmed);
          }}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#8f2d2d] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#7a2525] disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Pausing…" : "Pause access"}
        </button>
      </footer>
    </>
  );
}

function PauseAccessDialog({
  target,
  submitting,
  onOpenChange,
  onConfirm,
}: {
  target: PauseTarget | null;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}) {
  const who =
    target?.kind === "client"
      ? target.request.account.name
      : (target?.representative.name ?? "");
  const formKey =
    target?.kind === "client"
      ? `client:${target.request.id}`
      : target
        ? `rep:${target.representative.id}`
        : "closed";

  return (
    <Dialog.Root open={target !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100vw-24px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-admin-surface font-sans shadow-2xl">
          {target ? (
            <PauseAccessDialogForm
              key={formKey}
              who={who}
              submitting={submitting}
              onConfirm={onConfirm}
            />
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AdminAccessManagement() {
  const [requests, setRequests] = useState<ClientAccessRequest[]>([]);
  const [representatives, setRepresentatives] = useState<SalesRepresentative[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingClient, setSavingClient] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [position, setPosition] = useState<StaffPosition | "">("");
  const [clientQuery, setClientQuery] = useState("");
  const [clientTake, setClientTake] = useState<AccessPageSize>(10);
  const [clientSkip, setClientSkip] = useState(0);
  const [repTake, setRepTake] = useState<AccessPageSize>(10);
  const [repSkip, setRepSkip] = useState(0);
  const [revealedPasswords, setRevealedPasswords] = useState<
    Record<string, boolean>
  >({});
  const [pauseTarget, setPauseTarget] = useState<PauseTarget | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [nextRequests, nextRepresentatives] = await Promise.all([
        listClientAccessRequests(),
        listSalesRepresentatives(),
      ]);
      setRequests(nextRequests);
      setRepresentatives(nextRepresentatives);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load access management data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const filteredRequests = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    const matched = !q
      ? requests
      : requests.filter((request) => {
          const name = request.account.name.toLowerCase();
          const email = request.account.email.toLowerCase();
          return name.includes(q) || email.includes(q);
        });
    // Newest first.
    return [...matched].sort(
      (a, b) =>
        new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
    );
  }, [requests, clientQuery]);

  const sortedRepresentatives = useMemo(
    () =>
      [...representatives].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [representatives],
  );

  const clientTotal = filteredRequests.length;
  const clientPages = Math.max(1, Math.ceil(clientTotal / clientTake) || 1);
  const safeClientSkip = Math.min(
    clientSkip,
    Math.max(0, (clientPages - 1) * clientTake),
  );
  const pagedRequests = filteredRequests.slice(
    safeClientSkip,
    safeClientSkip + clientTake,
  );

  const repTotal = sortedRepresentatives.length;
  const repPages = Math.max(1, Math.ceil(repTotal / repTake) || 1);
  const safeRepSkip = Math.min(repSkip, Math.max(0, (repPages - 1) * repTake));
  const pagedRepresentatives = sortedRepresentatives.slice(
    safeRepSkip,
    safeRepSkip + repTake,
  );

  const decide = async (
    request: ClientAccessRequest,
    decision: "APPROVE" | "REJECT",
  ) => {
    setWorkingId(request.id);
    setError("");
    setNotice("");
    try {
      await decideClientAccessRequest(request.id, decision);
      setNotice(
        `${request.account.name}'s access request was ${decision.toLowerCase()}d.`,
      );
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not update the request.",
      );
    } finally {
      setWorkingId(null);
    }
  };

  const setClientAccess = async (
    request: ClientAccessRequest,
    action: "PAUSE" | "RESTORE",
  ) => {
    if (action === "PAUSE") {
      setPauseTarget({ kind: "client", request });
      return;
    }

    setWorkingId(request.id);
    setError("");
    setNotice("");
    try {
      await restoreClientAccess(request.account.id);
      setNotice(
        `${request.account.name}'s access has been restored. Previous sessions remain revoked.`,
      );
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not restore client access.",
      );
    } finally {
      setWorkingId(null);
    }
  };

  const confirmPauseAccess = async (reason: string) => {
    if (!pauseTarget) return;
    const working =
      pauseTarget.kind === "client"
        ? pauseTarget.request.id
        : pauseTarget.representative.id;
    const name =
      pauseTarget.kind === "client"
        ? pauseTarget.request.account.name
        : pauseTarget.representative.name;

    setWorkingId(working);
    setError("");
    setNotice("");
    try {
      if (pauseTarget.kind === "client") {
        await deactivateClientAccess(pauseTarget.request.account.id, reason);
        setNotice(
          `${name}'s access has been paused and active sessions revoked.`,
        );
      } else {
        await deactivateSalesRepresentative(
          pauseTarget.representative.id,
          reason,
        );
        setNotice(`${name}'s access has been paused.`);
      }
      setPauseTarget(null);
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : pauseTarget.kind === "client"
            ? "Could not pause client access."
            : "Could not pause the team member account.",
      );
    } finally {
      setWorkingId(null);
    }
  };

  const addClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const emailError = validateAccountEmail(email);
    if (emailError) {
      setNotice("");
      setError(emailError);
      return;
    }
    setSavingClient(true);
    setError("");
    setNotice("");
    try {
      const password = String(formData.get("password") ?? "");
      const client = await createClientAccount({
        name: String(formData.get("name") ?? ""),
        email,
        password,
      });
      form.reset();
      setNotice(
        `Client account created for ${client.name}. Password: ${client.adminSetPassword ?? password}`,
      );
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not create the client account.",
      );
    } finally {
      setSavingClient(false);
    }
  };

  const addRepresentative = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (!isStaffPosition(position)) {
      setNotice("");
      setError("Select a position for the team member.");
      return;
    }
    const email = String(formData.get("email") ?? "");
    const emailError = validateAccountEmail(email);
    if (emailError) {
      setNotice("");
      setError(emailError);
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await createSalesRepresentative({
        name: String(formData.get("name") ?? ""),
        email,
        password: String(formData.get("password") ?? ""),
        position,
      });
      form.reset();
      setPosition("");
      setNotice(`${STAFF_POSITION_LABELS[position]} account created.`);
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not create the team member account.",
      );
    } finally {
      setSaving(false);
    }
  };

  const pauseRepresentative = (representative: SalesRepresentative) => {
    setPauseTarget({ kind: "rep", representative });
  };

  const restoreRepresentative = async (representative: SalesRepresentative) => {
    setWorkingId(representative.id);
    setError("");
    setNotice("");
    try {
      await restoreSalesRepresentative(representative.id);
      setNotice(
        `${representative.name}'s access has been restored. Their previous sessions remain revoked.`,
      );
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not restore the team member's access.",
      );
    } finally {
      setWorkingId(null);
    }
  };

  const togglePasswordReveal = (accountId: string) => {
    setRevealedPasswords((current) => ({
      ...current,
      [accountId]: !current[accountId],
    }));
  };

  return (
    <div className="mx-auto mt-6 flex w-full max-w-[1500px] flex-col gap-6">
      {error ? <AdminAlert>{error}</AdminAlert> : null}
      {notice ? <AdminAlert tone="info">{notice}</AdminAlert> : null}

      <AdminCard
        title="Clients"
        description="Create client accounts and share their login credentials with them, review access requests, and manage access. Pausing access revokes the client's active sessions. Accounts are never deleted."
      >
        <div className="mb-6 grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto_minmax(200px,1.1fr)]">
          <form
            onSubmit={(event) => void addClient(event)}
            className="contents"
          >
            <label>
              <span className={adminLabelClass}>Client name</span>
              <input
                name="name"
                required
                maxLength={120}
                className={adminInputClass}
                autoComplete="off"
              />
            </label>
            <label>
              <span className={adminLabelClass}>Email</span>
              <input
                name="email"
                type="email"
                required
                maxLength={255}
                className={adminInputClass}
                autoComplete="off"
              />
            </label>
            <PasswordField name="password" />
            <button
              type="submit"
              disabled={savingClient}
              className={cn(adminPrimaryButtonClass, "rounded-lg self-end")}
            >
              <UserPlus className="mr-2 size-4" />
              {savingClient ? "Creating…" : "Create client"}
            </button>
          </form>
          <label className="flex h-[46px] min-w-0 items-center gap-2 rounded-lg border border-[#E8E4DC] bg-white px-3 text-[#8A8F98]">
            <Search className="size-4 shrink-0" />
            <input
              type="search"
              value={clientQuery}
              onChange={(event) => {
                setClientQuery(event.target.value);
                setClientSkip(0);
              }}
              placeholder="Search clients by name or email…"
              aria-label="Search clients"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#001528] outline-none placeholder:text-[#8A8F98]"
            />
          </label>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 text-[14px] text-admin-muted">
            <Loader2 className="size-4 animate-spin" />
            Loading requests…
          </p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-[14px] text-admin-muted">
            {requests.length === 0
              ? "There are no client accounts or access requests."
              : "No clients match your search."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E8E4DC] font-secondary text-[11px] tracking-[0.08em] text-[#5C5F66] uppercase">
                  <th className="px-3 py-3 whitespace-nowrap">Client</th>
                  <th className="px-3 py-3 whitespace-nowrap">Email</th>
                  <th className="px-3 py-3 whitespace-nowrap">Password</th>
                  <th className="px-3 py-3 whitespace-nowrap">Added</th>
                  <th className="px-3 py-3 whitespace-nowrap">Email status</th>
                  <th className="px-3 py-3 whitespace-nowrap">Access status</th>
                  <th className="px-3 py-3 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedRequests.map((request) => {
                  const password = request.account.adminSetPassword;
                  const revealed = Boolean(
                    revealedPasswords[request.account.id],
                  );
                  return (
                    <tr
                      key={request.id}
                      className="border-b border-[#E8E4DC] last:border-0"
                    >
                      <td className="px-3 py-4 font-semibold text-[#001528]">
                        {request.account.name}
                      </td>
                      <td className="px-3 py-4 text-[13px] text-[#5C5F66]">
                        {request.account.email}
                      </td>
                      <td className="px-3 py-4 text-[13px] text-[#5C5F66]">
                        {password ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="font-mono">
                              {revealed ? password : "••••••••"}
                            </span>
                            <button
                              type="button"
                              aria-label={
                                revealed ? "Hide password" : "Show password"
                              }
                              onClick={() =>
                                togglePasswordReveal(request.account.id)
                              }
                              className="rounded p-1 text-admin-muted hover:bg-admin-soft"
                            >
                              {revealed ? (
                                <EyeOff className="size-3.5" />
                              ) : (
                                <Eye className="size-3.5" />
                              )}
                            </button>
                          </span>
                        ) : (
                          <span className="text-admin-muted">—</span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-[13px] text-[#5C5F66]">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 text-[13px] whitespace-nowrap">
                        {request.account.emailVerifiedAt
                          ? "Verified"
                          : "Not verified"}
                      </td>
                      <td className="px-3 py-4 text-[13px]">
                        <span className="whitespace-nowrap">
                          {request.status === "PENDING"
                            ? "Pending"
                            : request.status === "REJECTED"
                              ? "Rejected"
                              : request.account.isActive
                                ? "Approved"
                                : "Paused"}
                        </span>
                        {!request.account.isActive &&
                        request.account.accessPauseReason ? (
                          <p
                            className="mt-1 max-w-[220px] truncate text-[11px] text-admin-muted"
                            title={request.account.accessPauseReason}
                          >
                            {request.account.accessPauseReason}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
                          {request.status === "PENDING" ? (
                            <>
                              <button
                                type="button"
                                disabled={
                                  workingId === request.id ||
                                  !request.account.emailVerifiedAt
                                }
                                onClick={() => void decide(request, "APPROVE")}
                                className="rounded-lg bg-[#1f6b33] px-3 py-1.5 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={workingId === request.id}
                                onClick={() => void decide(request, "REJECT")}
                                className="rounded-lg bg-[#8f2d2d] px-3 py-1.5 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Reject
                              </button>
                            </>
                          ) : request.status === "APPROVED" ? (
                            <>
                              <Link
                                href={`/engagement?clientId=${encodeURIComponent(request.account.id)}`}
                                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-admin-border-strong px-3 py-1.5 text-[11px] font-bold text-admin-navy hover:bg-admin-soft"
                              >
                                Dashboard
                                <ExternalLink className="size-3" />
                              </Link>
                              {request.account.isActive ? (
                                <button
                                  type="button"
                                  disabled={workingId === request.id}
                                  onClick={() =>
                                    void setClientAccess(request, "PAUSE")
                                  }
                                  className="shrink-0 rounded-lg border border-[#f3c9c9] px-3 py-1.5 text-[11px] font-bold text-[#8f2d2d] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Pause access
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={workingId === request.id}
                                  onClick={() =>
                                    void setClientAccess(request, "RESTORE")
                                  }
                                  className="shrink-0 rounded-lg border border-[#1f6b33]/30 px-3 py-1.5 text-[11px] font-bold text-[#1f6b33] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Restore access
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-[12px] text-admin-muted">
                              —
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredRequests.length > 0 ? (
              <AccessRowsPager
                total={filteredRequests.length}
                take={clientTake}
                skip={safeClientSkip}
                onTakeChange={setClientTake}
                onSkipChange={setClientSkip}
                rowsLabel="Client rows per page"
              />
            ) : null}
          </div>
        )}
      </AdminCard>

      <AdminCard
        title="Team members"
        description="Create Executive Account Development Specialist, Sales Performance Implementation Specialist, Fractional VP of Sales, Regional Sales Manager, and Office Manager accounts. Pause access with a comment, or restore a paused account. Accounts are never deleted."
      >
        <form
          onSubmit={(event) => void addRepresentative(event)}
          className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
        >
          <label>
            <span className={adminLabelClass}>Name</span>
            <input
              name="name"
              required
              maxLength={120}
              className={adminInputClass}
              autoComplete="name"
            />
          </label>
          <label>
            <span className={adminLabelClass}>Email</span>
            <input
              name="email"
              type="email"
              required
              maxLength={255}
              className={adminInputClass}
              autoComplete="email"
            />
          </label>
          <PasswordField name="password" />
          <div>
            <span className={adminLabelClass}>Position</span>
            <PositionDropdown value={position} onChange={setPosition} />
          </div>
          <button
            type="submit"
            disabled={saving}
            className={cn(adminPrimaryButtonClass, "rounded-lg self-end")}
          >
            <UserPlus className="mr-2 size-4" />
            {saving ? "Creating…" : "Add team member"}
          </button>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E8E4DC] font-secondary text-[11px] tracking-[0.08em] text-[#5C5F66] uppercase">
                <th className="px-3 py-3">Team member</th>
                <th className="px-3 py-3">Position</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Added</th>
                <th className="px-3 py-3">Access</th>
              </tr>
            </thead>
            <tbody>
              {pagedRepresentatives.map((representative) => (
                <tr
                  key={representative.id}
                  className="border-b border-[#E8E4DC] last:border-0"
                >
                  <td className="px-3 py-4 font-semibold text-[#001528]">
                    {representative.name}
                  </td>
                  <td className="px-3 py-4 text-[13px] text-[#001528]">
                    {representative.position
                      ? STAFF_POSITION_LABELS[representative.position]
                      : "—"}
                  </td>
                  <td className="px-3 py-4 text-[13px] text-[#5C5F66]">
                    {representative.email}
                  </td>
                  <td className="px-3 py-4 text-[13px] text-[#5C5F66]">
                    {new Date(representative.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4">
                    {representative.isActive ? (
                      <button
                        type="button"
                        disabled={workingId === representative.id}
                        onClick={() => pauseRepresentative(representative)}
                        className="rounded-lg border border-[#f3c9c9] px-3 py-1.5 text-[11px] font-bold text-[#8f2d2d] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Pause access
                      </button>
                    ) : (
                      <div className="space-y-1">
                        <button
                          type="button"
                          disabled={workingId === representative.id}
                          onClick={() =>
                            void restoreRepresentative(representative)
                          }
                          className="rounded-lg border border-[#1f6b33]/30 px-3 py-1.5 text-[11px] font-bold text-[#1f6b33] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Restore access
                        </button>
                        {representative.accessPauseReason ? (
                          <p
                            className="max-w-[220px] text-[11px] text-admin-muted"
                            title={representative.accessPauseReason}
                          >
                            {representative.accessPauseReason}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && sortedRepresentatives.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-5 text-[14px] text-admin-muted"
                  >
                    No team members have been added.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          {!loading && sortedRepresentatives.length > 0 ? (
            <AccessRowsPager
              total={sortedRepresentatives.length}
              take={repTake}
              skip={safeRepSkip}
              onTakeChange={setRepTake}
              onSkipChange={setRepSkip}
              rowsLabel="Team member rows per page"
            />
          ) : null}
        </div>
      </AdminCard>

      <PauseAccessDialog
        target={pauseTarget}
        submitting={
          pauseTarget !== null &&
          workingId ===
            (pauseTarget.kind === "client"
              ? pauseTarget.request.id
              : pauseTarget.representative.id)
        }
        onOpenChange={(open) => {
          if (!open) setPauseTarget(null);
        }}
        onConfirm={(reason) => void confirmPauseAccess(reason)}
      />
    </div>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Filter, Loader2 } from "lucide-react";

import {
  AdminAlert,
  AdminCard,
  adminLabelClass,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-ui";
import {
  createClientAssessmentInstance,
  getAdminAssessmentInstance,
  issueOnBehalfToken,
  listClientAssessmentInstances,
  type AdminAssessmentInstanceDetail,
  type AdminAssessmentInstanceSummary,
} from "@/lib/admin-assessment-results";
import { listPublishedAdminAssessments } from "@/lib/admin-assessments";
import type { AdminAssessment } from "@/config/admin-assessments";
import {
  listClientAccessRequests,
  type ClientAccessRequest,
} from "@/lib/auth-api";
import type { ClientSafeAssessmentResult } from "@/lib/client-assessment-api";
import { cn } from "@/lib/utils";

type ApprovedClient = {
  id: string;
  name: string;
  email: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatScore(value: number) {
  return value.toFixed(1);
}

function statusLabel(status: string) {
  if (status === "COMPLETED") return "Completed";
  if (status === "IN_PROGRESS") return "In progress";
  if (status === "PENDING") return "Pending";
  return status;
}

/** Same portal filter dropdown pattern as /dashboard overview findings. */
function ResultsFilterDropdown({
  id,
  label,
  value,
  options,
  emptyLabel,
  disabled = false,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  emptyLabel: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 220,
    maxHeight: 280,
  });
  const selected = options.find((option) => option.value === value) ?? null;
  const listboxId = `${id}-options`;

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const updateMenuPosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const bounds = trigger.getBoundingClientRect();
      const viewportPadding = 12;
      const menuWidth = Math.max(bounds.width, 220);
      const maxHeight = Math.min(280, window.innerHeight - viewportPadding * 2);
      const estimatedMenuHeight = Math.min(
        Math.max(options.length, 1) * 36 + 8,
        maxHeight,
      );
      const spaceBelow = window.innerHeight - bounds.bottom;
      const openAbove =
        spaceBelow < estimatedMenuHeight + 8 && bounds.top > spaceBelow;
      const left = Math.min(
        Math.max(viewportPadding, bounds.left),
        window.innerWidth - menuWidth - viewportPadding,
      );
      setMenuPosition({
        top: openAbove
          ? Math.max(viewportPadding, bounds.top - estimatedMenuHeight - 6)
          : bounds.bottom + 6,
        left,
        width: menuWidth,
        maxHeight,
      });
    };
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, options.length]);

  return (
    <div>
      <p className={adminLabelClass}>{label}</p>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={label}
          disabled={disabled || options.length === 0}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          className="flex h-10 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[12px] font-medium text-admin-text shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            <Filter className="size-3.5 shrink-0 text-admin-muted" />
            <span className="truncate">{selected?.label ?? emptyLabel}</span>
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 text-admin-muted transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        {open && typeof document !== "undefined"
          ? createPortal(
              <div
                ref={menuRef}
                id={listboxId}
                role="listbox"
                aria-label={label}
                style={{
                  position: "fixed",
                  top: menuPosition.top,
                  left: menuPosition.left,
                  width: menuPosition.width,
                  maxHeight: menuPosition.maxHeight,
                }}
                className="z-[100] overflow-y-auto rounded-lg border border-admin-border-strong bg-admin-surface p-1 shadow-lg"
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "block w-full cursor-pointer rounded-md px-3 py-2 text-left text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-admin-info",
                      option.value === value
                        ? "bg-admin-navy font-medium text-admin-surface"
                        : "text-admin-text-strong hover:bg-admin-soft",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>,
              document.body,
            )
          : null}
      </div>
    </div>
  );
}

export function AdminAssessmentResults() {
  const [clients, setClients] = useState<ApprovedClient[]>([]);
  const [clientId, setClientId] = useState("");
  const [publishedAssessments, setPublishedAssessments] = useState<
    AdminAssessment[]
  >([]);
  const [assessmentId, setAssessmentId] = useState("");
  const [instances, setInstances] = useState<AdminAssessmentInstanceSummary[]>(
    [],
  );
  const [detail, setDetail] = useState<AdminAssessmentInstanceDetail | null>(
    null,
  );
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [creating, setCreating] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [issuedLink, setIssuedLink] = useState("");

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === clientId) ?? null,
    [clients, clientId],
  );

  const selectedAssessment = useMemo(
    () => publishedAssessments.find((row) => row.id === assessmentId) ?? null,
    [assessmentId, publishedAssessments],
  );

  const loadClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const requests = await listClientAccessRequests();
      const approved = requests
        .filter(
          (request: ClientAccessRequest) =>
            request.status === "APPROVED" && request.account.isActive,
        )
        .map((request) => ({
          id: request.account.id,
          name: request.account.name,
          email: request.account.email,
        }));
      setClients(approved);
      setClientId((current) => current || approved[0]?.id || "");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load approved clients.",
      );
    } finally {
      setLoadingClients(false);
    }
  }, []);

  const loadPublishedAssessments = useCallback(async () => {
    setLoadingAssessments(true);
    try {
      const rows = await listPublishedAdminAssessments();
      setPublishedAssessments(rows);
      setAssessmentId((current) => {
        if (current && rows.some((row) => row.id === current)) return current;
        const primary = rows.find((row) => row.isClientPrimary);
        return primary?.id ?? rows[0]?.id ?? "";
      });
    } catch (cause) {
      setPublishedAssessments([]);
      setAssessmentId("");
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load published assessments.",
      );
    } finally {
      setLoadingAssessments(false);
    }
  }, []);

  const loadInstances = useCallback(async (id: string) => {
    if (!id) {
      setInstances([]);
      setDetail(null);
      return;
    }
    setLoadingList(true);
    setError("");
    try {
      const rows = await listClientAssessmentInstances(id);
      setInstances(rows);
      const preferred =
        rows.find((row) => row.status === "COMPLETED") ?? rows[0] ?? null;
      if (preferred) {
        setLoadingDetail(true);
        const next = await getAdminAssessmentInstance(preferred.id);
        setDetail(next);
      } else {
        setDetail(null);
      }
    } catch (cause) {
      setInstances([]);
      setDetail(null);
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load assessment instances.",
      );
    } finally {
      setLoadingList(false);
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadClients();
      void loadPublishedAssessments();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadClients, loadPublishedAssessments]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadInstances(clientId), 0);
    return () => window.clearTimeout(timer);
  }, [clientId, loadInstances]);

  const openInstance = async (instanceId: string) => {
    setLoadingDetail(true);
    setError("");
    setIssuedLink("");
    try {
      const next = await getAdminAssessmentInstance(instanceId);
      setDetail(next);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load assessment detail.",
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreate = async () => {
    if (!clientId || !assessmentId) return;
    setCreating(true);
    setError("");
    setNotice("");
    try {
      const created = await createClientAssessmentInstance(clientId, {
        assessmentId,
      });
      setNotice(
        selectedAssessment
          ? `Instance created for “${selectedAssessment.title}”.`
          : "Assessment instance created for this client.",
      );
      await loadInstances(clientId);
      await openInstance(created.id);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not create assessment instance.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleIssueLink = async () => {
    if (!detail || detail.status === "COMPLETED") return;
    setIssuing(true);
    setError("");
    setNotice("");
    try {
      const issued = await issueOnBehalfToken(detail.id);
      const absolute =
        typeof window !== "undefined"
          ? `${window.location.origin}${issued.path}`
          : issued.path;
      setIssuedLink(absolute);
      setNotice(
        `Zoom link issued. Expires ${formatDate(issued.expiresAt)}. Share only during the live meeting.`,
      );
      const refreshed = await getAdminAssessmentInstance(detail.id);
      setDetail(refreshed);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not issue Zoom completion link.",
      );
    } finally {
      setIssuing(false);
    }
  };

  const copyLink = async () => {
    if (!issuedLink) return;
    try {
      await navigator.clipboard.writeText(issuedLink);
      setNotice("Zoom completion link copied.");
    } catch {
      setNotice("Copy failed — select the link and copy manually.");
    }
  };

  if (loadingClients || loadingAssessments) {
    return (
      <div className="mx-auto mt-6 flex w-full max-w-[1500px] items-center gap-2 text-sm text-admin-muted">
        <Loader2 className="size-4 animate-spin" />
        Loading assessment results…
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-[1500px] space-y-6">
      {error ? <AdminAlert>{error}</AdminAlert> : null}
      {notice ? <AdminAlert tone="info">{notice}</AdminAlert> : null}

      <AdminCard
        title="Client assessment results"
        description="Review completed scores for an approved client, create a Zoom meeting instance, and issue a one-time on-behalf completion link for a representative."
      >
        <ResultsFilterDropdown
          id="results-client"
          label="Approved client"
          value={clientId}
          emptyLabel="No approved clients yet"
          options={clients.map((client) => ({
            value: client.id,
            label: `${client.name} · ${client.email}`,
          }))}
          onChange={(next) => {
            setClientId(next);
            setIssuedLink("");
            setNotice("");
          }}
        />
        {selectedClient ? (
          <p className="mt-3 text-sm text-admin-muted">
            Viewing assessments for{" "}
            <span className="font-semibold text-admin-text">
              {selectedClient.name}
            </span>
            .
          </p>
        ) : null}
      </AdminCard>

      {!clientId ? (
        <AdminAlert tone="info">
          Approve a client in Access Management first, then return here.
        </AdminAlert>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <AdminCard title="Instances">
            <ResultsFilterDropdown
              id="results-assessment"
              label="Assessment"
              value={assessmentId}
              emptyLabel="No published assessments"
              disabled={publishedAssessments.length === 0}
              options={publishedAssessments.map((assessment) => ({
                value: assessment.id,
                label: assessment.isClientPrimary
                  ? `${assessment.title} · Client facing`
                  : assessment.title,
              }))}
              onChange={setAssessmentId}
            />
            <div className="mt-4 mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={
                  creating || !assessmentId || publishedAssessments.length === 0
                }
                className={adminPrimaryButtonClass}
              >
                {creating ? "Creating…" : "Create instance"}
              </button>
            </div>

            {loadingList ? (
              <p className="flex items-center gap-2 text-sm text-admin-muted">
                <Loader2 className="size-4 animate-spin" />
                Loading…
              </p>
            ) : instances.length === 0 ? (
              <p className="text-sm text-admin-muted">
                No assessment instances yet. Choose an assessment above, create
                one for a Zoom meeting, or wait for the client to start from
                their dashboard.
              </p>
            ) : (
              <ul className="space-y-2">
                {instances.map((row) => {
                  const active = detail?.id === row.id;
                  return (
                    <li key={row.id}>
                      <button
                        type="button"
                        onClick={() => void openInstance(row.id)}
                        className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                          active
                            ? "border-[#b17411] bg-[#FFF8EC]"
                            : "border-[#E8E4DC] bg-white hover:bg-[#F7F5F0]"
                        }`}
                      >
                        <p className="text-sm font-semibold text-admin-text">
                          {row.assessment.title}
                        </p>
                        <p className="mt-1 text-xs text-admin-muted">
                          {statusLabel(row.status)} ·{" "}
                          {row.submittedAt
                            ? `Submitted ${formatDate(row.submittedAt)}`
                            : `Created ${formatDate(row.createdAt)}`}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </AdminCard>

          <div className="space-y-6">
            {loadingDetail ? (
              <AdminCard title="Detail">
                <p className="flex items-center gap-2 text-sm text-admin-muted">
                  <Loader2 className="size-4 animate-spin" />
                  Loading detail…
                </p>
              </AdminCard>
            ) : !detail ? (
              <AdminCard title="Detail">
                <p className="text-sm text-admin-muted">
                  Select or create an instance to view results and Zoom tools.
                </p>
              </AdminCard>
            ) : (
              <>
                <AdminCard title="Instance detail">
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-admin-muted">Client</dt>
                      <dd className="font-semibold text-admin-text">
                        {detail.client.name}
                      </dd>
                      <dd className="text-admin-muted">
                        {detail.client.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-admin-muted">Status</dt>
                      <dd className="font-semibold text-admin-text">
                        {statusLabel(detail.status)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-admin-muted">Assessment</dt>
                      <dd className="font-semibold text-admin-text">
                        {detail.assessment.title}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-admin-muted">Submitted</dt>
                      <dd className="font-semibold text-admin-text">
                        {formatDate(detail.submittedAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-admin-muted">Completed by</dt>
                      <dd className="font-semibold text-admin-text">
                        {detail.onBehalfOf
                          ? "Representative (on behalf)"
                          : detail.completedBy
                            ? "Client (self)"
                            : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-admin-muted">Active Zoom token</dt>
                      <dd className="font-semibold text-admin-text">
                        {detail.hasActiveOnBehalfToken
                          ? `Yes · expires ${formatDate(detail.tokenExpiresAt)}`
                          : "No"}
                      </dd>
                    </div>
                  </dl>

                  {detail.status !== "COMPLETED" ? (
                    <div className="mt-6 space-y-3">
                      <button
                        type="button"
                        onClick={() => void handleIssueLink()}
                        disabled={issuing}
                        className={adminPrimaryButtonClass}
                      >
                        {issuing ? "Issuing…" : "Issue Zoom on-behalf link"}
                      </button>
                      {issuedLink ? (
                        <div className="rounded-xl border border-[#E8E4DC] bg-[#F7F5F0] p-4">
                          <p className="text-xs font-bold tracking-[0.06em] text-admin-muted uppercase">
                            One-time completion URL
                          </p>
                          <p className="mt-2 break-all text-sm text-admin-text">
                            {issuedLink}
                          </p>
                          <button
                            type="button"
                            onClick={() => void copyLink()}
                            className="mt-3 text-sm font-semibold text-[#b17411] underline"
                          >
                            Copy link
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </AdminCard>

                {detail.status === "COMPLETED" && detail.result ? (
                  <ResultsPanel result={detail.result} />
                ) : (
                  <AdminCard title="Results">
                    <p className="text-sm text-admin-muted">
                      Results appear here after the client completes the
                      assessment or a representative submits via the Zoom link.
                    </p>
                  </AdminCard>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsPanel({ result }: { result: ClientSafeAssessmentResult }) {
  return (
    <AdminCard title="Completed results">
      <div className="rounded-xl border border-[#E8E4DC] bg-[#FFF8EC] px-5 py-5">
        <p className="text-xs font-bold tracking-[0.08em] text-admin-muted uppercase">
          Overall score
        </p>
        <p className="mt-2 font-heading text-4xl font-bold text-admin-text">
          {result.overallScore}
          <span className="text-base text-admin-muted">/100</span>
        </p>
        {result.resultText ? (
          <p className="mt-3 text-sm leading-6 text-admin-muted">
            {result.resultText}
          </p>
        ) : null}
      </div>

      <h3 className="mt-8 text-sm font-bold tracking-[0.06em] text-admin-text uppercase">
        Pillar scores
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {result.sectionBreakdowns.map((section) => (
          <article
            key={section.id}
            className="rounded-xl border border-[#E8E4DC] px-4 py-4"
          >
            <p className="text-xs text-admin-muted">
              {section.number} · {section.title}
            </p>
            <p className="mt-2 text-2xl font-bold text-admin-text">
              {formatScore(section.score)}
              <span className="text-sm text-admin-muted">/10</span>
            </p>
          </article>
        ))}
      </div>

      <h3 className="mt-8 text-sm font-bold tracking-[0.06em] text-admin-text uppercase">
        Closer review
      </h3>
      {result.allSame ? (
        <p className="mt-3 text-sm text-admin-muted">
          All scored responses were equal.
        </p>
      ) : result.review.length === 0 ? (
        <p className="mt-3 text-sm text-admin-muted">
          No items met the closer-review threshold.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {result.review.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-[#E8E4DC] px-4 py-3"
            >
              <p className="text-xs text-admin-muted">
                Q{item.number} · {item.sectionTitle} · {formatScore(item.score)}
                /10
              </p>
              <p className="mt-1 text-sm text-admin-text">{item.prompt}</p>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  );
}

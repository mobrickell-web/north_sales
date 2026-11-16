"use client";

import {
  FormEvent,
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
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";
import {
  createBaseline,
  createImprovement,
  createKpi,
  createMilestone,
  deleteBaseline,
  deleteImprovement,
  deleteKpi,
  deleteMilestone,
  deleteReport,
  listBaselines,
  listImprovements,
  listKpis,
  listMilestones,
  listReports,
  publishReport,
  updateImprovement,
  updateMilestone,
  uploadReport,
  type AdminBaseline,
  type AdminImprovement,
  type AdminKpi,
  type AdminMilestone,
  type AdminReport,
} from "@/lib/admin-engagement";
import {
  listClientAccessRequests,
  type ClientAccessRequest,
} from "@/lib/auth-api";

type TabKey = "baselines" | "improvements" | "kpis" | "milestones" | "reports";

type ApprovedClient = {
  id: string;
  name: string;
  email: string;
};

type UndoState =
  | { kind: "baseline"; clientId: string; row: AdminBaseline }
  | { kind: "improvement"; clientId: string; row: AdminImprovement }
  | { kind: "kpi"; clientId: string; row: AdminKpi }
  | { kind: "milestone"; clientId: string; row: AdminMilestone }
  | null;

const TABS: { key: TabKey; label: string }[] = [
  { key: "baselines", label: "Baselines" },
  { key: "improvements", label: "Improvements" },
  { key: "kpis", label: "KPIs" },
  { key: "milestones", label: "Schedule" },
  { key: "reports", label: "Reports" },
];

function toIsoDate(value: string) {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/** Same portal filter dropdown pattern as /dashboard overview findings. */
function ClientFilterDropdown({
  label,
  value,
  options,
  emptyLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  emptyLabel: string;
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
          aria-controls="engagement-client-options"
          aria-label={label}
          disabled={options.length === 0}
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
                id="engagement-client-options"
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

export function AdminClientEngagement() {
  const [clients, setClients] = useState<ApprovedClient[]>([]);
  const [clientId, setClientId] = useState("");
  const [tab, setTab] = useState<TabKey>("baselines");
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [undo, setUndo] = useState<UndoState>(null);

  const [baselines, setBaselines] = useState<AdminBaseline[]>([]);
  const [improvements, setImprovements] = useState<AdminImprovement[]>([]);
  const [kpis, setKpis] = useState<AdminKpi[]>([]);
  const [milestones, setMilestones] = useState<AdminMilestone[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === clientId) ?? null,
    [clients, clientId],
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
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setClients(approved);
      setClientId((current) => current || approved[0]?.id || "");
      setError("");
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

  const loadEngagement = useCallback(async (id: string) => {
    if (!id) return;
    setLoadingData(true);
    setError("");
    try {
      const [
        nextBaselines,
        nextImprovements,
        nextKpis,
        nextMilestones,
        nextReports,
      ] = await Promise.all([
        listBaselines(id),
        listImprovements(id),
        listKpis(id),
        listMilestones(id),
        listReports(id),
      ]);
      setBaselines(nextBaselines);
      setImprovements(nextImprovements);
      setKpis(nextKpis);
      setMilestones(nextMilestones);
      setReports(nextReports);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load engagement data for this client.",
      );
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadClients(), 0);
    return () => window.clearTimeout(timer);
  }, [loadClients]);

  useEffect(() => {
    if (!clientId) return;
    const timer = window.setTimeout(() => void loadEngagement(clientId), 0);
    return () => window.clearTimeout(timer);
  }, [clientId, loadEngagement]);

  useEffect(() => {
    if (!undo) return;
    const timer = window.setTimeout(() => setUndo(null), 8000);
    return () => window.clearTimeout(timer);
  }, [undo]);

  const flash = (message: string) => {
    setNotice(message);
    setError("");
  };

  const handleUndo = async () => {
    if (!undo) return;
    const current = undo;
    setUndo(null);
    try {
      if (current.kind === "baseline") {
        const created = await createBaseline(current.clientId, {
          metricKey: current.row.metricKey,
          label: current.row.label,
          value: current.row.value,
          unit: current.row.unit ?? undefined,
          measuredAt: current.row.measuredAt,
          source: current.row.source ?? undefined,
        });
        setBaselines((rows) => [created, ...rows]);
      } else if (current.kind === "improvement") {
        const created = await createImprovement(current.clientId, {
          title: current.row.title,
          description: current.row.description ?? undefined,
          ownerName: current.row.ownerName ?? undefined,
          ownerSide: current.row.ownerSide ?? undefined,
          status: current.row.status,
          targetDate: current.row.targetDate ?? undefined,
          agreedAt: current.row.agreedAt ?? undefined,
        });
        setImprovements((rows) => [created, ...rows]);
      } else if (current.kind === "kpi") {
        const created = await createKpi(current.clientId, {
          metricKey: current.row.metricKey,
          value: current.row.value,
          target: current.row.target ?? undefined,
          measuredAt: current.row.measuredAt,
        });
        setKpis((rows) => [created, ...rows]);
      } else if (current.kind === "milestone") {
        const created = await createMilestone(current.clientId, {
          title: current.row.title,
          startDate: current.row.startDate ?? undefined,
          dueDate: current.row.dueDate ?? undefined,
          ownerName: current.row.ownerName ?? undefined,
          ownerSide: current.row.ownerSide ?? undefined,
          status: current.row.status,
        });
        setMilestones((rows) => [...rows, created]);
      }
      flash("Deletion undone.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not undo that delete.",
      );
    }
  };

  if (loadingClients) {
    return (
      <div className="mt-8 flex items-center gap-2 text-sm text-admin-muted">
        <Loader2 className="size-4 animate-spin" />
        Loading clients…
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-[1500px] space-y-6">
      {error ? <AdminAlert>{error}</AdminAlert> : null}
      {notice ? <AdminAlert tone="info">{notice}</AdminAlert> : null}
      {undo ? (
        <AdminAlert tone="info">
          Item deleted.{" "}
          <button
            type="button"
            onClick={() => void handleUndo()}
            className="font-bold underline"
          >
            Undo
          </button>
        </AdminAlert>
      ) : null}

      <AdminCard
        title="Client engagement data"
        description="Enter baselines, improvements, KPIs, schedule, and reports for one approved client. Only that client will see the published data on their dashboard."
      >
        <ClientFilterDropdown
          label="Approved client"
          value={clientId}
          emptyLabel="No approved clients yet"
          options={clients.map((client) => ({
            value: client.id,
            label: `${client.name} · ${client.email}`,
          }))}
          onChange={(next) => {
            setClientId(next);
            setNotice("");
            setUndo(null);
          }}
        />
        {selectedClient ? (
          <p className="mt-3 text-sm text-admin-muted">
            Editing engagement data for{" "}
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
        <>
          <div className="flex flex-wrap gap-2">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`min-h-10 rounded-full px-4 text-[12px] font-bold tracking-[0.06em] uppercase ${
                  tab === item.key
                    ? "bg-[#b17411] text-white"
                    : "border border-[#E8E4DC] bg-white text-[#001528]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loadingData ? (
            <div className="flex items-center gap-2 text-sm text-admin-muted">
              <Loader2 className="size-4 animate-spin" />
              Loading engagement data…
            </div>
          ) : null}

          {!loadingData && tab === "baselines" ? (
            <BaselinesPanel
              clientId={clientId}
              rows={baselines}
              onChange={setBaselines}
              onNotice={flash}
              onError={setError}
              onDeleted={(row) => setUndo({ kind: "baseline", clientId, row })}
            />
          ) : null}

          {!loadingData && tab === "improvements" ? (
            <ImprovementsPanel
              clientId={clientId}
              rows={improvements}
              onChange={setImprovements}
              onNotice={flash}
              onError={setError}
              onDeleted={(row) =>
                setUndo({ kind: "improvement", clientId, row })
              }
            />
          ) : null}

          {!loadingData && tab === "kpis" ? (
            <KpisPanel
              clientId={clientId}
              rows={kpis}
              onChange={setKpis}
              onNotice={flash}
              onError={setError}
              onDeleted={(row) => setUndo({ kind: "kpi", clientId, row })}
            />
          ) : null}

          {!loadingData && tab === "milestones" ? (
            <MilestonesPanel
              clientId={clientId}
              rows={milestones}
              onChange={setMilestones}
              onNotice={flash}
              onError={setError}
              onDeleted={(row) => setUndo({ kind: "milestone", clientId, row })}
            />
          ) : null}

          {!loadingData && tab === "reports" ? (
            <ReportsPanel
              clientId={clientId}
              rows={reports}
              onChange={setReports}
              onNotice={flash}
              onError={setError}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

function BaselinesPanel({
  clientId,
  rows,
  onChange,
  onNotice,
  onError,
  onDeleted,
}: {
  clientId: string;
  rows: AdminBaseline[];
  onChange: (rows: AdminBaseline[]) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
  onDeleted: (row: AdminBaseline) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    metricKey: "",
    label: "",
    value: "",
    unit: "",
    measuredAt: "",
    source: "",
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    onError("");
    try {
      const created = await createBaseline(clientId, {
        metricKey: form.metricKey.trim(),
        label: form.label.trim(),
        value: Number(form.value),
        unit: form.unit.trim() || undefined,
        measuredAt: toIsoDate(form.measuredAt)!,
        source: form.source.trim() || undefined,
      });
      onChange([created, ...rows]);
      setForm({
        metricKey: "",
        label: "",
        value: "",
        unit: "",
        measuredAt: "",
        source: "",
      });
      onNotice("Baseline saved.");
    } catch (cause) {
      onError(
        cause instanceof Error ? cause.message : "Could not save baseline.",
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: AdminBaseline) => {
    if (!window.confirm(`Delete baseline “${row.label}”?`)) return;
    const previous = rows;
    onChange(rows.filter((item) => item.id !== row.id));
    onDeleted(row);
    try {
      await deleteBaseline(clientId, row.id);
      onNotice("Baseline deleted.");
    } catch (cause) {
      onChange(previous);
      onError(
        cause instanceof Error ? cause.message : "Could not delete baseline.",
      );
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <AdminCard title="Add baseline">
        <form className="space-y-3" onSubmit={(event) => void submit(event)}>
          <Field
            label="Metric key"
            value={form.metricKey}
            onChange={(value) => setForm((f) => ({ ...f, metricKey: value }))}
            required
            placeholder="win_rate"
          />
          <Field
            label="Label"
            value={form.label}
            onChange={(value) => setForm((f) => ({ ...f, label: value }))}
            required
          />
          <Field
            label="Value"
            type="number"
            value={form.value}
            onChange={(value) => setForm((f) => ({ ...f, value }))}
            required
          />
          <Field
            label="Unit"
            value={form.unit}
            onChange={(value) => setForm((f) => ({ ...f, unit: value }))}
            placeholder="%"
          />
          <Field
            label="Measured at"
            type="date"
            value={form.measuredAt}
            onChange={(value) => setForm((f) => ({ ...f, measuredAt: value }))}
            required
          />
          <Field
            label="Source"
            value={form.source}
            onChange={(value) => setForm((f) => ({ ...f, source: value }))}
          />
          <button
            type="submit"
            disabled={saving}
            className={adminPrimaryButtonClass}
          >
            {saving ? "Saving…" : "Save baseline"}
          </button>
        </form>
      </AdminCard>

      <AdminCard title="Baselines" description={`${rows.length} records`}>
        {rows.length === 0 ? (
          <p className="text-sm text-admin-muted">No baselines yet.</p>
        ) : (
          <ul className="divide-y divide-[#E8E4DC]">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-admin-text">{row.label}</p>
                  <p className="text-sm text-admin-muted">
                    {row.value}
                    {row.unit ? ` ${row.unit}` : ""} ·{" "}
                    {formatDate(row.measuredAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void remove(row)}
                  className="text-sm font-semibold text-[#8f2d2d]"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}

function ImprovementsPanel({
  clientId,
  rows,
  onChange,
  onNotice,
  onError,
  onDeleted,
}: {
  clientId: string;
  rows: AdminImprovement[];
  onChange: (rows: AdminImprovement[]) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
  onDeleted: (row: AdminImprovement) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    ownerName: "",
    ownerSide: "NPSG",
    status: "AGREED" as AdminImprovement["status"],
    targetDate: "",
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    onError("");
    try {
      const created = await createImprovement(clientId, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        ownerName: form.ownerName.trim() || undefined,
        ownerSide: form.ownerSide || undefined,
        status: form.status,
        targetDate: toIsoDate(form.targetDate),
      });
      onChange([created, ...rows]);
      setForm({
        title: "",
        description: "",
        ownerName: "",
        ownerSide: "NPSG",
        status: "AGREED",
        targetDate: "",
      });
      onNotice("Improvement saved.");
    } catch (cause) {
      onError(
        cause instanceof Error ? cause.message : "Could not save improvement.",
      );
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (
    row: AdminImprovement,
    status: AdminImprovement["status"],
  ) => {
    const previous = rows;
    onChange(
      rows.map((item) => (item.id === row.id ? { ...item, status } : item)),
    );
    try {
      const updated = await updateImprovement(clientId, row.id, { status });
      onChange(previous.map((item) => (item.id === row.id ? updated : item)));
      onNotice("Improvement status updated.");
    } catch (cause) {
      onChange(previous);
      onError(
        cause instanceof Error
          ? cause.message
          : "Could not update improvement.",
      );
    }
  };

  const remove = async (row: AdminImprovement) => {
    if (!window.confirm(`Delete improvement “${row.title}”?`)) return;
    const previous = rows;
    onChange(rows.filter((item) => item.id !== row.id));
    onDeleted(row);
    try {
      await deleteImprovement(clientId, row.id);
      onNotice("Improvement deleted.");
    } catch (cause) {
      onChange(previous);
      onError(
        cause instanceof Error
          ? cause.message
          : "Could not delete improvement.",
      );
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <AdminCard title="Add improvement">
        <form className="space-y-3" onSubmit={(event) => void submit(event)}>
          <Field
            label="Title"
            value={form.title}
            onChange={(value) => setForm((f) => ({ ...f, title: value }))}
            required
          />
          <TextArea
            label="Description"
            value={form.description}
            onChange={(value) => setForm((f) => ({ ...f, description: value }))}
          />
          <Field
            label="Owner name"
            value={form.ownerName}
            onChange={(value) => setForm((f) => ({ ...f, ownerName: value }))}
          />
          <SelectField
            label="Owner side"
            value={form.ownerSide}
            onChange={(value) => setForm((f) => ({ ...f, ownerSide: value }))}
            options={[
              { value: "NPSG", label: "NPSG" },
              { value: "CLIENT", label: "Client" },
            ]}
          />
          <SelectField
            label="Status"
            value={form.status}
            onChange={(value) =>
              setForm((f) => ({
                ...f,
                status: value as AdminImprovement["status"],
              }))
            }
            options={[
              { value: "AGREED", label: "Agreed" },
              { value: "IN_PROGRESS", label: "In progress" },
              { value: "DONE", label: "Done" },
            ]}
          />
          <Field
            label="Target date"
            type="date"
            value={form.targetDate}
            onChange={(value) => setForm((f) => ({ ...f, targetDate: value }))}
          />
          <button
            type="submit"
            disabled={saving}
            className={adminPrimaryButtonClass}
          >
            {saving ? "Saving…" : "Save improvement"}
          </button>
        </form>
      </AdminCard>

      <AdminCard title="Improvements" description={`${rows.length} records`}>
        {rows.length === 0 ? (
          <p className="text-sm text-admin-muted">No improvements yet.</p>
        ) : (
          <ul className="divide-y divide-[#E8E4DC]">
            {rows.map((row) => (
              <li key={row.id} className="space-y-2 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-admin-text">{row.title}</p>
                    {row.description ? (
                      <p className="mt-1 text-sm text-admin-muted">
                        {row.description}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void remove(row)}
                    className="text-sm font-semibold text-[#8f2d2d]"
                  >
                    Delete
                  </button>
                </div>
                <SelectField
                  label="Status"
                  value={row.status}
                  onChange={(value) =>
                    void setStatus(row, value as AdminImprovement["status"])
                  }
                  options={[
                    { value: "AGREED", label: "Agreed" },
                    { value: "IN_PROGRESS", label: "In progress" },
                    { value: "DONE", label: "Done" },
                  ]}
                />
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}

function KpisPanel({
  clientId,
  rows,
  onChange,
  onNotice,
  onError,
  onDeleted,
}: {
  clientId: string;
  rows: AdminKpi[];
  onChange: (rows: AdminKpi[]) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
  onDeleted: (row: AdminKpi) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    metricKey: "",
    value: "",
    target: "",
    measuredAt: "",
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    onError("");
    try {
      const created = await createKpi(clientId, {
        metricKey: form.metricKey.trim(),
        value: Number(form.value),
        target: form.target ? Number(form.target) : undefined,
        measuredAt: toIsoDate(form.measuredAt)!,
      });
      onChange([created, ...rows]);
      setForm({ metricKey: "", value: "", target: "", measuredAt: "" });
      onNotice("KPI saved.");
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Could not save KPI.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: AdminKpi) => {
    if (!window.confirm(`Delete KPI “${row.metricKey}”?`)) return;
    const previous = rows;
    onChange(rows.filter((item) => item.id !== row.id));
    onDeleted(row);
    try {
      await deleteKpi(clientId, row.id);
      onNotice("KPI deleted.");
    } catch (cause) {
      onChange(previous);
      onError(cause instanceof Error ? cause.message : "Could not delete KPI.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <AdminCard title="Add KPI">
        <form className="space-y-3" onSubmit={(event) => void submit(event)}>
          <Field
            label="Metric key"
            value={form.metricKey}
            onChange={(value) => setForm((f) => ({ ...f, metricKey: value }))}
            required
          />
          <Field
            label="Value"
            type="number"
            value={form.value}
            onChange={(value) => setForm((f) => ({ ...f, value }))}
            required
          />
          <Field
            label="Target"
            type="number"
            value={form.target}
            onChange={(value) => setForm((f) => ({ ...f, target: value }))}
          />
          <Field
            label="Measured at"
            type="date"
            value={form.measuredAt}
            onChange={(value) => setForm((f) => ({ ...f, measuredAt: value }))}
            required
          />
          <button
            type="submit"
            disabled={saving}
            className={adminPrimaryButtonClass}
          >
            {saving ? "Saving…" : "Save KPI"}
          </button>
        </form>
      </AdminCard>

      <AdminCard
        title="KPI measurements"
        description={`${rows.length} records`}
      >
        {rows.length === 0 ? (
          <p className="text-sm text-admin-muted">No KPI measurements yet.</p>
        ) : (
          <ul className="divide-y divide-[#E8E4DC]">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-admin-text">
                    {row.metricKey}
                  </p>
                  <p className="text-sm text-admin-muted">
                    {row.value}
                    {row.target !== null
                      ? ` / target ${row.target}`
                      : ""} · {formatDate(row.measuredAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void remove(row)}
                  className="text-sm font-semibold text-[#8f2d2d]"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}

function MilestonesPanel({
  clientId,
  rows,
  onChange,
  onNotice,
  onError,
  onDeleted,
}: {
  clientId: string;
  rows: AdminMilestone[];
  onChange: (rows: AdminMilestone[]) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
  onDeleted: (row: AdminMilestone) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    dueDate: "",
    ownerName: "",
    ownerSide: "NPSG",
    status: "PLANNED" as AdminMilestone["status"],
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    onError("");
    try {
      const created = await createMilestone(clientId, {
        title: form.title.trim(),
        startDate: toIsoDate(form.startDate),
        dueDate: toIsoDate(form.dueDate),
        ownerName: form.ownerName.trim() || undefined,
        ownerSide: form.ownerSide || undefined,
        status: form.status,
      });
      onChange([...rows, created]);
      setForm({
        title: "",
        startDate: "",
        dueDate: "",
        ownerName: "",
        ownerSide: "NPSG",
        status: "PLANNED",
      });
      onNotice("Milestone saved.");
    } catch (cause) {
      onError(
        cause instanceof Error ? cause.message : "Could not save milestone.",
      );
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (
    row: AdminMilestone,
    status: AdminMilestone["status"],
  ) => {
    const previous = rows;
    onChange(
      rows.map((item) => (item.id === row.id ? { ...item, status } : item)),
    );
    try {
      const updated = await updateMilestone(clientId, row.id, { status });
      onChange(previous.map((item) => (item.id === row.id ? updated : item)));
      onNotice("Milestone status updated.");
    } catch (cause) {
      onChange(previous);
      onError(
        cause instanceof Error ? cause.message : "Could not update milestone.",
      );
    }
  };

  const remove = async (row: AdminMilestone) => {
    if (!window.confirm(`Delete milestone “${row.title}”?`)) return;
    const previous = rows;
    onChange(rows.filter((item) => item.id !== row.id));
    onDeleted(row);
    try {
      await deleteMilestone(clientId, row.id);
      onNotice("Milestone deleted.");
    } catch (cause) {
      onChange(previous);
      onError(
        cause instanceof Error ? cause.message : "Could not delete milestone.",
      );
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <AdminCard title="Add milestone">
        <form className="space-y-3" onSubmit={(event) => void submit(event)}>
          <Field
            label="Title"
            value={form.title}
            onChange={(value) => setForm((f) => ({ ...f, title: value }))}
            required
          />
          <Field
            label="Start date"
            type="date"
            value={form.startDate}
            onChange={(value) => setForm((f) => ({ ...f, startDate: value }))}
          />
          <Field
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={(value) => setForm((f) => ({ ...f, dueDate: value }))}
          />
          <Field
            label="Owner name"
            value={form.ownerName}
            onChange={(value) => setForm((f) => ({ ...f, ownerName: value }))}
          />
          <SelectField
            label="Owner side"
            value={form.ownerSide}
            onChange={(value) => setForm((f) => ({ ...f, ownerSide: value }))}
            options={[
              { value: "NPSG", label: "NPSG" },
              { value: "CLIENT", label: "Client" },
            ]}
          />
          <SelectField
            label="Status"
            value={form.status}
            onChange={(value) =>
              setForm((f) => ({
                ...f,
                status: value as AdminMilestone["status"],
              }))
            }
            options={[
              { value: "PLANNED", label: "Planned" },
              { value: "IN_PROGRESS", label: "In progress" },
              { value: "COMPLETED", label: "Completed" },
            ]}
          />
          <button
            type="submit"
            disabled={saving}
            className={adminPrimaryButtonClass}
          >
            {saving ? "Saving…" : "Save milestone"}
          </button>
        </form>
      </AdminCard>

      <AdminCard title="Schedule" description={`${rows.length} records`}>
        {rows.length === 0 ? (
          <p className="text-sm text-admin-muted">No milestones yet.</p>
        ) : (
          <ul className="divide-y divide-[#E8E4DC]">
            {rows.map((row) => (
              <li key={row.id} className="space-y-2 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-admin-text">{row.title}</p>
                    <p className="text-sm text-admin-muted">
                      {formatDate(row.startDate)} → {formatDate(row.dueDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void remove(row)}
                    className="text-sm font-semibold text-[#8f2d2d]"
                  >
                    Delete
                  </button>
                </div>
                <SelectField
                  label="Status"
                  value={row.status}
                  onChange={(value) =>
                    void setStatus(row, value as AdminMilestone["status"])
                  }
                  options={[
                    { value: "PLANNED", label: "Planned" },
                    { value: "IN_PROGRESS", label: "In progress" },
                    { value: "COMPLETED", label: "Completed" },
                  ]}
                />
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}

function ReportsPanel({
  clientId,
  rows,
  onChange,
  onNotice,
  onError,
}: {
  clientId: string;
  rows: AdminReport[];
  onChange: (rows: AdminReport[]) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    type: "QUARTERLY" as AdminReport["type"],
    period: "",
    summary: "",
    file: null as File | null,
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.file) {
      onError("Choose a client-edition report file to upload.");
      return;
    }
    setSaving(true);
    onError("");
    try {
      const created = await uploadReport(clientId, {
        title: form.title.trim(),
        type: form.type,
        period: form.period.trim(),
        summary: form.summary.trim() || undefined,
        file: form.file,
      });
      onChange([created, ...rows]);
      setForm({
        title: "",
        type: "QUARTERLY",
        period: "",
        summary: "",
        file: null,
      });
      onNotice(
        "Report uploaded as draft. Publish it to show on the client dashboard.",
      );
    } catch (cause) {
      onError(
        cause instanceof Error ? cause.message : "Could not upload report.",
      );
    } finally {
      setSaving(false);
    }
  };

  const publish = async (row: AdminReport) => {
    setWorkingId(row.id);
    onError("");
    try {
      const updated = await publishReport(row.id);
      onChange(rows.map((item) => (item.id === row.id ? updated : item)));
      onNotice("Report published to the client dashboard.");
    } catch (cause) {
      onError(
        cause instanceof Error ? cause.message : "Could not publish report.",
      );
    } finally {
      setWorkingId(null);
    }
  };

  const remove = async (row: AdminReport) => {
    if (!window.confirm(`Delete report “${row.title}”?`)) return;
    const previous = rows;
    onChange(rows.filter((item) => item.id !== row.id));
    try {
      await deleteReport(clientId, row.id);
      onNotice("Report deleted.");
    } catch (cause) {
      onChange(previous);
      onError(
        cause instanceof Error ? cause.message : "Could not delete report.",
      );
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <AdminCard title="Upload report">
        <form className="space-y-3" onSubmit={(event) => void submit(event)}>
          <Field
            label="Title"
            value={form.title}
            onChange={(value) => setForm((f) => ({ ...f, title: value }))}
            required
          />
          <SelectField
            label="Type"
            value={form.type}
            onChange={(value) =>
              setForm((f) => ({ ...f, type: value as AdminReport["type"] }))
            }
            options={[
              { value: "QUARTERLY", label: "Quarterly" },
              { value: "FINAL", label: "Final" },
              { value: "OTHER", label: "Other" },
            ]}
          />
          <Field
            label="Period"
            value={form.period}
            onChange={(value) => setForm((f) => ({ ...f, period: value }))}
            required
            placeholder="2026-Q1"
          />
          <TextArea
            label="Summary"
            value={form.summary}
            onChange={(value) => setForm((f) => ({ ...f, summary: value }))}
          />
          <div>
            <label className={adminLabelClass} htmlFor="report-file">
              Client-edition file
            </label>
            <input
              id="report-file"
              type="file"
              className={adminInputClass}
              onChange={(event) =>
                setForm((f) => ({
                  ...f,
                  file: event.target.files?.[0] ?? null,
                }))
              }
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className={adminPrimaryButtonClass}
          >
            {saving ? "Uploading…" : "Upload draft"}
          </button>
        </form>
      </AdminCard>

      <AdminCard title="Reports" description={`${rows.length} records`}>
        {rows.length === 0 ? (
          <p className="text-sm text-admin-muted">No reports yet.</p>
        ) : (
          <ul className="divide-y divide-[#E8E4DC]">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-3 py-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-admin-text">{row.title}</p>
                  <p className="text-sm text-admin-muted">
                    {row.type} · {row.period} ·{" "}
                    {row.publishedAt
                      ? `Published ${formatDate(row.publishedAt)}`
                      : "Draft"}
                  </p>
                  {row.originalFileName ? (
                    <p className="mt-1 text-xs text-admin-muted">
                      {row.originalFileName}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  {!row.publishedAt ? (
                    <button
                      type="button"
                      disabled={workingId === row.id}
                      onClick={() => void publish(row)}
                      className="text-sm font-semibold text-[#b17411]"
                    >
                      {workingId === row.id ? "Publishing…" : "Publish"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void remove(row)}
                    className="text-sm font-semibold text-[#8f2d2d]"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label className={adminLabelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={adminInputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label className={adminLabelClass} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={`${adminInputClass} min-h-24`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label className={adminLabelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={adminInputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

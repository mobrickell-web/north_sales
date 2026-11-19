"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";

import { AdminAlert } from "@/components/admin/admin-ui";
import { DashboardShell } from "@/components/client/dashboard-shell";
import {
  DashboardCard,
  LocalDate,
  ScoreBar,
} from "@/components/client/dashboard-ui";
import type {
  ClientBaseline,
  ClientDashboardAssessmentHistoryItem,
  ClientDashboardData,
  ClientImprovement,
  ClientKpi,
  ClientMilestone,
  ClientReport,
} from "@/lib/client-dashboard";
import { downloadClientReport } from "@/lib/client-report-api";

const SCORE_MAX = 100;

function resultsHref(instanceId: string) {
  return `/dashboard/results/${encodeURIComponent(instanceId)}`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatNumber(value: number, unit?: string | null): string {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

function statusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-admin-border bg-admin-soft/40 px-4 py-6 text-center text-[14px] text-admin-muted">
      {message}
    </p>
  );
}

function isCompleted(
  item: Pick<ClientDashboardAssessmentHistoryItem, "status" | "overallScore">,
) {
  return item.status === "COMPLETED" && item.overallScore != null;
}

function groupLatestKpis(rows: ClientKpi[]) {
  const byKey = new Map<string, ClientKpi[]>();
  for (const row of rows) {
    const list = byKey.get(row.metricKey) ?? [];
    list.push(row);
    byKey.set(row.metricKey, list);
  }

  return [...byKey.entries()].map(([metricKey, list]) => {
    const sorted = [...list].sort(
      (a, b) =>
        new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime(),
    );
    const latest = sorted[0];
    const previous = sorted[1];
    const delta = previous && latest ? latest.value - previous.value : null;
    return { metricKey, latest, previous, delta };
  });
}

function BaselinesTable({ rows }: { rows: ClientBaseline[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState message="No baseline measurements have been published for your account yet." />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[13px]">
        <thead className="text-[11px] font-semibold tracking-[0.08em] text-admin-muted uppercase">
          <tr className="border-b border-admin-border-subtle">
            <th className="px-1 py-2 font-semibold">Metric</th>
            <th className="px-1 py-2 font-semibold">Value</th>
            <th className="px-1 py-2 font-semibold">Measured</th>
            <th className="px-1 py-2 font-semibold">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-admin-border-subtle text-admin-assessment-text last:border-0"
            >
              <td className="px-1 py-3">{row.label}</td>
              <td className="px-1 py-3">{formatNumber(row.value, row.unit)}</td>
              <td className="px-1 py-3">{formatDate(row.measuredAt)}</td>
              <td className="px-1 py-3 text-admin-muted">
                {row.source ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ImprovementsList({ rows }: { rows: ClientImprovement[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState message="No agreed improvements have been published for your account yet." />
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-admin-border-subtle">
      {rows.map((row) => (
        <li
          key={row.id}
          className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-admin-assessment-text">
              {row.title}
            </p>
            {row.description ? (
              <p className="mt-1 text-[13px] leading-relaxed text-admin-muted">
                {row.description}
              </p>
            ) : null}
            <p className="mt-2 text-[12px] text-admin-muted">
              Owner:{" "}
              {[row.ownerName, row.ownerSide].filter(Boolean).join(" · ") ||
                "—"}
              {row.targetDate ? ` · Target ${formatDate(row.targetDate)}` : ""}
            </p>
          </div>
          <span className="shrink-0 text-[11px] font-semibold tracking-[0.08em] text-admin-gold-deep uppercase">
            {statusLabel(row.status)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function KpiPanel({ rows }: { rows: ClientKpi[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState message="No KPI measurements have been published for your account yet." />
    );
  }

  const groups = groupLatestKpis(rows);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map(({ metricKey, latest, previous, delta }) => (
        <article
          key={metricKey}
          className="rounded-xl border border-admin-border bg-admin-soft/30 px-4 py-4"
        >
          <p className="text-[11px] font-semibold tracking-[0.1em] text-admin-muted uppercase">
            {metricKey.replace(/_/g, " ")}
          </p>
          <p className="mt-3 text-[28px] leading-none font-bold text-admin-navy">
            {formatNumber(latest.value)}
          </p>
          <p className="mt-2 text-[12px] text-admin-muted">
            Measured {formatDate(latest.measuredAt)}
            {latest.target !== null
              ? ` · Target ${formatNumber(latest.target)}`
              : ""}
          </p>
          {delta !== null ? (
            <p
              className={`mt-3 text-[13px] font-medium ${
                delta >= 0 ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {delta >= 0 ? "+" : ""}
              {formatNumber(delta)} vs prior ({formatDate(previous?.measuredAt)}
              )
            </p>
          ) : (
            <p className="mt-3 text-[13px] text-admin-muted">
              First recorded measurement
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

function MilestonesTable({ rows }: { rows: ClientMilestone[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState message="No implementation schedule items have been published yet." />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[13px]">
        <thead className="text-[11px] font-semibold tracking-[0.08em] text-admin-muted uppercase">
          <tr className="border-b border-admin-border-subtle">
            <th className="px-1 py-2 font-semibold">Milestone</th>
            <th className="px-1 py-2 font-semibold">Start</th>
            <th className="px-1 py-2 font-semibold">Due</th>
            <th className="px-1 py-2 font-semibold">Owner</th>
            <th className="px-1 py-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-admin-border-subtle text-admin-assessment-text last:border-0"
            >
              <td className="px-1 py-3">{row.title}</td>
              <td className="px-1 py-3">{formatDate(row.startDate)}</td>
              <td className="px-1 py-3">{formatDate(row.dueDate)}</td>
              <td className="px-1 py-3 text-admin-muted">
                {[row.ownerName, row.ownerSide].filter(Boolean).join(" · ") ||
                  "—"}
              </td>
              <td className="px-1 py-3 font-medium text-admin-gold-deep">
                {statusLabel(row.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportsList({ rows }: { rows: ClientReport[] }) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <EmptyState message="No engagement reports have been published for your account yet." />
    );
  }

  const handleDownload = async (reportId: string) => {
    setDownloadError("");
    setDownloadingId(reportId);
    try {
      await downloadClientReport(reportId);
    } catch (cause) {
      setDownloadError(
        cause instanceof Error
          ? cause.message
          : "Could not download this report.",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {downloadError ? (
        <p role="alert" className="text-[13px] text-red-600">
          {downloadError}
        </p>
      ) : null}
      <ul className="flex flex-col divide-y divide-admin-border-subtle">
        {rows.map((row) => {
          const expanded = expandedId === row.id;
          return (
            <li
              key={row.id}
              className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-admin-assessment-text">
                  {row.title}
                </p>
                <p className="mt-1 text-[12px] text-admin-muted">
                  {statusLabel(row.type)} · {row.period}
                  {row.publishedAt
                    ? ` · Published ${formatDate(row.publishedAt)}`
                    : ""}
                </p>
                {row.originalFileName ? (
                  <p className="mt-1 text-[12px] text-admin-muted">
                    File: {row.originalFileName}
                  </p>
                ) : null}
                {row.summary ? (
                  <p
                    className={`mt-2 text-[13px] leading-relaxed text-admin-muted ${
                      expanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {row.summary}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {row.summary ? (
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : row.id)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[12px] font-semibold text-admin-assessment-text hover:bg-admin-soft"
                  >
                    {expanded ? "Hide summary" : "View"}
                  </button>
                ) : null}
                {row.canDownload ? (
                  <button
                    type="button"
                    onClick={() => void handleDownload(row.id)}
                    disabled={downloadingId === row.id}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-admin-assessment-gold px-3 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:opacity-60"
                  >
                    {downloadingId === row.id ? "Downloading…" : "Download"}
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ClientDashboard({
  name,
  email,
  data,
  errorMessage,
}: {
  name: string;
  email: string;
  data: ClientDashboardData | null;
  errorMessage?: string;
}) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const loadError =
    errorMessage ?? (!data ? "Unexpected error loading your dashboard." : null);

  const completed = (data?.assessments ?? [])
    .filter(isCompleted)
    .sort((a, b) => {
      const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return bTime - aTime;
    });

  const primary = data?.assessment ?? null;
  const primaryCompleted =
    primary?.status === "COMPLETED" && primary.result && primary.instanceId
      ? {
          instanceId: primary.instanceId,
          assessmentId: primary.assessmentId,
          assessmentTitle: primary.assessmentTitle,
          assessmentSlug: primary.assessmentSlug,
          status: primary.status,
          submittedAt: primary.submittedAt,
          overallScore: primary.result.overallScore,
        }
      : null;

  const latest = primaryCompleted ?? completed[0] ?? null;
  const previous = completed.find(
    (item) => item.instanceId !== latest?.instanceId,
  );
  const scoreDelta =
    latest?.overallScore != null && previous?.overallScore != null
      ? latest.overallScore - previous.overallScore
      : null;

  return (
    <DashboardShell
      viewer={{ name, email, role: "USER", homePath: "/dashboard" }}
      active="dashboard"
      breadcrumb="Client Dashboard"
    >
      <div className="pt-6">
        <section>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-admin-gold-deep uppercase">
            North Point Sales Group
          </p>
          <h1 className="mt-2 font-sans text-[26px] leading-tight font-bold tracking-[-0.03em] text-admin-navy sm:text-[32px]">
            Welcome, {firstName}
          </h1>
          <p className="mt-1 text-[13px] text-admin-muted">
            Review your Sales Alignment results and track how your scores change
            over time.
          </p>
        </section>

        {loadError ? (
          <div className="mt-5">
            <AdminAlert>{loadError}</AdminAlert>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <section className="flex flex-col justify-between rounded-2xl bg-admin-sidebar p-6 text-admin-sidebar-text shadow-admin-card">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-admin-gold uppercase">
              Latest Sales Alignment Score
            </p>
            {latest?.overallScore != null ? (
              <>
                <p className="mt-5 font-heading leading-none">
                  <span className="text-[56px] font-bold text-admin-gold">
                    {latest.overallScore}
                  </span>
                  <span className="text-[24px] text-admin-sidebar-text/80">
                    /{SCORE_MAX}
                  </span>
                </p>
                {latest.submittedAt ? (
                  <p className="mt-4 text-[12px] text-slate-400">
                    Taken <LocalDate value={latest.submittedAt} />
                  </p>
                ) : null}
                {latest.instanceId ? (
                  <Link
                    href={resultsHref(latest.instanceId)}
                    className="mt-4 inline-flex w-fit items-center gap-1.5 text-[12px] font-semibold text-admin-gold hover:underline"
                  >
                    View full results
                    <ArrowRight className="size-3.5" />
                  </Link>
                ) : null}
              </>
            ) : (
              <p className="mt-5 text-[14px] leading-relaxed text-slate-300">
                No results yet. When your North Point representative completes
                an assessment for you, your score will appear here.
              </p>
            )}
          </section>

          <section className="flex flex-col rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-admin-card">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-admin-muted uppercase">
              Assessments completed
            </p>
            <p className="mt-5 text-[48px] leading-none font-bold text-admin-navy">
              {completed.length}
            </p>
            <p className="mt-auto pt-4 text-[12px] text-admin-muted">
              {scoreDelta != null
                ? `Your latest score is ${scoreDelta >= 0 ? "+" : ""}${scoreDelta} versus your previous result.`
                : "Additional assessments completed by your representative will appear here for comparison."}
            </p>
          </section>

          <section className="flex flex-col rounded-2xl border border-admin-gold/50 bg-admin-warning-bg p-6 shadow-admin-card">
            <span className="flex size-10 items-center justify-center rounded-xl bg-admin-surface text-admin-gold-deep">
              <ClipboardList className="size-5" />
            </span>
            <h2 className="mt-4 text-[16px] font-bold text-admin-navy">
              {primary?.assessmentTitle ?? "Sales Alignment Assessment"}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-admin-muted">
              This is your primary assessment. Results are prepared by your
              North Point Admin or sales representative — you can review them
              here once they are complete.
            </p>
            {latest?.instanceId ? (
              <Link
                href={resultsHref(latest.instanceId)}
                className="mt-auto inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface transition-colors hover:bg-admin-assessment-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold"
              >
                View latest results
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <p className="mt-auto pt-4 text-[12px] text-admin-muted">
                No completed results yet.
              </p>
            )}
          </section>
        </div>

        <div id="my-results" className="mt-6 scroll-mt-6">
          <DashboardCard
            title="My results"
            description="Every completed assessment linked to your account, latest first."
          >
            {completed.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[14px] text-admin-muted">
                  {loadError
                    ? "Your results could not be loaded."
                    : "No assessment results yet. Your representative will complete assessments on your behalf."}
                </p>
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-admin-border-subtle">
                {completed.map((result) => (
                  <li key={result.instanceId}>
                    <Link
                      href={resultsHref(result.instanceId)}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 rounded-lg py-3.5 transition-colors hover:bg-admin-soft sm:grid-cols-[minmax(0,1fr)_180px_72px_24px] sm:px-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-admin-assessment-text">
                          {result.assessmentTitle}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-admin-muted">
                          {result.submittedAt ? (
                            <LocalDate value={result.submittedAt} />
                          ) : (
                            "Completed"
                          )}{" "}
                          · {statusLabel(result.status)}
                        </p>
                      </div>
                      <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
                        <ScoreBar
                          score={result.overallScore ?? 0}
                          max={SCORE_MAX}
                          label="Overall score"
                        />
                      </div>
                      <p className="row-start-1 text-right text-[15px] font-bold text-admin-navy sm:row-start-auto">
                        {result.overallScore}
                        <span className="text-[12px] font-semibold text-admin-muted">
                          /{SCORE_MAX}
                        </span>
                      </p>
                      <ArrowRight
                        aria-hidden
                        className="hidden size-4 text-admin-subtle sm:block"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </DashboardCard>
        </div>

        {data ? (
          <div className="mt-6 space-y-6">
            <DashboardCard
              title="Performance baselines"
              description="The starting measurements for your engagement."
            >
              <BaselinesTable rows={data.baselines} />
            </DashboardCard>

            <DashboardCard
              title="Agreed improvements"
              description="Improvements currently being implemented with NPSG."
            >
              <ImprovementsList rows={data.improvements} />
            </DashboardCard>

            <DashboardCard
              title="KPI progress"
              description="Current performance measurements against prior readings."
            >
              <KpiPanel rows={data.kpis} />
            </DashboardCard>

            <DashboardCard
              title="Implementation schedule"
              description="Milestones and responsibilities for the engagement plan."
            >
              <MilestonesTable rows={data.milestones} />
            </DashboardCard>

            <DashboardCard
              title="Engagement reports"
              description="Published client-edition reports and recommendations."
            >
              <ReportsList rows={data.reports} />
            </DashboardCard>
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}

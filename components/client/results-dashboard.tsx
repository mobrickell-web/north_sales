"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  RotateCcw,
  SearchX,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  DashboardShell,
  type DashboardViewer,
} from "@/components/client/dashboard-shell";
import {
  DashboardCard,
  LocalDate,
  ScoreBar,
  formatScore,
} from "@/components/client/dashboard-ui";
import { useScheduleAppointment } from "@/components/schedule/schedule-provider";
import type {
  SalesAlignmentPillarResult,
  SalesAlignmentResultPayload,
} from "@/lib/assessment-results-api";
import { cn } from "@/lib/utils";

const ASSESSMENT_PATH = "/sales-alignment-assessment";

export type ResultRecord = {
  id: string;
  firstName: string;
  email: string;
  overallScore: number;
  maxScore: number;
  createdAt: string;
};

export type ResultsDashboardState =
  | {
      kind: "ok";
      record: ResultRecord;
      payload: SalesAlignmentResultPayload;
    }
  | { kind: "not-found" }
  | { kind: "error"; message: string };

const primaryLinkClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface transition-colors hover:bg-admin-assessment-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold";

const secondaryLinkClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-4 text-[12px] font-semibold text-admin-assessment-text transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold";

export function ResultsDashboard({
  viewer,
  state,
}: {
  viewer: DashboardViewer;
  state: ResultsDashboardState;
}) {
  return (
    <DashboardShell
      viewer={viewer}
      active="results"
      breadcrumb="Sales Alignment Assessment · Results"
    >
      {state.kind === "ok" ? (
        <ResultsContent
          viewer={viewer}
          record={state.record}
          payload={state.payload}
        />
      ) : (
        <ResultsUnavailable viewer={viewer} state={state} />
      )}
    </DashboardShell>
  );
}

function ResultsUnavailable({
  viewer,
  state,
}: {
  viewer: DashboardViewer;
  state: Exclude<ResultsDashboardState, { kind: "ok" }>;
}) {
  const notFound = state.kind === "not-found";
  const Icon = notFound ? SearchX : AlertTriangle;
  return (
    <section className="mx-auto mt-10 max-w-[560px] rounded-2xl border border-admin-border bg-admin-surface p-8 text-center shadow-admin-card">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-admin-soft text-admin-gold-deep">
        <Icon className="size-5" />
      </span>
      <h1 className="mt-4 text-[22px] font-bold tracking-[-0.02em] text-admin-navy">
        {notFound ? "Results not found" : "Results unavailable"}
      </h1>
      <p className="mt-2 text-[14px] leading-relaxed text-admin-muted">
        {notFound
          ? "These results don't exist or aren't linked to your account. Results are available to the account that submitted them and to the email address they were prepared for."
          : state.message}
      </p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Link href={viewer.homePath} className={secondaryLinkClass}>
          {viewer.role === "USER" ? "Back to dashboard" : "Back"}
        </Link>
        <Link href={ASSESSMENT_PATH} className={primaryLinkClass}>
          Take the assessment
        </Link>
      </div>
    </section>
  );
}

function rankPillars(pillars: SalesAlignmentPillarResult[]) {
  if (pillars.length === 0) return null;
  const sorted = [...pillars].sort((a, b) => b.score - a.score);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];
  return { highest, lowest, allEqual: highest.score === lowest.score };
}

function ResultsContent({
  viewer,
  record,
  payload,
}: {
  viewer: DashboardViewer;
  record: ResultRecord;
  payload: SalesAlignmentResultPayload;
}) {
  const { copy } = payload;
  const ranking = rankPillars(payload.pillars);
  const reviewIds = new Set(payload.closerReview.statements.map((s) => s.id));
  const isOwnResult =
    record.email.trim().toLowerCase() === viewer.email.trim().toLowerCase();

  return (
    <div className="pt-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-admin-gold-deep uppercase">
            {payload.title} · {copy.eyebrow}
          </p>
          <h1 className="mt-2 font-sans text-[26px] leading-tight font-bold tracking-[-0.03em] text-admin-navy sm:text-[32px]">
            {isOwnResult
              ? `Welcome, ${record.firstName}`
              : `${record.firstName}'s results`}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-admin-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              Taken <LocalDate value={record.createdAt} />
            </span>
            <span aria-hidden className="text-admin-subtle">
              ·
            </span>
            <span className="break-all">{record.email}</span>
          </p>
        </div>
        <Link
          href={ASSESSMENT_PATH}
          className={cn(secondaryLinkClass, "w-fit")}
        >
          <RotateCcw className="size-3.5" />
          Retake assessment
        </Link>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <section className="flex flex-col justify-between rounded-2xl bg-admin-sidebar p-6 text-admin-sidebar-text shadow-admin-card">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-admin-gold uppercase">
              {copy.overallScoreLabel}
            </p>
            <p className="mt-5 font-heading leading-none">
              <span className="text-[64px] font-bold text-admin-gold">
                {record.overallScore}
              </span>
              <span className="text-[28px] text-admin-sidebar-text/80">
                /{record.maxScore}
              </span>
            </p>
          </div>
          <div className="mt-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-admin-gold to-admin-gold-deep"
                style={{
                  width: `${
                    record.maxScore > 0
                      ? Math.min(
                          100,
                          (record.overallScore / record.maxScore) * 100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="mt-3 text-[12px] text-slate-400">
              Assessed on{" "}
              <span className="font-semibold text-admin-sidebar-text">
                <LocalDate value={record.createdAt} />
              </span>
            </p>
          </div>
        </section>

        {payload.pillars.map((pillar) => (
          <section
            key={pillar.number}
            className="flex flex-col rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-admin-card"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-heading text-[28px] leading-none text-admin-gold-deep">
                {pillar.number}
              </span>
              {ranking && !ranking.allEqual ? (
                pillar.number === ranking.highest.number ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-admin-status-published-bg px-2.5 py-1 text-[10px] font-semibold text-admin-status-published">
                    <TrendingUp className="size-3" />
                    Highest
                  </span>
                ) : pillar.number === ranking.lowest.number ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-admin-status-draft-bg px-2.5 py-1 text-[10px] font-semibold text-admin-status-draft">
                    <TrendingDown className="size-3" />
                    Lowest
                  </span>
                ) : null
              ) : null}
            </div>
            <h2 className="mt-3 text-[13px] font-extrabold tracking-[0.12em] text-admin-navy uppercase">
              {pillar.title}
            </h2>
            <p className="mt-1 text-[12px] leading-relaxed text-admin-muted">
              {pillar.description}
            </p>
            <p className="mt-auto pt-5 leading-none">
              <span className="text-[36px] font-bold text-admin-navy">
                {formatScore(pillar.score)}
              </span>
              <span className="text-[16px] font-semibold text-admin-muted">
                {copy.pillarScoreSuffix}
              </span>
            </p>
            <div className="mt-3">
              <ScoreBar
                score={pillar.score}
                max={pillar.maxScore}
                label={`${pillar.title} score`}
              />
            </div>
          </section>
        ))}
      </div>

      {ranking ? (
        <section className="mt-6 rounded-2xl border border-admin-warning-border bg-admin-warning-bg px-5 py-4 text-[14px] leading-relaxed text-admin-warning-text">
          <h2 className="text-[13px] font-bold tracking-[0.08em] uppercase">
            What your results show
          </h2>
          <p className="mt-1.5">
            {ranking.allEqual
              ? `All three pillars received the same average rating of ${formatScore(ranking.highest.score)}${copy.pillarScoreSuffix}.`
              : `Your highest-rated pillar is ${ranking.highest.title} (${formatScore(ranking.highest.score)}${copy.pillarScoreSuffix}) and your lowest-rated pillar is ${ranking.lowest.title} (${formatScore(ranking.lowest.score)}${copy.pillarScoreSuffix}).`}{" "}
            {payload.closerReview.allSame
              ? copy.areasSameRating
              : `${payload.closerReview.statements.length} ${payload.closerReview.statements.length === 1 ? "statement stands" : "statements stand"} out for closer review based on your other responses.`}
          </p>
        </section>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <DashboardCard
          title={copy.statementScoresTitle}
          description="Each statement was rated from 1 (completely disagree) to 10 (completely agree)."
        >
          <ul className="flex flex-col divide-y divide-admin-border-subtle">
            {payload.statements.map((statement) => (
              <li
                key={statement.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-3.5 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_200px_56px]"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-admin-assessment-text">
                    {statement.number}. {statement.title}
                    {reviewIds.has(statement.id) ? (
                      <span className="ml-2 inline-flex rounded-full bg-admin-status-draft-bg px-2 py-0.5 align-middle text-[10px] font-semibold text-admin-status-draft">
                        Closer review
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-[12px] text-admin-muted">
                    {statement.pillarTitle}
                  </p>
                </div>
                <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto">
                  <ScoreBar
                    score={statement.score}
                    max={statement.maxScore}
                    tone={reviewIds.has(statement.id) ? "gold" : "navy"}
                    label={`${statement.title} score`}
                  />
                </div>
                <p className="row-start-1 text-right text-[15px] font-bold text-admin-navy md:row-start-auto">
                  {statement.score}
                  <span className="text-[12px] font-semibold text-admin-muted">
                    {copy.pillarScoreSuffix}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <div className="flex min-w-0 flex-col gap-6">
          <DashboardCard title={copy.areasTitle}>
            {payload.closerReview.allSame ? (
              <p className="text-[13px] leading-relaxed text-admin-muted">
                {copy.areasSameRating}
              </p>
            ) : (
              <>
                {payload.closerReview.showRelativeNote ? (
                  <p className="mb-3 text-[13px] leading-relaxed text-admin-muted">
                    {copy.relativeReviewNote}
                  </p>
                ) : null}
                <ol className="flex flex-col gap-2.5">
                  {payload.closerReview.statements.map((statement) => (
                    <li
                      key={statement.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-admin-gold/40 bg-admin-warning-bg px-3.5 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-admin-assessment-text">
                          {statement.number}. {statement.title}
                        </p>
                        <p className="mt-0.5 text-[12px] text-admin-muted">
                          {statement.pillarTitle}
                        </p>
                      </div>
                      <p className="shrink-0 text-[14px] font-bold text-admin-navy">
                        {statement.score}
                        {copy.pillarScoreSuffix}
                      </p>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </DashboardCard>

          <DashboardCard title="Assessment info">
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[13px]">
              <dt className="text-admin-muted">Assessment</dt>
              <dd className="font-medium text-admin-text-strong">
                {payload.title}
              </dd>
              <dt className="text-admin-muted">Prepared for</dt>
              <dd className="font-medium text-admin-text-strong">
                {record.firstName}
              </dd>
              <dt className="text-admin-muted">Email</dt>
              <dd className="font-medium break-all text-admin-text-strong">
                {record.email}
              </dd>
              <dt className="text-admin-muted">Date taken</dt>
              <dd className="font-medium text-admin-text-strong">
                <LocalDate value={record.createdAt} />
              </dd>
              <dt className="text-admin-muted">Statements</dt>
              <dd className="font-medium text-admin-text-strong">
                {payload.statements.length} rated on a 1–10 scale
              </dd>
            </dl>
          </DashboardCard>

          <NextStepCard scheduleLabel={copy.scheduleLabel} />
        </div>
      </div>

      <p className="mt-6 max-w-[860px] text-[12px] leading-relaxed text-admin-subtle">
        {copy.disclaimer}
      </p>
    </div>
  );
}

function NextStepCard({ scheduleLabel }: { scheduleLabel: string }) {
  const { openSchedule } = useScheduleAppointment();
  return (
    <section className="rounded-2xl bg-admin-sidebar p-6 text-admin-sidebar-text shadow-admin-card">
      <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-admin-gold">
        <ClipboardList className="size-5" />
      </span>
      <h2 className="mt-4 font-heading text-[22px] leading-tight">
        Talk through your results
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-300">
        Review these areas with a NORTH POINT SALES GROUP advisor and decide
        what to measure next.
      </p>
      <button
        type="button"
        onClick={openSchedule}
        className="mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-admin-gold to-admin-gold-deep px-4 text-[12px] font-semibold text-admin-sidebar transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold"
      >
        {scheduleLabel}
        <ArrowUpRight className="size-3.5" />
      </button>
    </section>
  );
}

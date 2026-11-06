"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, ClipboardList } from "lucide-react";

import { AdminAlert } from "@/components/admin/admin-ui";
import { DashboardShell } from "@/components/client/dashboard-shell";
import {
  DashboardCard,
  LocalDate,
  ScoreBar,
} from "@/components/client/dashboard-ui";
import type { AssessmentResultSummary } from "@/lib/assessment-results-api";

const ASSESSMENT_PATH = "/sales-alignment-assessment";

const assessmentNames: Record<string, string> = {
  "sales-alignment": "Sales Alignment Assessment",
};

function assessmentName(slug: string) {
  return assessmentNames[slug] ?? "Assessment";
}

export function ClientDashboard({
  name,
  email,
  results,
  loadError,
}: {
  name: string;
  email: string;
  results: AssessmentResultSummary[];
  loadError: string | null;
}) {
  const latest = results[0] ?? null;
  const firstName = name.trim().split(/\s+/)[0] || name;

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
            {latest ? (
              <>
                <p className="mt-5 font-heading leading-none">
                  <span className="text-[56px] font-bold text-admin-gold">
                    {latest.overallScore}
                  </span>
                  <span className="text-[24px] text-admin-sidebar-text/80">
                    /{latest.maxScore}
                  </span>
                </p>
                <p className="mt-4 text-[12px] text-slate-400">
                  Taken <LocalDate value={latest.createdAt} />
                </p>
                <Link
                  href={`/dashboard/results/${encodeURIComponent(latest.id)}`}
                  className="mt-4 inline-flex w-fit items-center gap-1.5 text-[12px] font-semibold text-admin-gold hover:underline"
                >
                  View full results
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            ) : (
              <p className="mt-5 text-[14px] leading-relaxed text-slate-300">
                No results yet. Take the assessment to see your score here.
              </p>
            )}
          </section>

          <section className="flex flex-col rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-admin-card">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-admin-muted uppercase">
              Assessments taken
            </p>
            <p className="mt-5 text-[48px] leading-none font-bold text-admin-navy">
              {results.length}
            </p>
            <p className="mt-auto pt-4 text-[12px] text-admin-muted">
              {results.length > 1 && latest
                ? `Your latest score is ${latest.overallScore - results[1].overallScore >= 0 ? "+" : ""}${latest.overallScore - results[1].overallScore} versus your previous result.`
                : "Retake the assessment later to compare your progress."}
            </p>
          </section>

          <section className="flex flex-col rounded-2xl border border-admin-gold/50 bg-admin-warning-bg p-6 shadow-admin-card">
            <span className="flex size-10 items-center justify-center rounded-xl bg-admin-surface text-admin-gold-deep">
              <ClipboardList className="size-5" />
            </span>
            <h2 className="mt-4 text-[16px] font-bold text-admin-navy">
              Take the Sales Alignment Assessment
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-admin-muted">
              Rate 10 statements about sales performance, systems, and
              leadership. It takes 2–3 minutes.
            </p>
            <Link
              href={ASSESSMENT_PATH}
              className="mt-auto inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface transition-colors hover:bg-admin-assessment-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold"
            >
              {latest ? "Retake assessment" : "Start assessment"}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </section>
        </div>

        <div id="my-results" className="mt-6 scroll-mt-6">
          <DashboardCard
            title="My results"
            description="Every Sales Alignment Assessment linked to your account, latest first."
          >
            {results.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[14px] text-admin-muted">
                  {loadError
                    ? "Your results could not be loaded."
                    : "You haven't completed an assessment yet."}
                </p>
                <Link
                  href={ASSESSMENT_PATH}
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-4 text-[12px] font-semibold text-admin-assessment-text hover:bg-admin-soft"
                >
                  Take the assessment
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-admin-border-subtle">
                {results.map((result) => (
                  <li key={result.id}>
                    <Link
                      href={`/dashboard/results/${encodeURIComponent(result.id)}`}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 rounded-lg py-3.5 transition-colors hover:bg-admin-soft sm:grid-cols-[minmax(0,1fr)_180px_72px_24px] sm:px-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-admin-assessment-text">
                          {assessmentName(result.assessment)}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-admin-muted">
                          <LocalDate value={result.createdAt} /> ·{" "}
                          {result.firstName} · {result.email}
                        </p>
                      </div>
                      <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
                        <ScoreBar
                          score={result.overallScore}
                          max={result.maxScore}
                          label="Overall score"
                        />
                      </div>
                      <p className="row-start-1 text-right text-[15px] font-bold text-admin-navy sm:row-start-auto">
                        {result.overallScore}
                        <span className="text-[12px] font-semibold text-admin-muted">
                          /{result.maxScore}
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
      </div>
    </DashboardShell>
  );
}

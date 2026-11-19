"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getClientAssessment,
  startClientAssessment,
  submitClientAssessment,
  type ClientAssessmentPayload,
  type ClientAssessmentQuestion,
} from "@/lib/client-assessment-api";

type Answers = Record<string, number | string | boolean>;

export function ClientAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug")?.trim() || undefined;
  const wantsRetake = searchParams.get("retake") === "1";
  const [payload, setPayload] = useState<ClientAssessmentPayload | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError("");
      setAnswers({});
      try {
        if (wantsRetake) {
          const data = await startClientAssessment(
            slugParam ? { slug: slugParam } : {},
          );
          if (cancelled) return;
          setPayload(data);
          // Drop retake query so refresh/submit don't re-trigger reset.
          const next = new URLSearchParams();
          if (slugParam) next.set("slug", slugParam);
          const qs = next.toString();
          router.replace(
            qs ? `/dashboard/assessment?${qs}` : "/dashboard/assessment",
          );
          return;
        }

        const data = await getClientAssessment(
          slugParam ? { slug: slugParam } : {},
        );
        if (!cancelled) setPayload(data);
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : wantsRetake
                ? "Could not retake this assessment."
                : "Could not load your assessment.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slugParam, wantsRetake, router]);

  const questions = useMemo(() => {
    const sections = payload?.assessment.document.sections ?? [];
    let number = 1;
    const flattened: Array<
      ClientAssessmentQuestion & {
        number: number;
        sectionTitle: string;
      }
    > = [];
    for (const section of sections) {
      for (const question of section.questions) {
        flattened.push({
          ...question,
          number,
          sectionTitle: section.title,
        });
        number += 1;
      }
    }
    return flattened;
  }, [payload]);

  const requiredQuestions = useMemo(
    () => questions.filter((q) => q.required),
    [questions],
  );

  const answeredRequiredCount = useMemo(() => {
    return requiredQuestions.filter((q) => {
      const value = answers[q.id];
      if (q.type === "short-answer") {
        return typeof value === "string" && value.trim().length > 0;
      }
      return value !== undefined && value !== null && value !== "";
    }).length;
  }, [answers, requiredQuestions]);

  const isComplete = answeredRequiredCount === requiredQuestions.length;
  const result = payload?.result ?? null;
  const instance = payload?.instance ?? null;
  const completed = instance?.status === "COMPLETED" && result;

  const handleStart = async () => {
    setStarting(true);
    setError("");
    try {
      const data = await startClientAssessment(
        slugParam ? { slug: slugParam } : {},
      );
      setPayload(data);
      setAnswers({});
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not start the assessment.",
      );
    } finally {
      setStarting(false);
    }
  };

  const handleSubmit = async () => {
    if (!instance?.id) return;
    if (!isComplete) {
      const firstMissing = requiredQuestions.find((q) => {
        const value = answers[q.id];
        if (q.type === "short-answer") {
          return !(typeof value === "string" && value.trim());
        }
        return value === undefined || value === null || value === "";
      });
      if (firstMissing) {
        setHighlightedId(firstMissing.id);
        document
          .getElementById(`q-${firstMissing.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const data = await submitClientAssessment(instance.id, answers);
      setPayload(data);
      if (data.instance?.status === "COMPLETED" && data.instance.id) {
        router.replace(
          `/dashboard/results/${encodeURIComponent(data.instance.id)}`,
        );
        return;
      }
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not submit the assessment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020B1E] px-5 py-16 text-white">
        <p className="mx-auto max-w-3xl text-sm text-white/60">
          Loading your assessment…
        </p>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="min-h-screen bg-[#020B1E] px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl border border-red-400/30 bg-red-950/30 px-5 py-6">
          <p className="font-semibold text-red-200">Assessment unavailable</p>
          <p className="mt-2 text-sm text-red-100/80">
            {error || "Could not load your assessment."}
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex min-h-10 items-center border border-red-200/40 px-4 font-secondary text-[11px] font-bold tracking-[0.08em] uppercase"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020B1E] text-white">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/dashboard"
          className="font-secondary text-[11px] font-bold tracking-[0.1em] text-gold uppercase"
        >
          ← Back to dashboard
        </Link>

        <header className="mt-6 border-b border-white/10 pb-8">
          <p className="font-secondary text-xs font-bold tracking-[0.16em] text-gold uppercase">
            NORTH POINT SALES GROUP
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
            {payload.assessment.title}
          </h1>
          {payload.assessment.document.settings.introduction ? (
            <p className="mt-4 text-sm leading-6 text-white/65">
              {payload.assessment.document.settings.introduction}
            </p>
          ) : null}
        </header>

        {payload.history && payload.history.length > 0 ? (
          <div className="mt-6 border border-white/10 bg-white/[0.03] px-4 py-4">
            <p className="font-secondary text-[11px] font-bold tracking-[0.12em] text-white/50 uppercase">
              Assessment history
            </p>
            <ul className="mt-3 space-y-2">
              {payload.history.map((item) => {
                const href =
                  item.status === "COMPLETED"
                    ? `/dashboard/results/${encodeURIComponent(item.instanceId)}`
                    : `/dashboard/assessment?slug=${encodeURIComponent(item.assessmentSlug)}`;
                const isActive =
                  payload.assessment.slug === item.assessmentSlug;
                const canOpen =
                  item.status === "COMPLETED" ||
                  item.status === "IN_PROGRESS" ||
                  item.status === "PENDING";
                return (
                  <li key={item.instanceId}>
                    {canOpen ? (
                      <Link
                        href={href}
                        className={`flex flex-wrap items-baseline justify-between gap-2 text-sm transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-white/70 hover:text-white"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span>
                          {item.assessmentTitle}
                          <span className="ml-2 text-white/40">
                            ({item.status.toLowerCase().replace(/_/g, " ")})
                          </span>
                          {item.status === "COMPLETED" ? (
                            <span className="ml-2 font-secondary text-[10px] tracking-[0.08em] text-gold uppercase">
                              View results
                            </span>
                          ) : null}
                        </span>
                        {item.overallScore != null ? (
                          <span className="font-secondary text-xs tracking-[0.06em] text-gold">
                            {item.overallScore}/100
                          </span>
                        ) : null}
                      </Link>
                    ) : (
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-white/70">
                        <span>
                          {item.assessmentTitle}
                          <span className="ml-2 text-white/40">
                            ({item.status.toLowerCase().replace(/_/g, " ")})
                          </span>
                        </span>
                        {item.overallScore != null ? (
                          <span className="font-secondary text-xs tracking-[0.06em] text-gold">
                            {item.overallScore}/100
                          </span>
                        ) : null}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {error ? (
          <p role="alert" className="mt-6 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        {completed && result ? (
          <div className="mt-10 border border-white/15 bg-white/[0.04] px-5 py-8">
            <p className="text-sm leading-6 text-white/70">
              You already completed this assessment
              {result.overallScore != null
                ? ` with a score of ${result.overallScore}/100`
                : ""}
              .
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/dashboard/results/${encodeURIComponent(instance.id)}`}
                className="inline-flex min-h-11 items-center border border-gold px-5 font-secondary text-xs font-bold tracking-[0.08em] text-gold uppercase transition-colors hover:bg-gold hover:text-[#001528]"
              >
                View results
              </Link>
              {payload.assessment.document.settings.allowRetake ? (
                <button
                  type="button"
                  onClick={() => void handleStart()}
                  disabled={starting}
                  className="inline-flex min-h-11 items-center border border-white/25 px-5 font-secondary text-xs font-bold tracking-[0.08em] text-white/80 uppercase disabled:opacity-60"
                >
                  {starting ? "Starting…" : "Retake assessment"}
                </button>
              ) : null}
            </div>
          </div>
        ) : !instance ? (
          <div className="mt-10 border border-white/15 bg-white/[0.04] px-5 py-8">
            <p className="text-sm leading-6 text-white/70">
              Ready to begin? Your answers are scored securely after you submit.
              Scoring details stay on the server.
            </p>
            <button
              type="button"
              onClick={() => void handleStart()}
              disabled={starting}
              className="mt-6 min-h-11 border border-gold px-6 font-secondary text-xs font-bold tracking-[0.08em] text-gold uppercase transition-colors hover:bg-gold hover:text-[#001528] disabled:opacity-60"
            >
              {starting ? "Starting…" : "Start assessment"}
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {payload.assessment.document.sections.map(
              (section, sectionIndex) => (
                <section key={section.id}>
                  <p className="font-secondary text-[11px] font-bold tracking-[0.14em] text-gold uppercase">
                    Section {String(sectionIndex + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold">
                    {section.title}
                  </h2>
                  {section.description ? (
                    <p className="mt-2 text-sm text-white/60">
                      {section.description}
                    </p>
                  ) : null}
                  <div className="mt-6 space-y-6">
                    {section.questions.map((question) => {
                      const flat = questions.find((q) => q.id === question.id);
                      return (
                        <QuestionField
                          key={question.id}
                          question={question}
                          number={flat?.number ?? 0}
                          value={answers[question.id]}
                          highlighted={highlightedId === question.id}
                          onChange={(value) => {
                            setAnswers((prev) => ({
                              ...prev,
                              [question.id]: value,
                            }));
                            if (highlightedId === question.id) {
                              setHighlightedId(null);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </section>
              ),
            )}

            <div className="border-t border-white/10 pt-6">
              <p className="text-sm text-white/55">
                {answeredRequiredCount} of {requiredQuestions.length} required
                questions answered
              </p>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="mt-4 min-h-11 border border-gold px-6 font-secondary text-xs font-bold tracking-[0.08em] text-gold uppercase transition-colors hover:bg-gold hover:text-[#001528] disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit assessment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function QuestionField({
  question,
  number,
  value,
  highlighted,
  onChange,
}: {
  question: ClientAssessmentQuestion;
  number: number;
  value: number | string | boolean | undefined;
  highlighted: boolean;
  onChange: (value: number | string | boolean) => void;
}) {
  return (
    <div
      id={`q-${question.id}`}
      className={`border px-4 py-5 ${
        highlighted
          ? "border-gold bg-gold/10"
          : "border-white/12 bg-white/[0.03]"
      }`}
    >
      <p className="text-xs text-white/45">Question {number}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-white">
        {question.prompt}
        {question.required ? <span className="text-gold"> *</span> : null}
      </p>
      {question.helperText ? (
        <p className="mt-2 text-xs text-white/50">{question.helperText}</p>
      ) : null}

      <div className="mt-4">
        {question.type === "scale" ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, index) => index + 1).map(
              (score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => onChange(score)}
                  className={`min-h-10 min-w-10 border px-2 text-sm ${
                    value === score
                      ? "border-gold bg-gold text-[#001528]"
                      : "border-white/20 text-white/80"
                  }`}
                >
                  {score}
                </button>
              ),
            )}
          </div>
        ) : null}

        {question.type === "five-point-scale" ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, index) => index + 1).map(
              (score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => onChange(score)}
                  className={`min-h-10 min-w-10 border px-2 text-sm ${
                    value === score
                      ? "border-gold bg-gold text-[#001528]"
                      : "border-white/20 text-white/80"
                  }`}
                >
                  {score}
                </button>
              ),
            )}
          </div>
        ) : null}

        {question.type === "yes-no" ? (
          <div className="flex gap-2">
            {(["yes", "no"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={`min-h-10 border px-4 text-sm capitalize ${
                  value === option
                    ? "border-gold bg-gold text-[#001528]"
                    : "border-white/20 text-white/80"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}

        {question.type === "multiple-choice" ? (
          <div className="space-y-2">
            {(question.options ?? []).map((option, index) => (
              <button
                key={`${question.id}-${index}`}
                type="button"
                onClick={() => onChange(index)}
                className={`block w-full border px-4 py-3 text-left text-sm ${
                  value === index
                    ? "border-gold bg-gold/20 text-white"
                    : "border-white/20 text-white/80"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}

        {question.type === "short-answer" ? (
          <textarea
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            rows={4}
            className="w-full border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-gold"
          />
        ) : null}

        {(question.type === "scale" || question.type === "five-point-scale") &&
        (question.lowLabel || question.highLabel) ? (
          <div className="mt-2 flex justify-between text-[11px] text-white/45">
            <span>{question.lowLabel}</span>
            <span>{question.highLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type {
  ClientAssessmentQuestion,
  ClientSafeAssessmentResult,
} from "@/lib/client-assessment-api";
import {
  getOnBehalfAssessment,
  submitOnBehalfAssessment,
  type OnBehalfAssessmentPayload,
} from "@/lib/on-behalf-api";

type Answers = Record<string, number | string | boolean>;

function formatScore(value: number) {
  return value.toFixed(1);
}

export function OnBehalfAssessmentPage({ token }: { token: string }) {
  const [payload, setPayload] = useState<OnBehalfAssessmentPayload | null>(
    null,
  );
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getOnBehalfAssessment(token);
        if (!cancelled) setPayload(data);
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load this Zoom completion link.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const questions = useMemo(() => {
    const sections = payload?.assessment.document.sections ?? [];
    let number = 1;
    const flattened: Array<
      ClientAssessmentQuestion & { number: number; sectionTitle: string }
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
  const completed =
    payload?.instance?.status === "COMPLETED" && Boolean(result);

  const handleSubmit = async () => {
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
          .getElementById(`ob-q-${firstMissing.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const data = await submitOnBehalfAssessment(token, answers);
      setPayload(data);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not submit the on-behalf assessment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020B1E] px-5 py-16 text-white">
        <p className="mx-auto max-w-3xl text-sm text-white/60">
          Loading Zoom completion link…
        </p>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="min-h-screen bg-[#020B1E] px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl border border-red-400/30 bg-red-950/30 px-5 py-6">
          <p className="font-semibold text-red-200">Link unavailable</p>
          <p className="mt-2 text-sm text-red-100/80">
            {error ||
              "This Zoom completion link is invalid, expired, or already used."}
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex min-h-10 items-center border border-red-200/40 px-4 font-secondary text-[11px] font-bold tracking-[0.08em] uppercase"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020B1E] text-white">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="font-secondary text-[11px] font-bold tracking-[0.1em] text-gold uppercase">
          Zoom on-behalf completion
        </p>

        <header className="mt-6 border-b border-white/10 pb-8">
          <p className="font-secondary text-xs font-bold tracking-[0.16em] text-gold uppercase">
            NORTH POINT SALES GROUP
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
            {payload.assessment.title}
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/65">
            You are completing this assessment on behalf of the client during a
            live Zoom meeting. Submit once — this link cannot be reused.
          </p>
          {payload.assessment.document.settings.introduction ? (
            <p className="mt-3 text-sm leading-6 text-white/55">
              {payload.assessment.document.settings.introduction}
            </p>
          ) : null}
        </header>

        {error ? (
          <p role="alert" className="mt-6 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        {completed && result ? (
          <ResultsView result={result} />
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
                {submitting ? "Submitting…" : "Submit for client"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ResultsView({ result }: { result: ClientSafeAssessmentResult }) {
  return (
    <div className="mt-10 space-y-10">
      <div className="border border-emerald-400/30 bg-emerald-950/20 px-5 py-5">
        <p className="text-sm text-emerald-100/90">
          Assessment submitted for the client. They will see these results on
          their dashboard.
        </p>
      </div>

      <div className="border border-white/15 bg-white/[0.04] px-5 py-7">
        <p className="font-secondary text-[11px] font-bold tracking-[0.14em] text-gold uppercase">
          Overall score
        </p>
        <p className="mt-3 font-heading text-5xl font-bold">
          {result.overallScore}
          <span className="text-xl text-white/45">/100</span>
        </p>
        {result.resultText ? (
          <p className="mt-4 text-sm leading-6 text-white/65">
            {result.resultText}
          </p>
        ) : null}
      </div>

      <section>
        <h2 className="font-heading text-2xl font-bold">Pillar scores</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {result.sectionBreakdowns.map((section) => (
            <article
              key={section.id}
              className="border border-white/12 bg-white/[0.03] px-4 py-4"
            >
              <p className="font-secondary text-[11px] tracking-[0.08em] text-white/45 uppercase">
                {section.number} · {section.title}
              </p>
              <p className="mt-2 font-heading text-3xl font-bold">
                {formatScore(section.score)}
                <span className="text-sm text-white/45">/10</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold">Closer review</h2>
        {result.allSame ? (
          <p className="mt-3 text-sm text-white/60">
            All scored responses were equal, so no closer-review items were
            highlighted.
          </p>
        ) : result.review.length === 0 ? (
          <p className="mt-3 text-sm text-white/60">
            No lower-scoring items met the closer-review threshold.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {result.review.map((item) => (
              <li
                key={item.id}
                className="border border-white/12 bg-white/[0.03] px-4 py-4"
              >
                <p className="text-xs text-white/45">
                  Q{item.number} · {item.sectionTitle} ·{" "}
                  {formatScore(item.score)}/10
                </p>
                <p className="mt-2 text-sm text-white/85">{item.prompt}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
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
      id={`ob-q-${question.id}`}
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
            {Array.from({ length: 5 }, (_, index) => index + 1).map((score) => (
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
            ))}
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

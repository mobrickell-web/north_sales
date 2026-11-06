"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  SALES_ALIGNMENT_ASSESSMENT,
  type SalesAlignmentResultPayload,
  type SalesAlignmentStatementResult,
  submitAssessmentResult,
} from "@/lib/assessment-results-api";
import { adminProfile } from "@/lib/auth-api";

const assessment = siteConfig.salesAlignmentAssessment;

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ""),
  );
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function roundScore(value: number) {
  return Math.round(value * 10) / 10;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const questions = assessment.pillars.flatMap((pillar, pillarIndex) =>
  pillar.questions.map((question, questionIndex) => ({
    ...question,
    number:
      assessment.pillars
        .slice(0, pillarIndex)
        .reduce((count, item) => count + item.questions.length, 0) +
      questionIndex +
      1,
    pillar,
  })),
);

const maxStatementScore = Math.max(...assessment.scale);

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function computeCloserReview(
  scored: Array<(typeof questions)[number] & { score: number }>,
) {
  const sorted = [...scored].sort((a, b) =>
    a.score !== b.score ? a.score - b.score : a.number - b.number,
  );
  const allSame = sorted[0].score === sorted[sorted.length - 1].score;
  if (allSame) {
    return {
      allSame: true,
      review: [] as typeof scored,
      lowestScore: sorted[0].score,
    };
  }
  const thirdLowestRating = sorted[2].score;
  const review = scored
    .filter((item) => item.score <= thirdLowestRating)
    .sort((a, b) =>
      a.score !== b.score ? a.score - b.score : a.number - b.number,
    );
  return {
    allSame: false,
    review,
    lowestScore: review[0]?.score ?? thirdLowestRating,
  };
}

export function SalesAlignmentAssessment() {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Clients taking the assessment for themselves get their details prefilled;
  // staff running it with a prospect type the prospect's details instead.
  useEffect(() => {
    let active = true;
    adminProfile()
      .then((profile) => {
        if (!active || profile.role !== "USER") return;
        setFirstName((current) =>
          current ? current : (profile.name.trim().split(/\s+/)[0] ?? ""),
        );
        setEmail((current) => (current ? current : profile.email));
      })
      .catch(() => {
        // Prefill is a convenience; the visitor can still type their details.
      });
    return () => {
      active = false;
    };
  }, []);

  const answered = Object.keys(scores).length;
  const complete = answered === questions.length;

  const results = useMemo(() => {
    if (!complete) return null;

    const pillars = assessment.pillars.map((pillar) => ({
      ...pillar,
      score: average(pillar.questions.map((question) => scores[question.id])),
    }));

    const overall = sum(questions.map((question) => scores[question.id]));
    const scored = questions.map((question) => ({
      ...question,
      score: scores[question.id],
    }));
    const { allSame, review, lowestScore } = computeCloserReview(scored);

    const toStatement = (
      item: (typeof scored)[number],
    ): SalesAlignmentStatementResult => ({
      id: item.id,
      number: item.number,
      title: item.title,
      prompt: item.prompt,
      pillarNumber: item.pillar.number,
      pillarTitle: item.pillar.title,
      score: item.score,
      maxScore: maxStatementScore,
    });

    // Everything the results dashboard renders, so stored results keep their
    // wording even if this assessment's copy changes later.
    const payload: SalesAlignmentResultPayload = {
      version: 1,
      title: assessment.title,
      overall: {
        score: overall,
        maxScore: questions.length * maxStatementScore,
      },
      pillars: pillars.map((pillar) => ({
        number: pillar.number,
        title: pillar.title,
        description: pillar.description,
        score: roundScore(pillar.score),
        maxScore: maxStatementScore,
        statementIds: pillar.questions.map((question) => question.id),
      })),
      statements: scored.map(toStatement),
      closerReview: {
        allSame,
        showRelativeNote: !allSame && review.length > 0 && lowestScore >= 9,
        statements: review.map(toStatement),
      },
      copy: {
        eyebrow: assessment.results.eyebrow,
        overallScoreLabel: assessment.results.overallScoreLabel,
        overallScoreSuffix: assessment.results.overallScoreSuffix,
        pillarScoreSuffix: assessment.results.pillarScoreSuffix,
        statementScoresTitle: assessment.results.statementScoresTitle,
        areasTitle: assessment.results.areasTitle,
        areasSameRating: assessment.results.areasSameRating,
        relativeReviewNote: assessment.results.relativeReviewNote,
        disclaimer: assessment.results.disclaimer,
        scheduleLabel: assessment.results.scheduleLabel,
      },
    };

    return payload;
  }, [complete, scores]);

  const viewResults = async () => {
    if (submitting) return;

    if (!complete) {
      const missing = questions.find((question) => scores[question.id] == null);
      setHighlightedId(missing?.id ?? null);
      setDetailsError(null);
      if (missing) {
        document.getElementById(missing.id)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();
    const detailsMessage =
      !trimmedFirstName || !trimmedEmail
        ? assessment.nextStep.missingDetails
        : !EMAIL_PATTERN.test(trimmedEmail)
          ? "Please enter a valid email address."
          : null;

    if (detailsMessage || !results) {
      setDetailsError(detailsMessage);
      document.getElementById("assessment-lead-capture")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setDetailsError(null);
    setHighlightedId(null);
    setSubmitting(true);

    try {
      const { id } = await submitAssessmentResult({
        assessment: SALES_ALIGNMENT_ASSESSMENT,
        firstName: trimmedFirstName,
        email: trimmedEmail,
        overallScore: results.overall.score,
        maxScore: results.overall.maxScore,
        answers: Object.fromEntries(
          questions.map((question) => [question.id, scores[question.id]]),
        ),
        result: results,
      });
      router.push(`/dashboard/results/${encodeURIComponent(id)}`);
    } catch (cause) {
      setDetailsError(
        cause instanceof Error && cause.message
          ? cause.message
          : "We could not save your results. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] text-[#001528]">
      <div className="mx-auto w-full max-w-[1100px] px-5 pt-14 pb-20 sm:px-8 sm:pt-20">
        <section className="mx-auto max-w-[760px] text-center">
          <p className="inline-flex items-center gap-2 font-body text-[11px] font-bold tracking-[0.18em] text-[#5C5F66] uppercase">
            <span aria-hidden className="size-1.5 bg-[#b17411]" />
            {assessment.badge}
          </p>
          <h1 className="mt-5 font-heading text-[36px] leading-[1.15] font-medium text-[#001528] sm:text-[52px]">
            {assessment.headlineLine1}
            <br />
            {assessment.headlineLine2}{" "}
            <span className="text-[#b17411]">
              {assessment.headlineHighlight}
            </span>
            {assessment.headlineMark}
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] font-body text-[16px] leading-relaxed text-[#5C5F66] sm:text-[17px]">
            {assessment.intro}
          </p>
          <p className="mt-6 font-body text-[13px] text-[#5C5F66]">
            {assessment.meta.map((item, index) => (
              <span key={item}>
                {index > 0 ? (
                  <span className="mx-2 text-[#b17411]">·</span>
                ) : null}
                {item}
              </span>
            ))}
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-[#E8E4DC] bg-white px-5 py-7 shadow-[0_10px_40px_rgba(0,21,40,0.06)] sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-col gap-4 border-b border-[#E8E4DC] pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-body text-[18px] font-bold text-[#001528] sm:text-[20px]">
                {assessment.form.title}
              </h2>
              <p className="mt-1 font-body text-[13px] text-[#5C5F66]">
                <span className="font-semibold text-[#001528]">
                  {assessment.form.scaleLow}
                </span>{" "}
                = {assessment.form.scaleLowLabel}
                <span className="mx-2 text-[#b17411]">·</span>
                <span className="font-semibold text-[#001528]">
                  {assessment.form.scaleHigh}
                </span>{" "}
                = {assessment.form.scaleHighLabel}
              </p>
            </div>
            <p className="w-fit rounded-full border border-[#E8E4DC] px-3 py-1 font-body text-[12px] text-[#5C5F66]">
              {fill(assessment.form.progress, {
                answered,
                total: questions.length,
              })}
            </p>
          </div>

          <p className="border-b border-[#E8E4DC] py-4 font-body text-[13px] text-[#8A8F98]">
            {assessment.form.guidance}
          </p>

          <div className="mt-8 flex flex-col gap-10">
            {assessment.pillars.map((pillar) => (
              <section key={pillar.number}>
                <div className="flex items-start gap-4 border-l-2 border-[#b17411] pl-4">
                  <span className="font-heading text-[34px] leading-none text-[#b17411]">
                    {pillar.number}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-body text-[13px] font-extrabold tracking-[0.14em] text-[#001528] uppercase">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 font-body text-[14px] text-[#5C5F66]">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="mt-2">
                  {pillar.questions.map((question) => {
                    const item = questions.find(
                      (entry) => entry.id === question.id,
                    );
                    const selected = scores[question.id];
                    return (
                      <div
                        key={question.id}
                        id={question.id}
                        className={`grid gap-4 border-b border-[#E8E4DC] py-6 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 ${
                          highlightedId === question.id
                            ? "rounded-lg bg-[#FAF9F5] px-3"
                            : ""
                        }`}
                      >
                        <div>
                          <h4 className="font-body text-[16px] font-bold text-[#001528]">
                            {item?.number}. {question.title}
                          </h4>
                          <p className="mt-1 max-w-[560px] font-body text-[14px] leading-relaxed text-[#5C5F66]">
                            {question.prompt}
                          </p>
                        </div>
                        <fieldset className="w-full max-w-[460px] lg:w-[460px]">
                          <legend className="sr-only">
                            {fill(assessment.form.legend, {
                              title: question.title,
                            })}
                          </legend>
                          <div className="grid grid-cols-10 gap-1">
                            {assessment.scale.map((value) => {
                              const isSelected = selected === value;
                              return (
                                <label
                                  key={value}
                                  className={`flex h-9 cursor-pointer items-center justify-center rounded-[4px] border font-body text-[13px] transition-colors ${
                                    isSelected
                                      ? "border-[#001528] bg-[#001528] text-white"
                                      : "border-[#E8E4DC] bg-white text-[#001528] hover:border-[#b17411]"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value={value}
                                    checked={isSelected}
                                    onChange={() => {
                                      setScores((current) => ({
                                        ...current,
                                        [question.id]: value,
                                      }));
                                      setHighlightedId(null);
                                    }}
                                    className="sr-only"
                                  />
                                  {value}
                                </label>
                              );
                            })}
                          </div>
                          <div className="mt-1.5 flex justify-between font-body text-[11px] text-[#8A8F98]">
                            <span>{assessment.form.scaleLowLabel}</span>
                            <span>{assessment.form.scaleHighLabel}</span>
                          </div>
                        </fieldset>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div
            id="assessment-lead-capture"
            className="mt-4 scroll-mt-32 border-t border-[#E8E4DC] pt-7"
          >
            <p className="font-body text-[11px] font-bold tracking-[0.16em] text-[#8A8F98] uppercase">
              {assessment.nextStep.eyebrow}
            </p>
            <h2 className="mt-2 max-w-[720px] font-body text-[22px] font-bold text-[#001528] sm:text-[26px]">
              {assessment.nextStep.title}
            </h2>
            <p className="mt-2 max-w-[720px] font-body text-[14px] leading-relaxed text-[#5C5F66]">
              {assessment.nextStep.subtitle}
            </p>

            {complete ? null : (
              <p className="mt-4 font-body text-[13px] text-[#8A8F98]">
                {assessment.nextStep.incomplete}
              </p>
            )}

            <div className="mt-5 grid max-w-[720px] grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="assessment-first-name"
                  className="mb-1 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase"
                >
                  {assessment.nextStep.firstNameLabel}
                </label>
                <input
                  id="assessment-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    setDetailsError(null);
                  }}
                  className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-[#8A8F98] focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20"
                />
              </div>
              <div>
                <label
                  htmlFor="assessment-email"
                  className="mb-1 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase"
                >
                  {assessment.nextStep.emailLabel}
                </label>
                <input
                  id="assessment-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setDetailsError(null);
                  }}
                  className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-[#8A8F98] focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20"
                />
              </div>
            </div>

            <p className="mt-3 max-w-[720px] font-body text-[13px] leading-relaxed text-[#8A8F98]">
              {assessment.nextStep.privacy}{" "}
              <Link
                href={assessment.nextStep.privacyHref}
                className="underline underline-offset-2 transition-colors hover:text-[#b17411]"
              >
                {assessment.nextStep.privacyLinkLabel}
              </Link>
            </p>

            {detailsError ? (
              <p
                role="alert"
                className="mt-3 font-body text-[13px] text-[#8f2d2d]"
              >
                {detailsError}
              </p>
            ) : null}

            <div className="mt-5">
              <button
                type="button"
                onClick={() => void viewResults()}
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 bg-[#001528] px-6 font-body text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#020B1E] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Saving your results…
                  </>
                ) : (
                  <>
                    {assessment.nextStep.button}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </>
                )}
              </button>
              <p className="mt-2 font-body text-[12px] text-[#8A8F98]">
                {assessment.nextStep.note}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[720px] px-2 pt-20 text-center">
          <p className="font-body text-[12px] font-bold tracking-[0.18em] text-[#8A8F98] uppercase">
            {assessment.closing.eyebrow}
          </p>
          <h2 className="mt-4 font-heading text-[32px] leading-tight font-medium text-[#001528] sm:text-[40px]">
            {assessment.closing.line1}
            <br />
            {assessment.closing.line2}
          </h2>
          <p className="mx-auto mt-6 max-w-[640px] font-body text-[13px] leading-relaxed text-[#8A8F98]">
            {assessment.closing.disclaimer}
          </p>
        </section>
      </div>
    </div>
  );
}

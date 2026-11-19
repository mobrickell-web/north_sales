"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  SALES_ALIGNMENT_ASSESSMENT,
  claimAssessmentResult,
  type SalesAlignmentResultPayload,
} from "@/lib/assessment-results-api";
import type {
  PublishedAssessment,
  PublishedQuestion,
  PublishedSection,
} from "@/lib/published-assessments";

const staticAssessmentConfig = siteConfig.salesAlignmentAssessment;

export interface SalesAlignmentAssessmentProps {
  assessmentData?: PublishedAssessment | null;
  /**
   * Reps may preview the client-facing assessment, but cannot complete it here.
   * Completion for a client requires an admin-issued Zoom on-behalf link.
   */
  mode?: "interactive" | "preview";
}

type FlattenedQuestion = PublishedQuestion & {
  number: number;
  section: PublishedSection;
  sectionNumber: number;
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatScore(value: number) {
  return value.toFixed(1);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function SalesAlignmentAssessment({
  assessmentData,
  mode = "interactive",
}: SalesAlignmentAssessmentProps) {
  // If no published assessment exists in the database, show clean unavailable state.
  if (!assessmentData) {
    return (
      <div className="bg-[#FAF9F5] text-[#001528]">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-[800px] flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
          <p className="inline-flex items-center gap-2 font-body text-[11px] font-bold tracking-[0.18em] text-[#5C5F66] uppercase">
            <span aria-hidden className="size-1.5 bg-[#b17411]" />
            North Point Sales Group
          </p>
          <h1 className="mt-5 font-heading text-[32px] font-medium text-[#001528] sm:text-[44px]">
            Assessment Currently Unavailable
          </h1>
          <p className="mx-auto mt-4 max-w-[540px] font-body text-[16px] leading-relaxed text-[#5C5F66]">
            This assessment is currently in draft or is being updated by our
            team. Please check back later or contact your representative.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex h-[46px] items-center justify-center bg-[#001528] px-6 font-body text-[13px] font-bold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#020B1E]"
            >
              Return to Home
            </Link>
            <Link
              href="/#cta"
              className="inline-flex h-[46px] items-center justify-center border border-[#E8E4DC] px-6 font-body text-[13px] font-bold tracking-[0.08em] text-[#001528] uppercase transition-colors hover:border-[#b17411]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <DataDrivenAssessmentView assessment={assessmentData} mode={mode} />;
}

function DataDrivenAssessmentView({
  assessment,
  mode = "interactive",
}: {
  assessment: PublishedAssessment;
  mode?: "interactive" | "preview";
}) {
  const isPreview = mode === "preview";
  const sections = assessment.document.sections;
  const settings = assessment.document.settings;
  const resultText = assessment.document.resultText;

  // Flatten questions with sequential numbering
  const questions: FlattenedQuestion[] = useMemo(() => {
    return sections.flatMap((section, sectionIndex) => {
      const priorCount = sections
        .slice(0, sectionIndex)
        .reduce((acc, s) => acc + s.questions.length, 0);

      return section.questions.map((question, qIndex) => ({
        ...question,
        number: priorCount + qIndex + 1,
        section,
        sectionNumber: sectionIndex + 1,
      }));
    });
  }, [sections]);

  const router = useRouter();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Check required completion
  const requiredQuestions = useMemo(
    () => questions.filter((q) => q.required),
    [questions],
  );

  const answeredRequiredCount = useMemo(() => {
    return requiredQuestions.filter((q) => {
      if (q.type === "short-answer") {
        return !!textAnswers[q.id]?.trim();
      }
      return scores[q.id] != null;
    }).length;
  }, [requiredQuestions, scores, textAnswers]);

  const isComplete = answeredRequiredCount === requiredQuestions.length;

  // Results calculation
  const results = useMemo(() => {
    if (!isComplete) return null;

    // Calculate section averages for scale questions
    const sectionBreakdowns = sections.map((section, index) => {
      const sectionScaleQuestions = section.questions.filter(
        (q) =>
          q.type === "scale" ||
          q.type === "five-point-scale" ||
          q.type === "yes-no",
      );
      const sectionScores = sectionScaleQuestions
        .map((q) => scores[q.id])
        .filter((s): s is number => s != null);

      return {
        id: section.id,
        number: String(index + 1).padStart(2, "0"),
        title: section.title,
        description: section.description,
        score: average(sectionScores),
        hasScores: sectionScores.length > 0,
      };
    });

    const scoredQuestions = questions
      .filter((q) => scores[q.id] != null)
      .map((q) => ({
        ...q,
        score: scores[q.id],
      }));

    const totalScoredPoints = sum(scoredQuestions.map((q) => q.score));
    const maxScoredPoints = scoredQuestions.length * 10;
    const overallScorePercent =
      maxScoredPoints > 0
        ? Math.round((totalScoredPoints / maxScoredPoints) * 100)
        : 0;

    // Closer review calculation (statements with lower scores)
    const sorted = [...scoredQuestions].sort((a, b) =>
      a.score !== b.score ? a.score - b.score : a.number - b.number,
    );
    const allSame =
      sorted.length > 1 && sorted[0].score === sorted[sorted.length - 1].score;

    let review: typeof scoredQuestions = [];
    if (!allSame && sorted.length > 0) {
      const thirdLowest =
        sorted.length >= 3 ? sorted[2].score : sorted[sorted.length - 1].score;
      review = scoredQuestions
        .filter((item) => item.score <= thirdLowest && item.score <= 7)
        .sort((a, b) =>
          a.score !== b.score ? a.score - b.score : a.number - b.number,
        );
    }

    return {
      overallScore: overallScorePercent,
      sectionBreakdowns,
      scoredQuestions,
      review,
      allSame,
    };
  }, [isComplete, questions, scores, sections]);

  const handleScoreChange = (questionId: string, score: number) => {
    setScores((prev) => ({ ...prev, [questionId]: score }));
    if (highlightedId === questionId) {
      setHighlightedId(null);
    }
  };

  const handleTextAnswerChange = (questionId: string, text: string) => {
    setTextAnswers((prev) => ({ ...prev, [questionId]: text }));
    if (highlightedId === questionId) {
      setHighlightedId(null);
    }
  };

  const buildResultPayload = (): SalesAlignmentResultPayload | null => {
    if (!results) return null;
    const copy = staticAssessmentConfig.results;
    const pillars = results.sectionBreakdowns
      .filter((section) => section.hasScores)
      .map((section) => ({
        number: section.number,
        title: section.title,
        description: section.description ?? "",
        score: Number(section.score.toFixed(1)),
        maxScore: 10,
        statementIds: results.scoredQuestions
          .filter((question) => question.section.id === section.id)
          .map((question) => question.id),
      }));

    const statements = results.scoredQuestions.map((question) => ({
      id: question.id,
      number: question.number,
      title: question.prompt.slice(0, 72),
      prompt: question.prompt,
      pillarNumber: String(question.sectionNumber).padStart(2, "0"),
      pillarTitle: question.section.title,
      score: question.score,
      maxScore: 10,
    }));

    const closerStatements = results.review.map((question) => ({
      id: question.id,
      number: question.number,
      title: question.prompt.slice(0, 72),
      prompt: question.prompt,
      pillarNumber: String(question.sectionNumber).padStart(2, "0"),
      pillarTitle: question.section.title,
      score: question.score,
      maxScore: 10,
    }));

    return {
      version: 1,
      title: assessment.title,
      overall: { score: results.overallScore, maxScore: 100 },
      pillars,
      statements,
      closerReview: {
        allSame: results.allSame,
        showRelativeNote: !results.allSame && closerStatements.length > 0,
        statements: closerStatements,
      },
      copy: {
        eyebrow: copy.eyebrow,
        overallScoreLabel: copy.overallScoreLabel,
        overallScoreSuffix: copy.overallScoreSuffix,
        pillarScoreSuffix: copy.pillarScoreSuffix,
        statementScoresTitle: copy.statementScoresTitle,
        areasTitle: copy.areasTitle,
        areasSameRating: copy.areasSameRating,
        relativeReviewNote: copy.relativeReviewNote,
        disclaimer: copy.disclaimer,
        scheduleLabel: copy.scheduleLabel,
      },
    };
  };

  const viewResults = async () => {
    if (isPreview || submitting) return;

    if (!isComplete) {
      const firstMissing = requiredQuestions.find((q) => {
        if (q.type === "short-answer") return !textAnswers[q.id]?.trim();
        return scores[q.id] == null;
      });

      if (firstMissing) {
        setHighlightedId(firstMissing.id);
        const element = document.getElementById(firstMissing.id);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!firstName.trim() || !email.trim() || password.trim().length < 8) {
      setDetailsError(staticAssessmentConfig.nextStep.missingDetails);
      document
        .getElementById("assessment-lead-capture")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload = buildResultPayload();
    if (!payload || !results) {
      setDetailsError("Could not score your assessment. Please try again.");
      return;
    }

    setDetailsError(null);
    setHighlightedId(null);
    setSubmitting(true);
    try {
      const answers: Record<string, number> = {};
      for (const [questionId, score] of Object.entries(scores)) {
        answers[questionId] = score;
      }
      const claimed = await claimAssessmentResult({
        assessment: SALES_ALIGNMENT_ASSESSMENT,
        firstName: firstName.trim(),
        email: email.trim(),
        password: password.trim(),
        overallScore: results.overallScore,
        maxScore: 100,
        answers,
        result: payload,
      });
      router.replace(`/dashboard/results/${encodeURIComponent(claimed.id)}`);
    } catch (cause) {
      setDetailsError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Could not open your results. Please try again.",
      );
      setSubmitting(false);
    }
  };

  const resetAssessment = () => {
    setScores({});
    setTextAnswers({});
    setShowResults(false);
    setHighlightedId(null);
    setFirstName("");
    setEmail("");
    setPassword("");
    setSubmitting(false);
    setDetailsError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#FAF9F5] text-[#001528]">
      <div className="mx-auto w-full max-w-[1100px] px-5 pt-14 pb-20 sm:px-8 sm:pt-20">
        {/* Assessment Hero */}
        <section className="mx-auto max-w-[760px] text-center">
          <p className="inline-flex items-center gap-2 font-body text-[11px] font-bold tracking-[0.18em] text-[#5C5F66] uppercase">
            <span aria-hidden className="size-1.5 bg-[#b17411]" />
            {staticAssessmentConfig.badge}
          </p>
          <h1 className="mt-5 font-heading text-[36px] leading-[1.15] font-medium text-[#001528] sm:text-[52px]">
            {assessment.title}
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] font-body text-[16px] leading-relaxed text-[#5C5F66] sm:text-[17px]">
            {settings.introduction || staticAssessmentConfig.intro}
          </p>
          <p className="mt-6 font-body text-[13px] text-[#5C5F66]">
            <span>{questions.length} statements</span>
            <span className="mx-2 text-[#b17411]">·</span>
            <span>2–3 minutes</span>
            <span className="mx-2 text-[#b17411]">·</span>
            <span>{isPreview ? "Preview only" : "Instant results"}</span>
          </p>
          {isPreview ? (
            <div
              role="status"
              className="mx-auto mt-6 max-w-[640px] border border-[#E8E4DC] bg-white px-4 py-4 text-left"
            >
              <p className="font-body text-[13px] font-bold tracking-[0.06em] text-[#001528] uppercase">
                Preview only
              </p>
              <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                Sales representatives can review this assessment here, but
                cannot complete it on this page. To complete an assessment for a
                specific client, use the one-time Zoom on-behalf link issued by
                a Super Admin in Assessment Results.
              </p>
            </div>
          ) : null}
        </section>

        {/* Assessment Form Card */}
        <section className="mt-10 rounded-2xl border border-[#E8E4DC] bg-white px-5 py-7 shadow-[0_10px_40px_rgba(0,21,40,0.06)] sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-col gap-4 border-b border-[#E8E4DC] pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-body text-[18px] font-bold text-[#001528] sm:text-[20px]">
                {staticAssessmentConfig.form.title}
              </h2>
              <p className="mt-1 font-body text-[13px] text-[#5C5F66]">
                {questions.some(
                  (question) =>
                    question.type === "scale" ||
                    question.type === "five-point-scale",
                ) ? (
                  <>
                    <span className="font-semibold text-[#001528]">1</span> =
                    Strongly disagree
                    <span className="mx-2 text-[#b17411]">·</span>
                    <span className="font-semibold text-[#001528]">10</span> =
                    Strongly agree
                  </>
                ) : (
                  <>Answer each question to continue.</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-fit rounded-full border border-[#E8E4DC] px-3 py-1 font-body text-[12px] text-[#5C5F66]">
                {answeredRequiredCount} of {requiredQuestions.length} answered
              </span>
            </div>
          </div>

          {/* Sections and Questions */}
          <div className="mt-8 flex flex-col gap-10">
            {sections.map((section, sectionIndex) => (
              <section key={section.id} className="pt-2">
                <div className="flex items-start gap-4 border-l-2 border-[#b17411] pl-4">
                  <span className="font-heading text-[34px] leading-none text-[#b17411]">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-body text-[13px] font-extrabold tracking-[0.14em] text-[#001528] uppercase">
                      {section.title}
                    </h3>
                    {section.description ? (
                      <p className="mt-1 font-body text-[14px] text-[#5C5F66]">
                        {section.description}
                      </p>
                    ) : null}
                    {section.instructions ? (
                      <p className="mt-1 font-body text-[13px] italic text-[#8A8F98]">
                        {section.instructions}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4">
                  {section.questions.map((question) => {
                    const flattened = questions.find(
                      (q) => q.id === question.id,
                    );
                    const qNumber = flattened?.number ?? 1;
                    const isHighlighted = highlightedId === question.id;

                    return (
                      <div
                        key={question.id}
                        id={question.id}
                        className={`grid gap-4 border-b border-[#E8E4DC] py-6 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 ${
                          isHighlighted
                            ? "rounded-lg bg-[#FAF9F5] px-3 ring-2 ring-[#b17411]"
                            : ""
                        }`}
                      >
                        <div>
                          <h4 className="font-body text-[16px] font-bold text-[#001528]">
                            {qNumber}. {question.prompt}
                          </h4>
                          {question.helperText ? (
                            <p className="mt-1 font-body text-[13px] text-[#8A8F98]">
                              {question.helperText}
                            </p>
                          ) : null}
                          {!question.required ? (
                            <span className="mt-1 inline-block text-[11px] font-medium text-[#8A8F98]">
                              (Optional)
                            </span>
                          ) : null}
                        </div>

                        {/* Question Inputs by Type */}
                        <div
                          className={`w-full max-w-[460px] lg:w-[460px] ${
                            isPreview ? "pointer-events-none opacity-60" : ""
                          }`}
                        >
                          {question.type === "scale" ||
                          question.type === "five-point-scale" ? (
                            <ScaleQuestionInput
                              question={question}
                              currentValue={scores[question.id]}
                              onChange={(value) =>
                                handleScoreChange(question.id, value)
                              }
                            />
                          ) : question.type === "yes-no" ? (
                            <YesNoInput
                              currentValue={scores[question.id]}
                              onChange={(value) =>
                                handleScoreChange(question.id, value)
                              }
                            />
                          ) : question.type === "multiple-choice" ? (
                            <MultipleChoiceInput
                              question={question}
                              currentValue={scores[question.id]}
                              onChange={(value) =>
                                handleScoreChange(question.id, value)
                              }
                            />
                          ) : (
                            <ShortAnswerInput
                              question={question}
                              currentValue={textAnswers[question.id] ?? ""}
                              onChange={(text) =>
                                handleTextAnswerChange(question.id, text)
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Lead Capture Section — blocked for sales-rep preview */}
          {!isPreview ? (
            <div
              id="assessment-lead-capture"
              className="mt-6 scroll-mt-32 border-t border-[#E8E4DC] pt-8"
            >
              <p className="font-body text-[11px] font-bold tracking-[0.16em] text-[#8A8F98] uppercase">
                {staticAssessmentConfig.nextStep.eyebrow}
              </p>
              <h2 className="mt-2 max-w-[720px] font-body text-[22px] font-bold text-[#001528] sm:text-[26px]">
                {staticAssessmentConfig.nextStep.title}
              </h2>
              <p className="mt-2 max-w-[720px] font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {staticAssessmentConfig.nextStep.subtitle}
              </p>

              {!isComplete ? (
                <p className="mt-4 font-body text-[13px] text-[#8A8F98]">
                  Please answer all required questions before viewing results. (
                  {answeredRequiredCount} of {requiredQuestions.length}{" "}
                  complete)
                </p>
              ) : null}

              <div className="mt-5 grid max-w-[960px] grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="assessment-first-name"
                    className="mb-1 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase"
                  >
                    {staticAssessmentConfig.nextStep.firstNameLabel}
                  </label>
                  <input
                    id="assessment-first-name"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    disabled={submitting}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setDetailsError(null);
                    }}
                    className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-[#8A8F98] focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label
                    htmlFor="assessment-email"
                    className="mb-1 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase"
                  >
                    {staticAssessmentConfig.nextStep.emailLabel}
                  </label>
                  <input
                    id="assessment-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    disabled={submitting}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setDetailsError(null);
                    }}
                    className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-[#8A8F98] focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label
                    htmlFor="assessment-temp-password"
                    className="mb-1 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase"
                  >
                    {staticAssessmentConfig.nextStep.passwordLabel}
                  </label>
                  <input
                    id="assessment-temp-password"
                    type="text"
                    autoComplete="new-password"
                    spellCheck={false}
                    value={password}
                    disabled={submitting}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setDetailsError(null);
                    }}
                    className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-[#8A8F98] focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20 disabled:opacity-60"
                  />
                </div>
              </div>

              {detailsError ? (
                <p className="mt-3 font-body text-[13px] text-[#8f2d2d]">
                  {detailsError}
                </p>
              ) : null}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => void viewResults()}
                  disabled={submitting}
                  className="inline-flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 bg-[#001528] px-6 font-body text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#020B1E] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      {staticAssessmentConfig.nextStep.submittingLabel}
                    </>
                  ) : (
                    <>
                      {staticAssessmentConfig.nextStep.button}
                      <ArrowUpRight className="size-4" aria-hidden />
                    </>
                  )}
                </button>
                <p className="mt-2 font-body text-[12px] text-[#8A8F98]">
                  {staticAssessmentConfig.nextStep.note}
                </p>
              </div>
            </div>
          ) : null}

          {/* Inline results kept for local preview fallback only */}
          {showResults && results ? (
            <div
              id="assessment-results"
              className="mt-8 scroll-mt-32 border-t border-[#E8E4DC] pt-8"
            >
              <p className="font-body text-[11px] font-bold tracking-[0.16em] text-[#8A8F98] uppercase">
                {staticAssessmentConfig.results.eyebrow}
              </p>

              <div className="mt-4">
                <p className="font-body text-[11px] font-bold tracking-[0.14em] text-[#5C5F66] uppercase">
                  {staticAssessmentConfig.results.overallScoreLabel}
                </p>
                <p className="mt-2 font-heading text-[64px] leading-none text-[#001528]">
                  {results.overallScore}
                  <span className="font-body text-[28px] font-bold text-[#5C5F66]">
                    /100
                  </span>
                </p>
              </div>

              {/* Pillar/Section Breakdown */}
              <div className="mt-8 grid gap-4">
                {results.sectionBreakdowns.map((section) =>
                  section.hasScores ? (
                    <div key={section.id}>
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-body text-[13px] font-extrabold tracking-[0.12em] text-[#001528] uppercase">
                          {section.title}
                        </p>
                        <p className="font-body text-[14px] font-bold text-[#001528]">
                          {formatScore(section.score)}
                          <span className="text-[12px] text-[#8A8F98]">
                            {" "}
                            /10
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E8E4DC]">
                        <div
                          className="h-full rounded-full bg-[#b17411] transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(0, (section.score / 10) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : null,
                )}
              </div>

              {/* Statement Scores */}
              <div className="mt-8">
                <h3 className="font-body text-[13px] font-extrabold tracking-[0.14em] text-[#001528] uppercase">
                  Statement Ratings
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {results.scoredQuestions.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-4 border-b border-[#E8E4DC] pb-3"
                    >
                      <div>
                        <p className="font-body text-[15px] font-bold text-[#001528]">
                          {item.number}. {item.prompt}
                        </p>
                        <p className="mt-1 font-body text-[13px] text-[#5C5F66]">
                          {item.section.title}
                        </p>
                      </div>
                      <p className="shrink-0 font-body text-[15px] font-bold text-[#001528]">
                        {item.score}
                        <span className="text-[12px] text-[#8A8F98]"> /10</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Closer Review */}
              <div className="mt-8">
                <h3 className="font-body text-[13px] font-extrabold tracking-[0.14em] text-[#001528] uppercase">
                  {staticAssessmentConfig.results.areasTitle}
                </h3>
                {results.allSame ? (
                  <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    {staticAssessmentConfig.results.areasSameRating}
                  </p>
                ) : results.review.length === 0 ? (
                  <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    All areas received consistently strong ratings across the
                    board.
                  </p>
                ) : (
                  <>
                    <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                      {staticAssessmentConfig.results.relativeReviewNote}
                    </p>
                    <ul className="mt-4 flex flex-col gap-3">
                      {results.review.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start justify-between gap-4 rounded-lg border border-[#b17411]/30 bg-[#b17411]/5 px-3.5 py-3"
                        >
                          <div>
                            <p className="font-body text-[15px] font-bold text-[#001528]">
                              {item.number}. {item.prompt}
                            </p>
                            <p className="mt-1 font-body text-[13px] text-[#5C5F66]">
                              {item.section.title}
                            </p>
                          </div>
                          <p className="shrink-0 font-body text-[15px] font-bold text-[#b17411]">
                            {item.score}
                            <span className="text-[12px] text-[#8A8F98]">
                              {" "}
                              /10
                            </span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Custom Result Text from Authoring / DB */}
              {resultText ? (
                <div className="mt-8 rounded-xl border border-[#E8E4DC] bg-[#FAF9F5] p-5">
                  <h4 className="font-body text-[12px] font-bold tracking-[0.12em] text-[#001528] uppercase">
                    Assessment Summary
                  </h4>
                  <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    {resultText}
                  </p>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={staticAssessmentConfig.results.scheduleHref}
                  className="inline-flex h-[46px] items-center justify-center bg-[#b17411] px-6 font-body text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#8f5d0e]"
                >
                  {staticAssessmentConfig.results.scheduleLabel}
                </Link>
                {settings.allowRetake !== false ? (
                  <button
                    type="button"
                    onClick={resetAssessment}
                    className="inline-flex h-[46px] cursor-pointer items-center justify-center border border-[#E8E4DC] px-6 font-body text-[13px] font-bold tracking-[0.08em] text-[#001528] uppercase transition-colors hover:border-[#b17411]"
                  >
                    {staticAssessmentConfig.results.resetLabel}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        {/* Closing Section */}
        <section className="mx-auto max-w-[720px] px-2 pt-20 text-center">
          <p className="font-body text-[12px] font-bold tracking-[0.18em] text-[#8A8F98] uppercase">
            {staticAssessmentConfig.closing.eyebrow}
          </p>
          <h2 className="mt-4 font-heading text-[32px] leading-tight font-medium text-[#001528] sm:text-[40px]">
            {staticAssessmentConfig.closing.line1}
            <br />
            {staticAssessmentConfig.closing.line2}
          </h2>
          <p className="mx-auto mt-6 max-w-[640px] font-body text-[13px] leading-relaxed text-[#8A8F98]">
            {staticAssessmentConfig.closing.disclaimer}
          </p>
        </section>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// QUESTION INPUT COMPONENTS
// -------------------------------------------------------------

function ScaleQuestionInput({
  question,
  currentValue,
  onChange,
}: {
  question: PublishedQuestion;
  currentValue?: number;
  onChange: (value: number) => void;
}) {
  const scale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const lowLabel = question.lowLabel || "Strongly disagree";
  const highLabel = question.highLabel || "Strongly agree";

  return (
    <fieldset className="w-full">
      <legend className="sr-only">{question.prompt}</legend>
      <div className="grid grid-cols-10 gap-1">
        {scale.map((value) => {
          const isSelected = currentValue === value;
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
                onChange={() => onChange(value)}
                className="sr-only"
              />
              {value}
            </label>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between font-body text-[11px] text-[#8A8F98]">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </fieldset>
  );
}

function YesNoInput({
  currentValue,
  onChange,
}: {
  currentValue?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange(10)}
        className={`h-9 cursor-pointer rounded-md border font-body text-[13px] font-medium transition-colors ${
          currentValue === 10
            ? "border-[#001528] bg-[#001528] text-white"
            : "border-[#E8E4DC] bg-white text-[#001528] hover:border-[#b17411]"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(1)}
        className={`h-9 cursor-pointer rounded-md border font-body text-[13px] font-medium transition-colors ${
          currentValue === 1
            ? "border-[#001528] bg-[#001528] text-white"
            : "border-[#E8E4DC] bg-white text-[#001528] hover:border-[#b17411]"
        }`}
      >
        No
      </button>
    </div>
  );
}

function MultipleChoiceInput({
  question,
  currentValue,
  onChange,
}: {
  question: PublishedQuestion;
  currentValue?: number;
  onChange: (value: number) => void;
}) {
  const options = question.options?.length
    ? question.options
    : ["Option 1", "Option 2"];

  return (
    <div className="flex flex-col gap-1.5">
      {options.map((option, index) => {
        const score = Math.round(((index + 1) / options.length) * 10);
        const isSelected = currentValue === score;

        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 font-body text-[13px] transition-colors ${
              isSelected
                ? "border-[#001528] bg-[#001528] text-white"
                : "border-[#E8E4DC] bg-white text-[#001528] hover:border-[#b17411]"
            }`}
          >
            <span>{option}</span>
            <input
              type="radio"
              name={question.id}
              checked={isSelected}
              onChange={() => onChange(score)}
              className="sr-only"
            />
          </label>
        );
      })}
    </div>
  );
}

function ShortAnswerInput({
  question,
  currentValue,
  onChange,
}: {
  question: PublishedQuestion;
  currentValue: string;
  onChange: (text: string) => void;
}) {
  return (
    <textarea
      rows={2}
      value={currentValue}
      onChange={(e) => onChange(e.target.value)}
      aria-label={question.prompt}
      placeholder="Type your response..."
      className="w-full resize-none rounded-md border border-[#E8E4DC] bg-white px-3 py-2 font-body text-[13px] text-[#001528] outline-none transition-colors placeholder:text-[#8A8F98] focus:border-[#b17411]"
    />
  );
}

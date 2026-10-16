"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/config/site";

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

function formatScore(value: number) {
  return value.toFixed(1);
}

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

function band(score: number) {
  const match = assessment.results.bands.find((item) => score >= item.min);
  return match ?? assessment.results.bands[assessment.results.bands.length - 1];
}

export function SalesAlignmentAssessment() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const answered = Object.keys(scores).length;
  const complete = answered === questions.length;

  const results = useMemo(() => {
    if (!complete) return null;

    const pillars = assessment.pillars.map((pillar) => ({
      ...pillar,
      score: average(pillar.questions.map((question) => scores[question.id])),
    }));

    const overall = average(questions.map((question) => scores[question.id]));
    const scored = questions.map((question) => ({
      ...question,
      score: scores[question.id],
    }));
    const below = scored
      .filter((question) => question.score <= assessment.reviewThreshold)
      .sort((a, b) => a.score - b.score);
    const review =
      below.length > 0
        ? below
        : [...scored]
            .sort((a, b) => a.score - b.score)
            .slice(0, assessment.closestCount);

    return {
      overall,
      pillars,
      review,
      allStrong: below.length === 0,
      summary: band(overall),
    };
  }, [complete, scores]);

  const viewResults = () => {
    if (!complete) {
      const missing = questions.find((question) => scores[question.id] == null);
      setHighlightedId(missing?.id ?? null);
      setShowResults(false);
      if (missing) {
        document.getElementById(missing.id)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setHighlightedId(null);
    setShowResults(true);
    requestAnimationFrame(() => {
      document.getElementById("assessment-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
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

          <div className="mt-4 grid gap-6 border-t border-[#E8E4DC] pt-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="font-body text-[11px] font-bold tracking-[0.16em] text-[#8A8F98] uppercase">
                {assessment.nextStep.eyebrow}
              </p>
              <h2 className="mt-2 font-body text-[22px] font-bold text-[#001528] sm:text-[26px]">
                {assessment.nextStep.title}
              </h2>
              <p className="mt-2 font-body text-[14px] text-[#5C5F66]">
                {assessment.nextStep.subtitle}
              </p>
              {complete ? null : (
                <p className="mt-4 font-body text-[13px] text-[#8A8F98]">
                  {assessment.nextStep.incomplete}
                </p>
              )}
            </div>
            <div className="lg:text-right">
              <button
                type="button"
                onClick={viewResults}
                className="inline-flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 bg-[#001528] px-6 font-body text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#020B1E] sm:w-auto"
              >
                {assessment.nextStep.button}
                <ArrowUpRight className="size-4" aria-hidden />
              </button>
              <p className="mt-2 font-body text-[12px] text-[#8A8F98] lg:text-right">
                {assessment.nextStep.note}
              </p>
            </div>
          </div>

          {showResults && results ? (
            <div
              id="assessment-results"
              className="mt-8 scroll-mt-32 border-t border-[#E8E4DC] pt-8"
            >
              <p className="font-body text-[11px] font-bold tracking-[0.16em] text-[#8A8F98] uppercase">
                {assessment.results.eyebrow}
              </p>
              <div className="mt-4 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-end">
                <div>
                  <p className="font-heading text-[64px] leading-none text-[#001528]">
                    {formatScore(results.overall)}
                  </p>
                  <p className="mt-1 font-body text-[13px] text-[#5C5F66]">
                    {assessment.results.outOf}
                  </p>
                  <p className="mt-3 font-body text-[16px] font-bold text-[#001528]">
                    {results.summary.label}
                  </p>
                </div>
                <p className="max-w-[640px] font-body text-[15px] leading-relaxed text-[#5C5F66]">
                  {results.summary.note}
                </p>
              </div>

              <div className="mt-8 grid gap-4">
                {results.pillars.map((pillar) => (
                  <div key={pillar.number}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-body text-[13px] font-extrabold tracking-[0.12em] text-[#001528] uppercase">
                        {pillar.title}
                      </p>
                      <p className="font-body text-[14px] font-bold text-[#001528]">
                        {formatScore(pillar.score)}
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E8E4DC]">
                      <div
                        className="h-full rounded-full bg-[#b17411]"
                        style={{ width: `${(pillar.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-body text-[13px] font-extrabold tracking-[0.14em] text-[#001528] uppercase">
                  {assessment.results.areasTitle}
                </h3>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                  {results.allStrong
                    ? assessment.results.areasStrong
                    : assessment.results.areasBelow}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {results.review.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-4 border-b border-[#E8E4DC] pb-3"
                    >
                      <div>
                        <p className="font-body text-[15px] font-bold text-[#001528]">
                          {item.number}. {item.title}
                        </p>
                        <p className="mt-1 font-body text-[13px] text-[#5C5F66]">
                          {item.pillar.title}
                        </p>
                      </div>
                      <p className="font-body text-[15px] font-bold text-[#001528]">
                        {item.score}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={assessment.results.scheduleHref}
                  className="inline-flex h-[46px] items-center justify-center bg-[#b17411] px-6 font-body text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#8f5d0e]"
                >
                  {assessment.results.scheduleLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setScores({});
                    setShowResults(false);
                    setHighlightedId(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex h-[46px] cursor-pointer items-center justify-center border border-[#E8E4DC] px-6 font-body text-[13px] font-bold tracking-[0.08em] text-[#001528] uppercase transition-colors hover:border-[#b17411]"
                >
                  {assessment.results.resetLabel}
                </button>
              </div>
            </div>
          ) : null}
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

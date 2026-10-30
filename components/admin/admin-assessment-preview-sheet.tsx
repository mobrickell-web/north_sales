"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { siteConfig } from "@/config/site";
import { AdminAssessmentSideSheet } from "@/components/shared/admin-assessment-side-sheet";
import type {
  AdminAssessmentDocument,
  AdminAssessmentQuestion,
} from "@/lib/admin-assessment-store";

export type AdminAssessmentSectionDraft = {
  title: string;
  description: string;
  instructions: string;
  position: number;
};

const assessmentCopy = siteConfig.salesAlignmentAssessment;
type NewQuestionType = Extract<
  AdminAssessmentQuestion["type"],
  "five-point-scale" | "yes-no" | "multiple-choice"
>;
const newQuestionTypes: { value: NewQuestionType; label: string }[] = [
  { value: "five-point-scale", label: "5-point scale" },
  { value: "yes-no", label: "Yes / No" },
  { value: "multiple-choice", label: "Multiple choice" },
];

export function AdminAssessmentPreviewSheet({
  assessment,
  onClose,
  onCreateQuestion,
  onCreateSection,
  initialMode = "preview",
  initialSectionId,
}: {
  assessment: AdminAssessmentDocument;
  onClose: () => void;
  onCreateQuestion: (
    question: Omit<AdminAssessmentQuestion, "id">,
    sectionId: string,
  ) => void;
  onCreateSection: (section: AdminAssessmentSectionDraft) => void;
  initialMode?: "preview" | "add-question" | "add-section";
  initialSectionId?: string;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mode, setMode] = useState(initialMode);
  const [sectionId, setSectionId] = useState(
    initialSectionId ?? assessment.sections[0]?.id ?? "",
  );
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false);
  const sectionDropdownRef = useRef<HTMLDivElement>(null);
  const [questionPrompt, setQuestionPrompt] = useState("");
  const [questionType, setQuestionType] =
    useState<NewQuestionType>("five-point-scale");
  const [required, setRequired] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [lowLabel, setLowLabel] = useState("Strongly disagree");
  const [highLabel, setHighLabel] = useState("Strongly agree");
  const [options, setOptions] = useState(["Option 1", "Option 2"]);
  const [sectionTitle, setSectionTitle] = useState(
    `Section ${assessment.sections.length + 1}`,
  );
  const [sectionDescription, setSectionDescription] = useState("");
  const [sectionInstructions, setSectionInstructions] = useState("");
  const [sectionPosition, setSectionPosition] = useState(
    assessment.sections.length + 1,
  );
  const [positionMenuOpen, setPositionMenuOpen] = useState(false);
  const positionDropdownRef = useRef<HTMLDivElement>(null);
  const questions = useMemo(
    () =>
      assessment.sections.flatMap((section) =>
        section.questions.map((question) => ({ ...question, section })),
      ),
    [assessment.sections],
  );
  const answeredCount = Object.keys(answers).length;
  const addingQuestion = mode === "add-question";
  const addingSection = mode === "add-section";
  const saveQuestion = (addAnother: boolean) => {
    if (!questionPrompt.trim() || !sectionId) return;
    onCreateQuestion(
      {
        prompt: questionPrompt.trim(),
        type: questionType,
        required,
        helperText: helperText.trim() || undefined,
        ...(questionType === "five-point-scale"
          ? {
              lowLabel: lowLabel.trim() || "Strongly disagree",
              highLabel: highLabel.trim() || "Strongly agree",
            }
          : {}),
        ...(questionType === "multiple-choice"
          ? { options: options.map((option) => option.trim()).filter(Boolean) }
          : {}),
      },
      sectionId,
    );
    if (addAnother) {
      setQuestionPrompt("");
      setHelperText("");
      return;
    }
    onClose();
  };

  const saveSection = () => {
    if (!sectionTitle.trim()) return;
    onCreateSection({
      title: sectionTitle.trim(),
      description: sectionDescription.trim(),
      instructions: sectionInstructions.trim(),
      position: sectionPosition,
    });
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (sectionMenuOpen || positionMenuOpen) {
          setSectionMenuOpen(false);
          setPositionMenuOpen(false);
        } else {
          onClose();
        }
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !sectionDropdownRef.current?.contains(event.target) &&
        !positionDropdownRef.current?.contains(event.target)
      ) {
        setSectionMenuOpen(false);
        setPositionMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [onClose, positionMenuOpen, sectionMenuOpen]);

  return (
    <AdminAssessmentSideSheet
      title={
        addingQuestion
          ? "Add question"
          : addingSection
            ? "Add section"
            : "Preview"
      }
      description={
        addingSection
          ? "Organize questions into a section for your respondents."
          : "Respondents answer each question once. Points add up to the section score."
      }
      labelledBy="assessment-preview-title"
      closeLabel={`Close ${addingQuestion ? "add question" : addingSection ? "add section" : "preview"}`}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={() => (addingQuestion ? setMode("preview") : onClose())}
            className="h-9 cursor-pointer rounded-lg px-2 text-[12px] font-medium text-admin-text hover:bg-admin-soft sm:px-4 sm:text-[13px]"
          >
            Cancel
          </button>
          {addingQuestion ? (
            <>
              <button
                type="button"
                disabled={!questionPrompt.trim() || !sectionId}
                onClick={() => saveQuestion(true)}
                className="h-9 cursor-pointer rounded-lg border border-admin-border-strong px-2.5 text-[12px] font-medium whitespace-nowrap text-admin-text-strong hover:bg-admin-soft disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-[13px]"
              >
                Save &amp; add another
              </button>
              <button
                type="button"
                disabled={!questionPrompt.trim() || !sectionId}
                onClick={() => saveQuestion(false)}
                className="h-9 cursor-pointer rounded-lg bg-admin-assessment-gold px-2.5 text-[12px] font-semibold whitespace-nowrap text-admin-surface hover:bg-admin-assessment-gold-hover disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-[13px]"
              >
                Add question
              </button>
            </>
          ) : addingSection ? (
            <button
              type="button"
              onClick={saveSection}
              disabled={!sectionTitle.trim()}
              className="h-9 cursor-pointer rounded-lg bg-admin-assessment-gold px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover disabled:cursor-not-allowed disabled:opacity-50 sm:text-[13px]"
            >
              Save Section
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode("add-question")}
              className="h-9 cursor-pointer rounded-lg bg-admin-assessment-gold px-3 text-[12px] font-semibold whitespace-nowrap text-admin-surface hover:bg-admin-assessment-gold-hover sm:px-4 sm:text-[13px]"
            >
              Add question
            </button>
          )}
        </>
      }
    >
      {addingQuestion ? (
        <div className="space-y-4 py-4">
          <div className="grid gap-1.5 text-[13px] font-semibold text-admin-text-strong">
            Section
            <div ref={sectionDropdownRef} className="relative">
              <button
                type="button"
                aria-label="Section"
                aria-haspopup="listbox"
                aria-expanded={sectionMenuOpen}
                aria-controls="assessment-section-options"
                onClick={() => setSectionMenuOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSectionMenuOpen(false);
                  }
                }}
                className="flex h-[42px] w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-admin-border-strong bg-admin-surface px-3.5 text-left text-[14px] font-normal text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info"
              >
                <span className="min-w-0 truncate">
                  {assessment.sections.find(
                    (section) => section.id === sectionId,
                  )?.title ?? "Select a section"}
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-admin-muted transition-transform ${
                    sectionMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {sectionMenuOpen ? (
                <div
                  id="assessment-section-options"
                  role="listbox"
                  aria-label="Assessment sections"
                  className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full overflow-y-auto rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
                >
                  {assessment.sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      role="option"
                      aria-selected={sectionId === section.id}
                      onClick={() => {
                        setSectionId(section.id);
                        setSectionMenuOpen(false);
                      }}
                      className={`block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-admin-info ${
                        sectionId === section.id
                          ? "bg-admin-navy font-medium text-admin-surface"
                          : "text-admin-text-strong hover:bg-admin-soft"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <label className="grid gap-1.5 text-[13px] font-semibold text-admin-text-strong">
            Question
            <textarea
              rows={3}
              maxLength={160}
              value={questionPrompt}
              onChange={(event) => setQuestionPrompt(event.target.value)}
              placeholder="e.g. I can describe the kind of role I want next."
              className="w-full resize-none rounded-lg border border-admin-border-strong bg-admin-surface px-3 py-2.5 text-[14px] font-normal text-admin-text-strong outline-none placeholder:text-admin-muted focus:border-admin-info"
            />
            <span className="text-right text-[11px] font-normal text-admin-muted">
              {questionPrompt.length} / 160
            </span>
          </label>

          <fieldset className="grid gap-1.5">
            <legend className="text-[13px] font-semibold text-admin-text-strong">
              Answer type
            </legend>
            <div className="grid grid-cols-3 rounded-lg bg-admin-soft p-1">
              {newQuestionTypes.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={questionType === option.value}
                  onClick={() => setQuestionType(option.value)}
                  className={`min-h-9 rounded-md px-1 text-[12px] font-medium transition-colors ${
                    questionType === option.value
                      ? "bg-admin-surface text-admin-text-strong shadow-admin-card"
                      : "text-admin-muted hover:text-admin-text-strong"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          {questionType === "five-point-scale" ? (
            <div className="rounded-lg border border-admin-border px-2.5 py-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-[12px] font-medium text-admin-text-strong">
                  Label for 1
                  <input
                    value={lowLabel}
                    onChange={(event) => setLowLabel(event.target.value)}
                    className="h-9 min-w-0 rounded-md border border-admin-border-strong px-2 text-[12px] font-normal outline-none focus:border-admin-info"
                  />
                </label>
                <label className="grid gap-1 text-[12px] font-medium text-admin-text-strong">
                  Label for 10
                  <input
                    value={highLabel}
                    onChange={(event) => setHighLabel(event.target.value)}
                    className="h-9 min-w-0 rounded-md border border-admin-border-strong px-2 text-[12px] font-normal outline-none focus:border-admin-info"
                  />
                </label>
              </div>
              <p className="mt-2.5 text-[10px] font-medium tracking-wide text-admin-muted uppercase">
                Respondent sees
              </p>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {Array.from({ length: 10 }, (_, index) => {
                  const value = index + 1;
                  return (
                    <div
                      key={value}
                      className="flex min-h-10 flex-col items-center justify-center rounded-md border border-admin-border-strong text-[12px] font-semibold text-admin-text-strong"
                    >
                      {value}
                      <span className="text-[10px] font-normal text-admin-muted">
                        {((value - 1) % 5) + 1} pt
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-1 flex justify-end text-[10px] text-green-600">
                {highLabel || "Strongly agree"}
              </div>
            </div>
          ) : null}

          {questionType === "multiple-choice" ? (
            <fieldset className="grid gap-2">
              <legend className="text-[13px] font-semibold text-admin-text-strong">
                Answer options
              </legend>
              {options.map((option, index) => (
                <input
                  key={index}
                  value={option}
                  aria-label={`Answer option ${index + 1}`}
                  onChange={(event) =>
                    setOptions((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    )
                  }
                  className="h-9 rounded-md border border-admin-border-strong px-2.5 text-[13px] outline-none focus:border-admin-info"
                />
              ))}
              <button
                type="button"
                onClick={() => setOptions((current) => [...current, ""])}
                className="w-fit text-[12px] font-medium text-admin-info hover:underline"
              >
                + Add option
              </button>
            </fieldset>
          ) : null}

          {questionType === "yes-no" ? (
            <div className="grid grid-cols-2 gap-2">
              {["Yes", "No"].map((answer) => (
                <div
                  key={answer}
                  className="rounded-md border border-admin-border-strong px-3 py-2.5 text-center text-[13px] text-admin-text-strong"
                >
                  {answer}
                </div>
              ))}
            </div>
          ) : null}

          <label className="flex items-start gap-2 text-[13px] text-admin-text-strong">
            <input
              type="checkbox"
              checked={required}
              onChange={(event) => setRequired(event.target.checked)}
              className="mt-0.5 size-3.5 accent-admin-info"
            />
            <span>
              <span className="block font-semibold">Required</span>
              <span className="block text-[12px] text-admin-muted">
                Respondents can’t continue without answering.
              </span>
            </span>
          </label>

          <label className="grid gap-1.5 text-[12px] font-semibold text-admin-text-strong">
            Helper text
            <span className="text-[11px] font-normal text-admin-muted">
              Optional. Shown under the question.
            </span>
            <input
              value={helperText}
              onChange={(event) => setHelperText(event.target.value)}
              placeholder="e.g. Think about the last six months."
              className="h-10 rounded-md border border-admin-border-strong px-3 text-[13px] font-normal outline-none placeholder:text-admin-muted focus:border-admin-info"
            />
          </label>
        </div>
      ) : addingSection ? (
        <div className="space-y-4 py-4">
          <label className="grid gap-1.5 text-[13px] font-semibold text-admin-text-strong">
            Section
            <input
              autoFocus
              maxLength={80}
              value={sectionTitle}
              onChange={(event) => setSectionTitle(event.target.value)}
              placeholder="Section name"
              className="h-10 w-full rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[14px] font-normal text-admin-text-strong outline-none placeholder:text-admin-muted focus:border-admin-info"
            />
          </label>

          <label className="grid gap-1.5 text-[13px] font-semibold text-admin-text-strong">
            Description
            <textarea
              rows={3}
              maxLength={160}
              value={sectionDescription}
              onChange={(event) => setSectionDescription(event.target.value)}
              placeholder="e.g. I can describe the kind of role I want next."
              className="w-full resize-none rounded-lg border border-admin-border-strong bg-admin-surface px-3 py-2.5 text-[14px] font-normal text-admin-text-strong outline-none placeholder:text-admin-muted focus:border-admin-info"
            />
            <span className="text-right text-[11px] font-normal text-admin-muted">
              {sectionDescription.length} / 160
            </span>
          </label>

          <div className="grid gap-1.5 text-[13px] font-semibold text-admin-text-strong">
            Position
            <div ref={positionDropdownRef} className="relative">
              <button
                type="button"
                aria-label="Section position"
                aria-haspopup="listbox"
                aria-expanded={positionMenuOpen}
                aria-controls="section-position-options"
                onClick={() => setPositionMenuOpen((open) => !open)}
                className="flex h-[42px] w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-admin-border-strong bg-admin-surface px-3.5 text-left text-[14px] font-normal text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info"
              >
                <span>{sectionPosition}</span>
                <ChevronDown
                  className={`size-4 shrink-0 text-admin-muted transition-transform ${
                    positionMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {positionMenuOpen ? (
                <div
                  id="section-position-options"
                  role="listbox"
                  aria-label="Section position"
                  className="absolute top-[calc(100%+6px)] left-0 z-30 max-h-60 w-full overflow-y-auto rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg"
                >
                  {Array.from(
                    { length: assessment.sections.length + 1 },
                    (_, index) => {
                      const option = index + 1;
                      return (
                        <button
                          key={option}
                          type="button"
                          role="option"
                          aria-selected={sectionPosition === option}
                          onClick={() => {
                            setSectionPosition(option);
                            setPositionMenuOpen(false);
                          }}
                          className={`block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-admin-info ${
                            sectionPosition === option
                              ? "bg-admin-navy font-medium text-admin-surface"
                              : "text-admin-text-strong hover:bg-admin-soft"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    },
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <label className="grid gap-1.5 text-[13px] font-semibold text-admin-text-strong">
            Instructions
            <textarea
              rows={3}
              maxLength={160}
              value={sectionInstructions}
              onChange={(event) => setSectionInstructions(event.target.value)}
              placeholder="e.g. Think about a recent project when answering."
              className="w-full resize-none rounded-lg border border-admin-border-strong bg-admin-surface px-3 py-2.5 text-[14px] font-normal text-admin-text-strong outline-none placeholder:text-admin-muted focus:border-admin-info"
            />
            <span className="text-right text-[11px] font-normal text-admin-muted">
              {sectionInstructions.length} / 160
            </span>
          </label>
        </div>
      ) : (
        <>
          <div className="border-b border-admin-border py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-bold text-admin-text-strong">
                  {assessmentCopy.form.title}
                </h3>
                <p className="mt-1 text-[10px] text-admin-muted">
                  {assessmentCopy.form.scaleLow} ={" "}
                  {assessmentCopy.form.scaleLowLabel}
                  <span className="mx-1.5 text-admin-assessment-gold">·</span>
                  {assessmentCopy.form.scaleHigh} ={" "}
                  {assessmentCopy.form.scaleHighLabel}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-admin-border px-2 py-1 text-[9px] text-admin-muted">
                {answeredCount} of {questions.length} answered
              </span>
            </div>
            <p className="mt-3 border-t border-admin-border pt-3 text-[10px] leading-relaxed text-admin-muted">
              {assessment.settings.introduction || assessmentCopy.form.guidance}
            </p>
          </div>

          <div className="divide-y divide-admin-border">
            {assessment.sections.map((section, sectionIndex) => (
              <section key={section.id} className="py-4">
                <div className="flex items-start gap-2.5 border-l-2 border-admin-assessment-gold pl-3">
                  <span className="font-heading text-[24px] leading-none text-admin-assessment-gold">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-[10px] font-extrabold tracking-[0.12em] text-admin-text-strong uppercase">
                      {section.title}
                    </h3>
                    {section.description ? (
                      <p className="mt-0.5 text-[10px] text-admin-muted">
                        {section.description}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-[10px] text-admin-muted">
                        {section.questions.length} questions
                      </p>
                    )}
                  </div>
                </div>
                {section.instructions ? (
                  <p className="mt-2 text-[10px] leading-relaxed text-admin-muted">
                    {section.instructions}
                  </p>
                ) : null}

                <div className="mt-2">
                  {section.questions.map((question, questionIndex) => {
                    const questionNumber =
                      assessment.sections
                        .slice(0, sectionIndex)
                        .reduce(
                          (count, previous) =>
                            count + previous.questions.length,
                          0,
                        ) +
                      questionIndex +
                      1;
                    const selected = answers[question.id];

                    return (
                      <div
                        key={question.id}
                        className="grid gap-2 border-b border-admin-border py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(220px,1fr)] sm:items-center sm:gap-4"
                      >
                        <div className="min-w-0">
                          <h4 className="text-[11px] font-bold leading-snug text-admin-text-strong">
                            {questionNumber}. {question.prompt}
                          </h4>
                          <p className="mt-1 text-[10px] leading-relaxed text-admin-muted">
                            {question.required ? "Required" : "Optional"}
                            {question.type !== "scale"
                              ? ` · ${question.type === "five-point-scale" ? "5-point scale" : question.type === "yes-no" ? "Yes / No" : question.type === "short-answer" ? "Short answer" : "Multiple choice"}`
                              : ""}
                          </p>
                          {question.helperText ? (
                            <p className="mt-1 text-[9px] text-admin-muted">
                              {question.helperText}
                            </p>
                          ) : null}
                        </div>

                        {question.type === "scale" ||
                        question.type === "five-point-scale" ? (
                          <fieldset>
                            <legend className="sr-only">
                              {question.prompt}
                            </legend>
                            <div className="grid grid-cols-10 gap-0.5">
                              {(question.type === "scale"
                                ? assessmentCopy.scale
                                : Array.from({ length: 10 }, (_, i) => i + 1)
                              ).map((value) => (
                                <label
                                  key={value}
                                  className={`flex h-7 min-w-0 cursor-pointer items-center justify-center rounded-[3px] border text-[9px] transition-colors ${
                                    selected === value
                                      ? "border-admin-navy bg-admin-navy text-admin-surface"
                                      : "border-admin-border-strong bg-admin-surface text-admin-text-strong hover:border-admin-assessment-gold"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`preview-${question.id}`}
                                    value={value}
                                    checked={selected === value}
                                    onChange={() =>
                                      setAnswers((current) => ({
                                        ...current,
                                        [question.id]: value,
                                      }))
                                    }
                                    className="sr-only"
                                  />
                                  {value}
                                  {question.type === "five-point-scale" ? (
                                    <span className="text-[7px] text-admin-muted">
                                      {((value - 1) % 5) + 1} pt
                                    </span>
                                  ) : null}
                                </label>
                              ))}
                            </div>
                            <div className="mt-1 flex justify-between text-[8px] text-admin-muted">
                              <span>
                                {question.lowLabel ||
                                  assessmentCopy.form.scaleLowLabel}
                              </span>
                              <span>
                                {question.highLabel ||
                                  assessmentCopy.form.scaleHighLabel}
                              </span>
                            </div>
                          </fieldset>
                        ) : question.type === "yes-no" ? (
                          <div className="grid grid-cols-2 gap-1.5">
                            {["Yes", "No"].map((answer) => (
                              <button
                                key={answer}
                                type="button"
                                className="h-7 rounded-md border border-admin-border-strong text-[10px] text-admin-text-strong hover:border-admin-assessment-gold"
                              >
                                {answer}
                              </button>
                            ))}
                          </div>
                        ) : question.type === "short-answer" ? (
                          <textarea
                            aria-label={`Preview response for question ${questionNumber}`}
                            rows={2}
                            placeholder="Your response"
                            className="w-full resize-none rounded-md border border-admin-border-strong px-2.5 py-2 text-[11px] text-admin-text outline-none focus:border-admin-info"
                          />
                        ) : (
                          <div
                            aria-label={`Preview response for question ${questionNumber}`}
                            className="rounded-md border border-admin-border-strong px-2.5 py-2 text-[10px] text-admin-muted"
                          >
                            {question.options?.join(" · ") ||
                              "Multiple-choice response options will appear here."}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </AdminAssessmentSideSheet>
  );
}

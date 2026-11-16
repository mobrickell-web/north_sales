import { adminFetch } from "@/lib/auth-api";
import type { ClientSafeAssessmentResult } from "@/lib/client-assessment-api";

export const SALES_ALIGNMENT_ASSESSMENT = "sales-alignment";

export type SalesAlignmentStatementResult = {
  id: string;
  number: number;
  title: string;
  prompt: string;
  pillarNumber: string;
  pillarTitle: string;
  score: number;
  maxScore: number;
};

export type SalesAlignmentPillarResult = {
  number: string;
  title: string;
  description: string;
  score: number;
  maxScore: number;
  statementIds: string[];
};

// Everything the results dashboard renders, captured at submission time so a
// stored result keeps its wording even if the assessment copy changes later.
export type SalesAlignmentResultPayload = {
  version: 1;
  title: string;
  overall: { score: number; maxScore: number };
  pillars: SalesAlignmentPillarResult[];
  statements: SalesAlignmentStatementResult[];
  closerReview: {
    allSame: boolean;
    showRelativeNote: boolean;
    statements: SalesAlignmentStatementResult[];
  };
  copy: {
    eyebrow: string;
    overallScoreLabel: string;
    overallScoreSuffix: string;
    pillarScoreSuffix: string;
    statementScoresTitle: string;
    areasTitle: string;
    areasSameRating: string;
    relativeReviewNote: string;
    disclaimer: string;
    scheduleLabel: string;
  };
};

export type AssessmentResultSummary = {
  id: string;
  assessment: string;
  firstName: string;
  email: string;
  overallScore: number;
  maxScore: number;
  createdAt: string;
};

export type AssessmentResultDetail = AssessmentResultSummary & {
  answers: Record<string, number>;
  result: unknown;
};

export type SubmitAssessmentResultInput = {
  assessment: typeof SALES_ALIGNMENT_ASSESSMENT;
  firstName: string;
  email: string;
  overallScore: number;
  maxScore: number;
  answers: Record<string, number>;
  result: SalesAlignmentResultPayload;
};

export function submitAssessmentResult(input: SubmitAssessmentResultInput) {
  return adminFetch<{ id: string }>("/api/v1/assessment-results", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listMyAssessmentResults() {
  return adminFetch<AssessmentResultSummary[]>(
    "/api/v1/assessment-results/mine",
  );
}

export function getAssessmentResult(id: string) {
  return adminFetch<AssessmentResultDetail>(
    `/api/v1/assessment-results/${encodeURIComponent(id)}`,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Stored results are free-form JSON; only render ones in the expected shape.
export function parseSalesAlignmentResult(
  value: unknown,
): SalesAlignmentResultPayload | null {
  if (!isRecord(value)) return null;
  if (
    !isRecord(value.overall) ||
    !Array.isArray(value.pillars) ||
    !Array.isArray(value.statements) ||
    !isRecord(value.closerReview) ||
    !Array.isArray(value.closerReview.statements) ||
    !isRecord(value.copy)
  ) {
    return null;
  }
  return value as SalesAlignmentResultPayload;
}

const CLIENT_RESULT_COPY: SalesAlignmentResultPayload["copy"] = {
  eyebrow: "Results",
  overallScoreLabel: "Overall score",
  overallScoreSuffix: "/100",
  pillarScoreSuffix: "/10",
  statementScoresTitle: "Statement scores",
  areasTitle: "Areas for closer review",
  areasSameRating:
    "All scored responses were equal, so no closer-review items were highlighted.",
  relativeReviewNote:
    "These statements scored lower relative to your other responses.",
  disclaimer:
    "These results summarize your responses for discussion with NORTH POINT SALES GROUP. They are not a clinical diagnosis.",
  scheduleLabel: "Schedule a conversation",
};

/** Map paying-client instance scoring into the main results dashboard payload. */
export function clientSafeResultToSalesAlignmentPayload(
  title: string,
  result: ClientSafeAssessmentResult,
): SalesAlignmentResultPayload {
  const pillars: SalesAlignmentPillarResult[] = result.sectionBreakdowns.map(
    (section) => ({
      number: section.number,
      title: section.title,
      description: section.description ?? "",
      score: section.score,
      maxScore: 10,
      statementIds: result.scoredQuestions
        .filter((question) => question.sectionId === section.id)
        .map((question) => question.id),
    }),
  );

  const statements: SalesAlignmentStatementResult[] =
    result.scoredQuestions.map((question) => ({
      id: question.id,
      number: question.number,
      title: statementTitle(question.prompt, question.number),
      prompt: question.prompt,
      pillarNumber:
        result.sectionBreakdowns.find(
          (section) => section.id === question.sectionId,
        )?.number ?? "",
      pillarTitle: question.sectionTitle,
      score: question.score,
      maxScore: 10,
    }));

  const closerStatements: SalesAlignmentStatementResult[] = result.review.map(
    (item) => ({
      id: item.id,
      number: item.number,
      title: statementTitle(item.prompt, item.number),
      prompt: item.prompt,
      pillarNumber: "",
      pillarTitle: item.sectionTitle,
      score: item.score,
      maxScore: 10,
    }),
  );

  return {
    version: 1,
    title,
    overall: { score: result.overallScore, maxScore: 100 },
    pillars,
    statements,
    closerReview: {
      allSame: result.allSame,
      showRelativeNote: !result.allSame && closerStatements.length > 0,
      statements: closerStatements,
    },
    copy: CLIENT_RESULT_COPY,
  };
}

function statementTitle(prompt: string, number: number) {
  const cleaned = prompt.trim().replace(/\s+/g, " ");
  if (!cleaned) return `Statement ${number}`;
  if (cleaned.length <= 72) return cleaned;
  return `${cleaned.slice(0, 69).trimEnd()}…`;
}

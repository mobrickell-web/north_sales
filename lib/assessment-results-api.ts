import { adminFetch } from "@/lib/auth-api";

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

import { adminFetch } from "@/lib/auth-api";

export type ClientAssessmentQuestion = {
  id: string;
  prompt: string;
  type:
    | "scale"
    | "five-point-scale"
    | "yes-no"
    | "short-answer"
    | "multiple-choice"
    | string;
  required: boolean;
  helperText?: string;
  lowLabel?: string;
  highLabel?: string;
  options?: string[];
};

export type ClientAssessmentSection = {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  questions: ClientAssessmentQuestion[];
};

export type ClientAssessmentDocument = {
  resultText: string;
  settings: { introduction: string; allowRetake: boolean };
  sections: ClientAssessmentSection[];
};

export type ClientSafeAssessmentResult = {
  overallScore: number;
  sectionBreakdowns: Array<{
    id: string;
    number: string;
    title: string;
    description?: string;
    score: number;
    hasScores: boolean;
  }>;
  scoredQuestions: Array<{
    id: string;
    number: number;
    prompt: string;
    sectionId: string;
    sectionTitle: string;
    score: number;
  }>;
  review: Array<{
    id: string;
    number: number;
    prompt: string;
    sectionTitle: string;
    score: number;
  }>;
  allSame: boolean;
  resultText: string;
};

export type ClientAssessmentHistoryItem = {
  instanceId: string;
  assessmentId: string;
  assessmentSlug: string;
  assessmentTitle: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | string;
  submittedAt: string | null;
  createdAt: string;
  overallScore: number | null;
};

export type ClientAssessmentPayload = {
  instance: {
    id: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | string;
    submittedAt: string | null;
    completedBy: string | null;
    onBehalfOf: string | null;
  } | null;
  assessment: {
    id: string;
    slug: string;
    title: string;
    document: ClientAssessmentDocument;
  };
  result: ClientSafeAssessmentResult | null;
  history?: ClientAssessmentHistoryItem[];
};

export function getClientAssessment(options: { slug?: string } = {}) {
  const query = new URLSearchParams();
  if (options.slug?.trim()) query.set("slug", options.slug.trim());
  const qs = query.toString();
  return adminFetch<ClientAssessmentPayload>(
    `/api/v1/client/assessment${qs ? `?${qs}` : ""}`,
  );
}

export function getClientAssessmentInstance(instanceId: string) {
  return adminFetch<ClientAssessmentPayload>(
    `/api/v1/client/assessment/instances/${encodeURIComponent(instanceId)}`,
  );
}

export function startClientAssessment(
  body: {
    assessmentId?: string;
    slug?: string;
  } = {},
) {
  return adminFetch<ClientAssessmentPayload>(
    "/api/v1/client/assessment/start",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

export function submitClientAssessment(
  instanceId: string,
  answers: Record<string, number | string | boolean>,
) {
  return adminFetch<ClientAssessmentPayload>(
    `/api/v1/client/assessment/${encodeURIComponent(instanceId)}/submit`,
    {
      method: "POST",
      body: JSON.stringify({ answers }),
    },
  );
}

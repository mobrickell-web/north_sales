import { adminFetch } from "@/lib/auth-api";
import type { ClientAssessmentPayload } from "@/lib/client-assessment-api";

export type OnBehalfAssessmentPayload = ClientAssessmentPayload;

export function getOnBehalfAssessment(token: string) {
  return adminFetch<OnBehalfAssessmentPayload>(
    `/api/v1/on-behalf/${encodeURIComponent(token)}`,
  );
}

export function submitOnBehalfAssessment(
  token: string,
  answers: Record<string, number | string | boolean>,
) {
  return adminFetch<OnBehalfAssessmentPayload>(
    `/api/v1/on-behalf/${encodeURIComponent(token)}/submit`,
    {
      method: "POST",
      body: JSON.stringify({ answers }),
    },
  );
}

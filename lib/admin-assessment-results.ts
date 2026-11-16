import { adminFetch } from "@/lib/auth-api";
import type { ClientSafeAssessmentResult } from "@/lib/client-assessment-api";

export type AdminAssessmentInstanceSummary = {
  id: string;
  clientId: string;
  assessmentId: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | string;
  submittedAt: string | null;
  createdAt: string;
  completedBy: string | null;
  onBehalfOf: string | null;
  assessment: {
    id: string;
    slug: string;
    title: string;
  };
};

export type AdminAssessmentInstanceDetail = AdminAssessmentInstanceSummary & {
  client: {
    id: string;
    name: string;
    email: string;
  };
  tokenExpiresAt: string | null;
  hasActiveOnBehalfToken: boolean;
  result: ClientSafeAssessmentResult | null;
};

export type OnBehalfTokenResponse = {
  instanceId: string;
  clientId: string;
  token: string;
  expiresAt: string;
  path: string;
  apiPath?: string;
};

export function listClientAssessmentInstances(clientId: string) {
  return adminFetch<AdminAssessmentInstanceSummary[]>(
    `/api/v1/admin/clients/${encodeURIComponent(clientId)}/instances`,
  );
}

export function getAdminAssessmentInstance(instanceId: string) {
  return adminFetch<AdminAssessmentInstanceDetail>(
    `/api/v1/admin/instances/${encodeURIComponent(instanceId)}`,
  );
}

export function createClientAssessmentInstance(
  clientId: string,
  body: { slug?: string; assessmentId?: string },
) {
  return adminFetch<AdminAssessmentInstanceSummary>(
    `/api/v1/admin/clients/${encodeURIComponent(clientId)}/instances`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

export function issueOnBehalfToken(instanceId: string) {
  return adminFetch<OnBehalfTokenResponse>(
    `/api/v1/admin/instances/${encodeURIComponent(instanceId)}/on-behalf`,
    { method: "POST" },
  );
}

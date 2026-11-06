import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResultsDashboard } from "@/components/client/results-dashboard";
import {
  type AssessmentResultDetail,
  parseSalesAlignmentResult,
} from "@/lib/assessment-results-api";
import {
  ServerApiError,
  getAccountHomePath,
  requireAccount,
  serverApiFetch,
} from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Assessment Results · North Point Sales Group",
  robots: { index: false, follow: false },
};

type LoadedResult =
  | { status: "ok"; result: AssessmentResultDetail }
  | { status: "not-found" }
  | { status: "error"; message: string };

async function loadResult(id: string): Promise<LoadedResult> {
  try {
    const result = await serverApiFetch<AssessmentResultDetail>(
      `/api/v1/assessment-results/${encodeURIComponent(id)}`,
    );
    return { status: "ok", result };
  } catch (cause) {
    if (cause instanceof ServerApiError) {
      if (cause.status === 401) redirect("/login");
      if (
        cause.status === 404 ||
        cause.status === 403 ||
        cause.status === 400
      ) {
        return { status: "not-found" };
      }
    }
    return {
      status: "error",
      message: "We could not load these results. Please refresh the page.",
    };
  }
}

export default async function AssessmentResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const account = await requireAccount();
  const { id } = await params;
  const loaded = await loadResult(id);

  const viewer = {
    name: account.name,
    email: account.email,
    role: account.role,
    homePath: getAccountHomePath(account),
  };

  if (loaded.status !== "ok") {
    return (
      <ResultsDashboard
        viewer={viewer}
        state={
          loaded.status === "not-found"
            ? { kind: "not-found" }
            : { kind: "error", message: loaded.message }
        }
      />
    );
  }

  const payload = parseSalesAlignmentResult(loaded.result.result);

  return (
    <ResultsDashboard
      viewer={viewer}
      state={
        payload
          ? {
              kind: "ok",
              record: {
                id: loaded.result.id,
                firstName: loaded.result.firstName,
                email: loaded.result.email,
                overallScore: loaded.result.overallScore,
                maxScore: loaded.result.maxScore,
                createdAt: loaded.result.createdAt,
              },
              payload,
            }
          : {
              kind: "error",
              message: "These results were saved in a format we can't display.",
            }
      }
    />
  );
}

import { headers } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type ClientBaseline = {
  id: string;
  metricKey: string;
  label: string;
  value: number;
  unit: string | null;
  measuredAt: string;
  source: string | null;
};

export type ClientImprovement = {
  id: string;
  title: string;
  description: string | null;
  ownerName: string | null;
  ownerSide: string | null;
  status: "AGREED" | "IN_PROGRESS" | "DONE";
  targetDate: string | null;
  agreedAt: string | null;
};

export type ClientKpi = {
  id: string;
  metricKey: string;
  value: number;
  measuredAt: string;
  target: number | null;
};

export type ClientMilestone = {
  id: string;
  title: string;
  startDate: string | null;
  dueDate: string | null;
  ownerName: string | null;
  ownerSide: string | null;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
};

export type ClientReport = {
  id: string;
  title: string;
  type: "QUARTERLY" | "FINAL" | "OTHER";
  period: string;
  publishedAt: string | null;
  summary: string | null;
  originalFileName: string | null;
  contentType: string | null;
  canDownload: boolean;
};

export type ClientDashboardAssessment = {
  instanceId: string | null;
  assessmentId: string;
  assessmentTitle: string;
  assessmentSlug: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED" | string;
  submittedAt: string | null;
  result: {
    overallScore: number;
    sectionBreakdowns: Array<{
      id: string;
      number: string;
      title: string;
      score: number;
      hasScores?: boolean;
    }>;
    reviewCount: number;
    allSame: boolean;
  } | null;
};

export type ClientDashboardAssessmentHistoryItem = {
  instanceId: string;
  assessmentId: string;
  assessmentTitle: string;
  assessmentSlug: string;
  status: string;
  submittedAt: string | null;
  overallScore: number | null;
};

export type ClientDashboardData = {
  clientId: string;
  assessment: ClientDashboardAssessment | null;
  assessments: ClientDashboardAssessmentHistoryItem[];
  baselines: ClientBaseline[];
  improvements: ClientImprovement[];
  kpis: ClientKpi[];
  milestones: ClientMilestone[];
  reports: ClientReport[];
};

export type ClientDashboardResult =
  { ok: true; data: ClientDashboardData } | { ok: false; message: string };

function unwrapData(body: unknown): unknown {
  if (typeof body === "object" && body !== null && "data" in body) {
    return (body as { data: unknown }).data;
  }
  return body;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asNullableString(value: unknown): string | null {
  if (value === null) return null;
  return asString(value);
}

function parseBaseline(row: unknown): ClientBaseline | null {
  if (!isRecord(row)) return null;
  const id = asString(row.id);
  const metricKey = asString(row.metricKey);
  const label = asString(row.label);
  const value = asNumber(row.value);
  const measuredAt = asString(row.measuredAt);
  if (!id || !metricKey || !label || value === null || !measuredAt) return null;
  return {
    id,
    metricKey,
    label,
    value,
    unit: asNullableString(row.unit),
    measuredAt,
    source: asNullableString(row.source),
  };
}

function parseImprovement(row: unknown): ClientImprovement | null {
  if (!isRecord(row)) return null;
  const id = asString(row.id);
  const title = asString(row.title);
  const status = asString(row.status);
  if (!id || !title) return null;
  if (status !== "AGREED" && status !== "IN_PROGRESS" && status !== "DONE") {
    return null;
  }
  return {
    id,
    title,
    description: asNullableString(row.description),
    ownerName: asNullableString(row.ownerName),
    ownerSide: asNullableString(row.ownerSide),
    status,
    targetDate: asNullableString(row.targetDate),
    agreedAt: asNullableString(row.agreedAt),
  };
}

function parseKpi(row: unknown): ClientKpi | null {
  if (!isRecord(row)) return null;
  const id = asString(row.id);
  const metricKey = asString(row.metricKey);
  const value = asNumber(row.value);
  const measuredAt = asString(row.measuredAt);
  if (!id || !metricKey || value === null || !measuredAt) return null;
  return {
    id,
    metricKey,
    value,
    measuredAt,
    target: asNumber(row.target),
  };
}

function parseMilestone(row: unknown): ClientMilestone | null {
  if (!isRecord(row)) return null;
  const id = asString(row.id);
  const title = asString(row.title);
  const status = asString(row.status);
  if (!id || !title) return null;
  if (
    status !== "PLANNED" &&
    status !== "IN_PROGRESS" &&
    status !== "COMPLETED"
  ) {
    return null;
  }
  return {
    id,
    title,
    startDate: asNullableString(row.startDate),
    dueDate: asNullableString(row.dueDate),
    ownerName: asNullableString(row.ownerName),
    ownerSide: asNullableString(row.ownerSide),
    status,
  };
}

function parseReport(row: unknown): ClientReport | null {
  if (!isRecord(row)) return null;
  const id = asString(row.id);
  const title = asString(row.title);
  const type = asString(row.type);
  const period = asString(row.period);
  if (!id || !title || !period) return null;
  if (type !== "QUARTERLY" && type !== "FINAL" && type !== "OTHER") return null;
  return {
    id,
    title,
    type,
    period,
    publishedAt: asNullableString(row.publishedAt),
    summary: asNullableString(row.summary),
    originalFileName: asNullableString(row.originalFileName),
    contentType: asNullableString(row.contentType),
    canDownload: Boolean(row.canDownload),
  };
}

function parseDashboard(raw: unknown): ClientDashboardData | null {
  if (!isRecord(raw)) return null;
  const clientId = asString(raw.clientId);
  if (!clientId) return null;
  if (!Array.isArray(raw.baselines)) return null;
  if (!Array.isArray(raw.improvements)) return null;
  if (!Array.isArray(raw.kpis)) return null;
  if (!Array.isArray(raw.milestones)) return null;
  if (!Array.isArray(raw.reports)) return null;

  const baselines = raw.baselines
    .map(parseBaseline)
    .filter((row): row is ClientBaseline => row !== null);
  const improvements = raw.improvements
    .map(parseImprovement)
    .filter((row): row is ClientImprovement => row !== null);
  const kpis = raw.kpis
    .map(parseKpi)
    .filter((row): row is ClientKpi => row !== null);
  const milestones = raw.milestones
    .map(parseMilestone)
    .filter((row): row is ClientMilestone => row !== null);
  const reports = raw.reports
    .map(parseReport)
    .filter((row): row is ClientReport => row !== null);

  const assessments = Array.isArray(raw.assessments)
    ? raw.assessments
        .map((row): ClientDashboardAssessmentHistoryItem | null => {
          if (!isRecord(row)) return null;
          const instanceId = asString(row.instanceId);
          const assessmentId = asString(row.assessmentId);
          const assessmentTitle = asString(row.assessmentTitle);
          const assessmentSlug = asString(row.assessmentSlug);
          const status = asString(row.status);
          if (
            !instanceId ||
            !assessmentId ||
            !assessmentTitle ||
            !assessmentSlug ||
            !status
          ) {
            return null;
          }
          return {
            instanceId,
            assessmentId,
            assessmentTitle,
            assessmentSlug,
            status,
            submittedAt: asNullableString(row.submittedAt),
            overallScore: asNumber(row.overallScore),
          };
        })
        .filter(
          (row): row is ClientDashboardAssessmentHistoryItem => row !== null,
        )
    : [];

  return {
    clientId,
    assessment: parseAssessment(raw.assessment),
    assessments,
    baselines,
    improvements,
    kpis,
    milestones,
    reports,
  };
}

function parseAssessment(raw: unknown): ClientDashboardAssessment | null {
  if (raw === null || raw === undefined) return null;
  if (!isRecord(raw)) return null;
  // Null when the client-facing primary is assigned but not started yet.
  const instanceId =
    raw.instanceId === null || raw.instanceId === undefined
      ? null
      : asString(raw.instanceId);
  const assessmentId = asString(raw.assessmentId);
  const assessmentTitle = asString(raw.assessmentTitle);
  const assessmentSlug = asString(raw.assessmentSlug);
  const status = asString(raw.status);
  if (!assessmentId || !assessmentTitle || !assessmentSlug || !status) {
    return null;
  }
  // Reject malformed non-null instance ids.
  if (raw.instanceId != null && !instanceId) return null;

  let result: ClientDashboardAssessment["result"] = null;
  if (isRecord(raw.result)) {
    const overallScore = asNumber(raw.result.overallScore);
    const sectionBreakdowns = Array.isArray(raw.result.sectionBreakdowns)
      ? raw.result.sectionBreakdowns
          .map((row) => {
            if (!isRecord(row)) return null;
            const id = asString(row.id);
            const number = asString(row.number);
            const title = asString(row.title);
            const score = asNumber(row.score);
            if (!id || !number || !title || score === null) return null;
            return { id, number, title, score, hasScores: true };
          })
          .filter(
            (
              row,
            ): row is {
              id: string;
              number: string;
              title: string;
              score: number;
              hasScores: boolean;
            } => row !== null,
          )
      : [];
    result = {
      overallScore: overallScore ?? 0,
      sectionBreakdowns,
      reviewCount: asNumber(raw.result.reviewCount) ?? 0,
      allSame: Boolean(raw.result.allSame),
    };
  }

  return {
    instanceId,
    assessmentId,
    assessmentTitle,
    assessmentSlug,
    status,
    submittedAt: asNullableString(raw.submittedAt),
    result,
  };
}

/** Session-scoped aggregate for the paying-client dashboard (Chunk 5/6). */
export async function getClientDashboard(): Promise<ClientDashboardResult> {
  const cookie = (await headers()).get("cookie");
  if (!cookie) {
    return {
      ok: false,
      message: "Your session has expired. Please sign in again.",
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/client/dashboard`, {
      headers: { cookie },
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        message: "Your session has expired. Please sign in again.",
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        message: `Could not load your dashboard (HTTP ${response.status}).`,
      };
    }

    const body: unknown = await response.json();
    const parsed = parseDashboard(unwrapData(body));
    if (!parsed) {
      return {
        ok: false,
        message: "The dashboard service returned an unexpected response.",
      };
    }

    return { ok: true, data: parsed };
  } catch {
    return {
      ok: false,
      message: "Could not reach the dashboard service. Please try again.",
    };
  }
}

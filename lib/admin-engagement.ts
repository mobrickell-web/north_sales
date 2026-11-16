import {
  AdminApiError,
  adminFetch,
  isUnauthorized,
  refreshSession,
} from "@/lib/auth-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type AdminBaseline = {
  id: string;
  clientId: string;
  metricKey: string;
  label: string;
  value: number;
  unit: string | null;
  measuredAt: string;
  source: string | null;
};

export type AdminImprovement = {
  id: string;
  clientId: string;
  title: string;
  description: string | null;
  ownerName: string | null;
  ownerSide: string | null;
  status: "AGREED" | "IN_PROGRESS" | "DONE";
  targetDate: string | null;
  agreedAt: string | null;
};

export type AdminKpi = {
  id: string;
  clientId: string;
  metricKey: string;
  value: number;
  measuredAt: string;
  target: number | null;
};

export type AdminMilestone = {
  id: string;
  clientId: string;
  title: string;
  startDate: string | null;
  dueDate: string | null;
  ownerName: string | null;
  ownerSide: string | null;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
};

export type AdminReport = {
  id: string;
  clientId: string;
  title: string;
  type: "QUARTERLY" | "FINAL" | "OTHER";
  period: string;
  publishedAt: string | null;
  fileKey: string;
  originalFileName: string | null;
  contentType: string | null;
  summary: string | null;
};

function clientPath(clientId: string, suffix: string) {
  return `/api/v1/admin/clients/${encodeURIComponent(clientId)}${suffix}`;
}

async function uploadForm<T>(path: string, formData: FormData): Promise<T> {
  const run = async () => {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const body = (await response.json().catch(() => null)) as {
      data?: T;
      message?: string | string[];
    } | null;

    if (!response.ok) {
      const message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : body?.message;
      throw new AdminApiError(
        response.status,
        message || "Upload failed. Please try again.",
      );
    }
    return (body && "data" in body ? body.data : body) as T;
  };

  try {
    return await run();
  } catch (error) {
    if (!isUnauthorized(error)) throw error;
    const session = await refreshSession();
    if (!session) throw error;
    return run();
  }
}

// Baselines
export const listBaselines = (clientId: string) =>
  adminFetch<AdminBaseline[]>(clientPath(clientId, "/baselines"));

export const createBaseline = (
  clientId: string,
  body: {
    metricKey: string;
    label: string;
    value: number;
    unit?: string;
    measuredAt: string;
    source?: string;
  },
) =>
  adminFetch<AdminBaseline>(clientPath(clientId, "/baselines"), {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateBaseline = (
  clientId: string,
  id: string,
  body: Partial<{
    metricKey: string;
    label: string;
    value: number;
    unit: string;
    measuredAt: string;
    source: string;
  }>,
) =>
  adminFetch<AdminBaseline>(clientPath(clientId, `/baselines/${id}`), {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteBaseline = (clientId: string, id: string) =>
  adminFetch<{ success: boolean; id: string }>(
    clientPath(clientId, `/baselines/${id}`),
    { method: "DELETE" },
  );

// Improvements
export const listImprovements = (clientId: string) =>
  adminFetch<AdminImprovement[]>(clientPath(clientId, "/improvements"));

export const createImprovement = (
  clientId: string,
  body: {
    title: string;
    description?: string;
    ownerName?: string;
    ownerSide?: string;
    status?: "AGREED" | "IN_PROGRESS" | "DONE";
    targetDate?: string;
    agreedAt?: string;
  },
) =>
  adminFetch<AdminImprovement>(clientPath(clientId, "/improvements"), {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateImprovement = (
  clientId: string,
  id: string,
  body: Partial<{
    title: string;
    description: string;
    ownerName: string;
    ownerSide: string;
    status: "AGREED" | "IN_PROGRESS" | "DONE";
    targetDate: string;
    agreedAt: string;
  }>,
) =>
  adminFetch<AdminImprovement>(clientPath(clientId, `/improvements/${id}`), {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteImprovement = (clientId: string, id: string) =>
  adminFetch<{ success: boolean; id: string }>(
    clientPath(clientId, `/improvements/${id}`),
    { method: "DELETE" },
  );

// KPIs
export const listKpis = (clientId: string) =>
  adminFetch<AdminKpi[]>(clientPath(clientId, "/kpis"));

export const createKpi = (
  clientId: string,
  body: {
    metricKey: string;
    value: number;
    target?: number;
    measuredAt: string;
  },
) =>
  adminFetch<AdminKpi>(clientPath(clientId, "/kpis"), {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateKpi = (
  clientId: string,
  id: string,
  body: Partial<{
    metricKey: string;
    value: number;
    target: number;
    measuredAt: string;
  }>,
) =>
  adminFetch<AdminKpi>(clientPath(clientId, `/kpis/${id}`), {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteKpi = (clientId: string, id: string) =>
  adminFetch<{ success: boolean; id: string }>(
    clientPath(clientId, `/kpis/${id}`),
    { method: "DELETE" },
  );

// Milestones
export const listMilestones = (clientId: string) =>
  adminFetch<AdminMilestone[]>(clientPath(clientId, "/milestones"));

export const createMilestone = (
  clientId: string,
  body: {
    title: string;
    startDate?: string;
    dueDate?: string;
    ownerName?: string;
    ownerSide?: string;
    status?: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
  },
) =>
  adminFetch<AdminMilestone>(clientPath(clientId, "/milestones"), {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateMilestone = (
  clientId: string,
  id: string,
  body: Partial<{
    title: string;
    startDate: string;
    dueDate: string;
    ownerName: string;
    ownerSide: string;
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
  }>,
) =>
  adminFetch<AdminMilestone>(clientPath(clientId, `/milestones/${id}`), {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteMilestone = (clientId: string, id: string) =>
  adminFetch<{ success: boolean; id: string }>(
    clientPath(clientId, `/milestones/${id}`),
    { method: "DELETE" },
  );

// Reports
export const listReports = (clientId: string) =>
  adminFetch<AdminReport[]>(clientPath(clientId, "/reports"));

export const uploadReport = (
  clientId: string,
  input: {
    title: string;
    type: "QUARTERLY" | "FINAL" | "OTHER";
    period: string;
    summary?: string;
    file: File;
  },
) => {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("type", input.type);
  formData.append("period", input.period);
  if (input.summary) formData.append("summary", input.summary);
  formData.append("file", input.file);
  return uploadForm<AdminReport>(
    clientPath(clientId, "/reports/upload"),
    formData,
  );
};

export const updateReport = (
  clientId: string,
  id: string,
  body: Partial<{
    title: string;
    type: "QUARTERLY" | "FINAL" | "OTHER";
    period: string;
    summary: string;
  }>,
) =>
  adminFetch<AdminReport>(clientPath(clientId, `/reports/${id}`), {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const publishReport = (id: string) =>
  adminFetch<AdminReport>(
    `/api/v1/admin/reports/${encodeURIComponent(id)}/publish`,
    {
      method: "POST",
    },
  );

export const deleteReport = (clientId: string, id: string) =>
  adminFetch<{ success: boolean; id: string }>(
    clientPath(clientId, `/reports/${id}`),
    { method: "DELETE" },
  );

import { AdminApiError, adminFetch } from "@/lib/auth-api";
import { revalidateAssessment } from "@/app/actions/revalidate-assessment";
import type {
  AdminAssessment,
  AdminAssessmentStatus,
} from "@/config/admin-assessments";

export type AdminAssessmentQuestion = {
  id: string;
  prompt: string;
  type:
    | "scale"
    | "five-point-scale"
    | "yes-no"
    | "short-answer"
    | "multiple-choice";
  required: boolean;
  helperText?: string;
  lowLabel?: string;
  highLabel?: string;
  options?: string[];
};

export type AdminAssessmentSection = {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  questions: AdminAssessmentQuestion[];
};

export type AdminAssessmentDocument = {
  id: string;
  title: string;
  status: AdminAssessmentStatus;
  /** True when this is the single client-facing assessment. */
  isClientPrimary: boolean;
  resultText: string;
  settings: {
    introduction: string;
    allowRetake: boolean;
  };
  sections: AdminAssessmentSection[];
};

/** Wire statuses come from the Prisma enum; the UI uses title case. */
type WireStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type WireDocument = {
  resultText: string;
  settings: AdminAssessmentDocument["settings"];
  sections: AdminAssessmentSection[];
};

type WireAssessment = {
  id: string;
  slug: string;
  title: string;
  status: WireStatus;
  isClientPrimary: boolean;
  document: WireDocument;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type WireListResponse = {
  items: WireAssessment[];
  total: number;
  skip: number;
  take: number;
};

const STATUS_TO_UI: Record<WireStatus, AdminAssessmentStatus> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const STATUS_TO_WIRE: Record<AdminAssessmentStatus, WireStatus> = {
  Draft: "DRAFT",
  Published: "PUBLISHED",
  Archived: "ARCHIVED",
};

const BASE_PATH = "/api/v1/admin/assessments";
const PAGE_SIZE = 200;
const SAVE_DELAY_MS = 700;

function toUiStatus(status: WireStatus): AdminAssessmentStatus {
  return STATUS_TO_UI[status] ?? "Draft";
}

function formatEditedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function toSummary(row: WireAssessment): AdminAssessment {
  const sections = row.document?.sections ?? [];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: toUiStatus(row.status),
    isClientPrimary: Boolean(row.isClientPrimary),
    questions: sections.reduce(
      (total, section) => total + section.questions.length,
      0,
    ),
    sections: sections.length,
    // There is no responses table yet, so the count is not known (Chunk 4/7).
    responses: null,
    lastEdited: formatEditedDate(row.updatedAt),
  };
}

function toUiDocument(row: WireAssessment): AdminAssessmentDocument {
  return {
    id: row.id,
    title: row.title,
    status: toUiStatus(row.status),
    isClientPrimary: Boolean(row.isClientPrimary),
    resultText: row.document?.resultText ?? "",
    settings: {
      introduction: row.document?.settings?.introduction ?? "",
      allowRetake: row.document?.settings?.allowRetake ?? false,
    },
    sections: (row.document?.sections ?? []).map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      instructions: section.instructions,
      questions: section.questions.map((question) => ({ ...question })),
    })),
  };
}

/**
 * The API rejects unknown keys (forbidNonWhitelisted), and identity/lifecycle
 * live in columns rather than the JSONB document. Strip them before sending.
 */
function toWireDocument(document: AdminAssessmentDocument): WireDocument {
  return {
    resultText: document.resultText,
    settings: {
      introduction: document.settings.introduction,
      allowRetake: document.settings.allowRetake,
    },
    sections: document.sections.map((section) => ({
      id: section.id,
      title: section.title,
      ...(section.description ? { description: section.description } : {}),
      ...(section.instructions ? { instructions: section.instructions } : {}),
      questions: section.questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        type: question.type,
        required: question.required,
        ...(question.helperText ? { helperText: question.helperText } : {}),
        ...(question.lowLabel ? { lowLabel: question.lowLabel } : {}),
        ...(question.highLabel ? { highLabel: question.highLabel } : {}),
        ...(question.options ? { options: question.options } : {}),
      })),
    })),
  };
}

function emptyDocument(): WireDocument {
  return {
    resultText: "",
    settings: { introduction: "", allowRetake: false },
    sections: [],
  };
}

function slugify(value: string) {
  const base = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
  return base || "untitled-assessment";
}

/** Slugs are unique; walk -2, -3… and fall back to a random suffix. */
async function createRow(title: string): Promise<WireAssessment> {
  const base = slugify(title);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;
    try {
      return await adminFetch<WireAssessment>(BASE_PATH, {
        method: "POST",
        body: JSON.stringify({ slug, title, document: emptyDocument() }),
      });
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 409) continue;
      throw error;
    }
  }

  return adminFetch<WireAssessment>(BASE_PATH, {
    method: "POST",
    body: JSON.stringify({
      slug: `${base.slice(0, 90)}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      document: emptyDocument(),
    }),
  });
}

export async function listAdminAssessments(): Promise<AdminAssessment[]> {
  const result = await adminFetch<WireListResponse>(
    `${BASE_PATH}?take=${PAGE_SIZE}`,
  );
  return result.items.map(toSummary);
}

/** Published assessments for Zoom instance creation dropdown. */
export async function listPublishedAdminAssessments(): Promise<
  AdminAssessment[]
> {
  const result = await adminFetch<WireListResponse>(
    `${BASE_PATH}?status=PUBLISHED&take=${PAGE_SIZE}`,
  );
  return result.items.map(toSummary);
}

export async function getAdminAssessment(
  id: string,
): Promise<AdminAssessmentDocument | null> {
  try {
    const row = await adminFetch<WireAssessment>(
      `${BASE_PATH}/${encodeURIComponent(id)}`,
    );
    return toUiDocument(row);
  } catch (error) {
    // ParseUUIDPipe returns 400 for a non-UUID route param; both mean "no row".
    if (
      error instanceof AdminApiError &&
      (error.status === 400 || error.status === 404)
    ) {
      return null;
    }
    throw error;
  }
}

export async function createAdminAssessment(): Promise<AdminAssessment> {
  const row = await createRow("Untitled assessment");
  return toSummary(row);
}

export async function saveAdminAssessment(
  document: AdminAssessmentDocument,
): Promise<void> {
  const row = await adminFetch<WireAssessment>(
    `${BASE_PATH}/${encodeURIComponent(document.id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        title: document.title,
        document: toWireDocument(document),
      }),
    },
  );
  if (row?.slug && row.status === "PUBLISHED") {
    void revalidateAssessment(row.slug);
  }
}

export async function setAdminAssessmentStatus(
  id: string,
  status: AdminAssessmentStatus,
): Promise<Pick<AdminAssessmentDocument, "status" | "isClientPrimary">> {
  const row = await adminFetch<WireAssessment>(
    `${BASE_PATH}/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: STATUS_TO_WIRE[status] }),
    },
  );
  await revalidateAssessment(row?.slug);
  return {
    status: toUiStatus(row.status),
    isClientPrimary: Boolean(row.isClientPrimary),
  };
}

/**
 * Toggle client-facing primary.
 * enabled=true → at most one ON; enabled=false → none shown to clients.
 */
export async function setAdminAssessmentClientPrimary(
  id: string,
  enabled = true,
): Promise<Pick<AdminAssessmentDocument, "status" | "isClientPrimary">> {
  const row = await adminFetch<WireAssessment>(
    `${BASE_PATH}/${encodeURIComponent(id)}/client-primary`,
    {
      method: "POST",
      body: JSON.stringify({ enabled }),
    },
  );
  // Always await so Primary OFF / switch is reflected on the public page
  // before the admin UI continues.
  await revalidateAssessment(row?.slug);
  return {
    status: toUiStatus(row.status),
    isClientPrimary: Boolean(row.isClientPrimary),
  };
}

export async function deleteAdminAssessment(id: string): Promise<void> {
  const result = await adminFetch<{
    deleted: boolean;
    id: string;
    slug?: string;
  }>(`${BASE_PATH}/${encodeURIComponent(id)}`, { method: "DELETE" });
  // Bust the public /sales-alignment-assessment cache so a deleted or
  // former-primary assessment cannot keep rendering.
  await revalidateAssessment(result.slug);
}

export const ADMIN_ASSESSMENT_SAVE_DELAY_MS = SAVE_DELAY_MS;

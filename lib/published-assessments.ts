const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type PublishedQuestionType =
  "scale" | "five-point-scale" | "yes-no" | "short-answer" | "multiple-choice";

export type PublishedQuestion = {
  id: string;
  prompt: string;
  type: PublishedQuestionType;
  required: boolean;
  helperText?: string;
  lowLabel?: string;
  highLabel?: string;
  options?: string[];
};

export type PublishedSection = {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  questions: PublishedQuestion[];
};

export type PublishedDocument = {
  resultText: string;
  settings: {
    introduction: string;
    allowRetake: boolean;
  };
  sections: PublishedSection[];
};

export type PublishedAssessment = {
  id: string;
  slug: string;
  title: string;
  status: "PUBLISHED";
  document: PublishedDocument;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Private staff route that mirrors the client-facing primary assessment. */
export const CLIENT_FACING_ASSESSMENT_PATH = "/sales-alignment-assessment";

export const CLIENT_FACING_ASSESSMENT_TAG = "assessment:client-primary";

/**
 * Legacy slug ↔ path map (kept for on-demand revalidation of older slug tags).
 */
export const ASSESSMENT_PATH_TO_SLUG: Record<string, string> = {
  [CLIENT_FACING_ASSESSMENT_PATH]: "sales-alignment",
};

export const ASSESSMENT_SLUG_TO_PATH: Record<string, string> = {
  "sales-alignment": CLIENT_FACING_ASSESSMENT_PATH,
};

export function getSlugForPath(path: string): string | null {
  return ASSESSMENT_PATH_TO_SLUG[path] ?? null;
}

export function getPathForSlug(slug: string): string | null {
  return ASSESSMENT_SLUG_TO_PATH[slug] ?? null;
}

/**
 * Server-side fetch for published assessments with tag-based caching.
 * Only status=PUBLISHED is ever returned by the API; drafts and archived
 * assessments respond with 404 and return null.
 */
export async function fetchPublishedAssessment(
  slug: string,
): Promise<PublishedAssessment | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/assessments/${encodeURIComponent(slug)}`,
      {
        next: {
          tags: [`assessment:${slug}`],
          revalidate: 3600,
        },
      },
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch published assessment "${slug}" (HTTP ${response.status})`,
      );
    }

    const body = (await response.json()) as {
      status?: boolean;
      data?: PublishedAssessment;
    };

    return body?.data ?? null;
  } catch (error) {
    console.error(`Could not fetch published assessment "${slug}":`, error);
    return null;
  }
}

/**
 * Same published assessment clients see (isClientPrimary).
 * Used by the private Super Admin / Representative web page.
 */
export async function fetchClientFacingAssessment(): Promise<PublishedAssessment | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/assessments/client-primary`,
      {
        next: {
          tags: [CLIENT_FACING_ASSESSMENT_TAG],
          revalidate: 3600,
        },
      },
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch client-facing assessment (HTTP ${response.status})`,
      );
    }

    const body = (await response.json()) as {
      status?: boolean;
      data?: PublishedAssessment;
    };

    return body?.data ?? null;
  } catch (error) {
    console.error("Could not fetch client-facing assessment:", error);
    return null;
  }
}

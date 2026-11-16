"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  CLIENT_FACING_ASSESSMENT_PATH,
  CLIENT_FACING_ASSESSMENT_TAG,
  getPathForSlug,
} from "@/lib/published-assessments";

/**
 * On-demand revalidation triggered when an assessment is published, drafted,
 * archived, set as client-facing, or edited in the Super Admin panel.
 */
export async function revalidateAssessment(slug?: string): Promise<void> {
  try {
    // Staff private page always mirrors the client-facing primary.
    revalidateTag(CLIENT_FACING_ASSESSMENT_TAG, "max");
    revalidatePath(CLIENT_FACING_ASSESSMENT_PATH);

    if (slug) {
      revalidateTag(`assessment:${slug}`, "max");
      const mappedPath = getPathForSlug(slug);
      if (mappedPath && mappedPath !== CLIENT_FACING_ASSESSMENT_PATH) {
        revalidatePath(mappedPath);
      }
    }
  } catch (error) {
    console.error(
      `Failed to revalidate assessment${slug ? ` "${slug}"` : ""}:`,
      error,
    );
  }
}

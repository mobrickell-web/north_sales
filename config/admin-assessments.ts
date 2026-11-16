export type AdminAssessmentStatus = "Published" | "Draft" | "Archived";

export type AdminAssessment = {
  id: string;
  slug: string;
  title: string;
  status: AdminAssessmentStatus;
  /** True when this is the single client-facing assessment. */
  isClientPrimary: boolean;
  questions: number;
  sections: number;
  /** No responses table exists yet; null renders as "—". */
  responses: number | null;
  lastEdited: string;
};

export const adminAssessmentsConfig = {
  breadcrumb: "Sales Alignment Assessment",
  title: "Assessments",
  description:
    "Create assessments, manage their questions and publish changes.",
  searchPlaceholder: "Search assessments",
  newAssessmentLabel: "New assessment",
  editLabel: "Edit",
  filters: [
    { label: "All", status: "All" },
    { label: "Published", status: "Published" },
    { label: "Drafts", status: "Draft" },
    { label: "Archived", status: "Archived" },
  ] as const,
  columns: ["Assessment", "Status", "Content", "Responses", "Last edited"],
} as const;

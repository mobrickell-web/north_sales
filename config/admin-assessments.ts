export type AdminAssessmentStatus = "Published" | "Draft" | "Archived";

export type AdminAssessment = {
  id: string;
  title: string;
  status: AdminAssessmentStatus;
  questions: number;
  sections: number;
  responses: number;
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
  initialAssessments: [
    {
      id: "career-readiness",
      title: "Career Readiness Assessment",
      status: "Published",
      questions: 20,
      sections: 5,
      responses: 128,
      lastEdited: "21 Oct 2026",
    },
    {
      id: "leadership-potential",
      title: "Leadership Potential",
      status: "Draft",
      questions: 12,
      sections: 4,
      responses: 0,
      lastEdited: "19 Oct 2026",
    },
    {
      id: "team-wellbeing",
      title: "Team Wellbeing Check",
      status: "Published",
      questions: 15,
      sections: 3,
      responses: 76,
      lastEdited: "2 Sep 2026",
    },
    {
      id: "customer-service-skills",
      title: "Customer Service Skills",
      status: "Archived",
      questions: 18,
      sections: 4,
      responses: 42,
      lastEdited: "14 Mar 2026",
    },
    {
      id: "sales-alignment",
      title: "Sales Alignment Assessment",
      status: "Published",
      questions: 10,
      sections: 3,
      responses: 94,
      lastEdited: "28 Oct 2026",
    },
    {
      id: "sales-leadership-effectiveness",
      title: "Sales Leadership Effectiveness",
      status: "Archived",
      questions: 16,
      sections: 4,
      responses: 31,
      lastEdited: "10 Feb 2026",
    },
    {
      id: "team-performance-review",
      title: "Team Performance Review",
      status: "Archived",
      questions: 14,
      sections: 4,
      responses: 27,
      lastEdited: "6 Jan 2026",
    },
    {
      id: "client-success-readiness",
      title: "Client Success Readiness",
      status: "Archived",
      questions: 11,
      sections: 3,
      responses: 19,
      lastEdited: "18 Dec 2025",
    },
    {
      id: "sales-process-maturity",
      title: "Sales Process Maturity",
      status: "Archived",
      questions: 22,
      sections: 5,
      responses: 36,
      lastEdited: "3 Nov 2025",
    },
    {
      id: "revenue-growth-planning",
      title: "Revenue Growth Planning",
      status: "Archived",
      questions: 13,
      sections: 3,
      responses: 24,
      lastEdited: "22 Sep 2025",
    },
  ] satisfies AdminAssessment[],
} as const;

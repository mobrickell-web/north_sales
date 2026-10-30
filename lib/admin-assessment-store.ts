import {
  type AdminAssessment,
  type AdminAssessmentStatus,
  adminAssessmentsConfig,
} from "@/config/admin-assessments";
import { adminAssessmentSeeds } from "@/config/admin-assessment-seeds";

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
  resultText: string;
  settings: {
    introduction: string;
    allowRetake: boolean;
  };
  sections: AdminAssessmentSection[];
};

type AdminAssessmentStore = {
  assessments: AdminAssessment[];
  documents: Record<string, AdminAssessmentDocument>;
};

const STORAGE_KEY = "north_admin_assessments_v1";

function createQuestion(
  sectionId: string,
  index: number,
  prompt: string,
): AdminAssessmentQuestion {
  return {
    id: `${sectionId}-question-${index + 1}`,
    prompt,
    type: "scale",
    required: true,
  };
}

function createInitialDocument(
  assessment: AdminAssessment,
): AdminAssessmentDocument {
  const sectionCount =
    assessment.id === "career-readiness" ? 5 : assessment.sections;
  const questionsPerSection = Math.floor(assessment.questions / sectionCount);
  const extraQuestions = assessment.questions % sectionCount;
  const sections = Array.from({ length: sectionCount }, (_, sectionIndex) => {
    const seed =
      assessment.id === "career-readiness"
        ? adminAssessmentSeeds.careerReadinessSections[sectionIndex]
        : undefined;
    const title = seed?.title ?? `Section ${sectionIndex + 1}`;
    const id = `${assessment.id}-section-${sectionIndex + 1}`;
    const questionCount =
      questionsPerSection + (sectionIndex < extraQuestions ? 1 : 0);

    return {
      id,
      title,
      questions: Array.from({ length: questionCount }, (_, questionIndex) =>
        createQuestion(
          id,
          questionIndex,
          seed?.questions[questionIndex] ?? `Question ${questionIndex + 1}`,
        ),
      ),
    };
  });

  return {
    id: assessment.id,
    title: assessment.title,
    status: assessment.status,
    resultText: "",
    settings: { introduction: "", allowRetake: false },
    sections,
  };
}

function createInitialStore(): AdminAssessmentStore {
  const assessments = [...adminAssessmentsConfig.initialAssessments];
  return {
    assessments,
    documents: Object.fromEntries(
      assessments.map((assessment) => [
        assessment.id,
        createInitialDocument(assessment),
      ]),
    ),
  };
}

function readStore(): AdminAssessmentStore {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialStore = createInitialStore();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStore));
    return initialStore;
  }

  const parsed: unknown = JSON.parse(stored);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("assessments" in parsed) ||
    !Array.isArray(parsed.assessments) ||
    !("documents" in parsed) ||
    typeof parsed.documents !== "object" ||
    parsed.documents === null
  ) {
    throw new Error("Saved assessments data is invalid.");
  }
  return parsed as AdminAssessmentStore;
}

function writeStore(store: AdminAssessmentStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function formatEditedDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

export function getAdminAssessments() {
  return readStore().assessments;
}

export function getAdminAssessmentDocument(id: string) {
  const store = readStore();
  return store.documents[id] ?? null;
}

export function saveAdminAssessmentDocument(document: AdminAssessmentDocument) {
  const store = readStore();
  const totalQuestions = document.sections.reduce(
    (total, section) => total + section.questions.length,
    0,
  );
  const index = store.assessments.findIndex(
    (assessment) => assessment.id === document.id,
  );

  if (index < 0) {
    throw new Error(`Assessment "${document.id}" was not found.`);
  }

  store.documents[document.id] = document;
  store.assessments[index] = {
    ...store.assessments[index],
    title: document.title,
    status: document.status,
    sections: document.sections.length,
    questions: totalQuestions,
    lastEdited: formatEditedDate(),
  };
  writeStore(store);
}

export function createAdminAssessment() {
  const store = readStore();
  const id = `draft-${Date.now()}`;
  const assessment: AdminAssessment = {
    id,
    title: "Untitled assessment",
    status: "Draft",
    questions: 0,
    sections: 0,
    responses: 0,
    lastEdited: formatEditedDate(),
  };
  const document: AdminAssessmentDocument = {
    id,
    title: assessment.title,
    status: assessment.status,
    resultText: "",
    settings: { introduction: "", allowRetake: false },
    sections: [],
  };

  store.assessments.unshift(assessment);
  store.documents[id] = document;
  writeStore(store);
  return id;
}

export function deleteAdminAssessment(id: string) {
  const store = readStore();
  store.assessments = store.assessments.filter(
    (assessment) => assessment.id !== id,
  );
  delete store.documents[id];
  writeStore(store);
}

export function setAdminAssessmentStatus(
  id: string,
  status: AdminAssessmentStatus,
) {
  const store = readStore();
  const document = store.documents[id];
  if (!document) {
    throw new Error(`Assessment "${id}" was not found.`);
  }
  document.status = status;
  saveAdminAssessmentDocument(document);
}

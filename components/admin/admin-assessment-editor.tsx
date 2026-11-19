"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CirclePlus,
  Ellipsis,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { AdminTopbar } from "@/components/shared/admin-topbar";
import { AdminAssessmentPreviewSheet } from "@/components/admin/admin-assessment-preview-sheet";
import type { AdminAssessmentSectionDraft } from "@/components/admin/admin-assessment-preview-sheet";
import type { AdminAssessmentStatus } from "@/config/admin-assessments";
import {
  type AdminAssessmentDocument,
  type AdminAssessmentQuestion,
  type AdminAssessmentSection,
  ADMIN_ASSESSMENT_SAVE_DELAY_MS,
  deleteAdminAssessment,
  getAdminAssessment,
  saveAdminAssessment,
  setAdminAssessmentClientPrimary,
  setAdminAssessmentStatus,
} from "@/lib/admin-assessments";
import {
  type AdminProfile,
  adminLogout,
  adminProfile,
  clearSession,
  hasSession,
  isSuperAdmin,
  isUnauthorized,
} from "@/lib/auth-api";
import { cn } from "@/lib/utils";

const LOGIN_PATH = "/login";
const tabs = ["Questions", "Sections", "Results text", "Settings"] as const;
type EditorTab = (typeof tabs)[number];
type QuestionType = AdminAssessmentQuestion["type"];

const questionTypeLabels: Record<QuestionType, string> = {
  scale: "10-point scale",
  "five-point-scale": "10-point scale",
  "yes-no": "Yes / No",
  "short-answer": "Short answer",
  "multiple-choice": "Multiple choice",
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function statusClass(status: AdminAssessmentDocument["status"]) {
  if (status === "Published") {
    return "bg-admin-status-published-bg text-admin-status-published";
  }
  if (status === "Draft") {
    return "bg-admin-status-draft-bg text-admin-status-draft";
  }
  return "bg-admin-status-archived-bg text-admin-status-archived";
}

function contentSignature(document: AdminAssessmentDocument) {
  return JSON.stringify({
    title: document.title,
    resultText: document.resultText,
    settings: document.settings,
    sections: document.sections,
  });
}

function errorMessage(cause: unknown, fallback: string) {
  return cause instanceof Error && cause.message ? cause.message : fallback;
}

export function AdminAssessmentEditor({
  assessmentId,
}: {
  assessmentId: string;
}) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [checking, setChecking] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [document, setDocument] = useState<AdminAssessmentDocument | null>(
    null,
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<EditorTab>("Questions");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [questionPrompt, setQuestionPrompt] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("scale");
  const [questionTypeOpen, setQuestionTypeOpen] = useState(false);
  const [questionRequired, setQuestionRequired] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewInitialMode, setPreviewInitialMode] = useState<
    "preview" | "add-question" | "add-section"
  >("preview");
  const [previewInitialSectionId, setPreviewInitialSectionId] = useState<
    string | undefined
  >(undefined);
  const [draggingQuestionId, setDraggingQuestionId] = useState<string | null>(
    null,
  );
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [saveError, setSaveError] = useState("");
  const [actionError, setActionError] = useState("");
  const [statusPending, setStatusPending] = useState(false);
  const pendingRef = useRef<AdminAssessmentDocument | null>(null);
  const savedSignatureRef = useRef<string | null>(null);
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const deletedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    if (!hasSession()) {
      router.replace(LOGIN_PATH);
      return;
    }

    (async () => {
      try {
        const profile = await adminProfile();
        if (cancelled) return;

        if (!isSuperAdmin(profile)) {
          clearSession();
          router.replace(LOGIN_PATH);
          return;
        }
        setAdmin(profile);

        const loaded = await getAdminAssessment(assessmentId);
        if (cancelled) return;

        if (loaded) {
          savedSignatureRef.current = contentSignature(loaded);
          setDocument(loaded);
          setSelectedSectionId(loaded.sections[0]?.id ?? null);
        }
      } catch (cause) {
        if (cancelled) return;

        if (isUnauthorized(cause)) {
          clearSession();
          router.replace(LOGIN_PATH);
          return;
        }
        setLoadError(errorMessage(cause, "Could not load this assessment."));
      } finally {
        if (!cancelled) {
          setHydrated(true);
          setChecking(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [assessmentId, reloadKey, router]);

  const selectedSection = useMemo(
    () =>
      document?.sections.find((section) => section.id === selectedSectionId) ??
      null,
    [document, selectedSectionId],
  );

  const questionCount =
    document?.sections.reduce(
      (total, section) => total + section.questions.length,
      0,
    ) ?? 0;

  const runSave = useCallback(async (snapshot: AdminAssessmentDocument) => {
    if (deletedRef.current) return true;

    setSaveState("saving");
    try {
      await saveAdminAssessment(snapshot);
      if (deletedRef.current) return true;

      savedSignatureRef.current = contentSignature(snapshot);
      setSaveError("");
      setSaveState("saved");
      return true;
    } catch (cause) {
      if (!deletedRef.current) {
        // Keep the newest unsaved snapshot so "Retry" can resend it.
        pendingRef.current = pendingRef.current ?? snapshot;
        setSaveState("error");
        setSaveError(errorMessage(cause, "Could not save changes."));
      }
      return false;
    }
  }, []);

  const enqueueSave = useCallback(
    (snapshot: AdminAssessmentDocument) => {
      if (pendingRef.current === snapshot) pendingRef.current = null;

      // Serialize writes so an older payload can never land after a newer one.
      const next = saveChainRef.current.then(() => runSave(snapshot));
      saveChainRef.current = next.then(() => undefined);
      return next;
    },
    [runSave],
  );

  useEffect(() => {
    if (!hydrated || !document) return;

    const signature = contentSignature(document);
    if (signature === savedSignatureRef.current) return;
    // Never persist a blank name; blur normalizes it back to "Untitled assessment".
    if (!document.title.trim()) return;

    pendingRef.current = document;
    const timer = window.setTimeout(() => {
      // A publish/archive flush may have already sent this snapshot.
      if (pendingRef.current === document) void enqueueSave(document);
    }, ADMIN_ASSESSMENT_SAVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [document, enqueueSave, hydrated]);

  const flushSave = useCallback(async () => {
    const pending = pendingRef.current;
    if (pending) return enqueueSave(pending);

    await saveChainRef.current;
    return true;
  }, [enqueueSave]);

  const updateDocument = (next: AdminAssessmentDocument) => {
    setDocument(next);
  };

  const normalizeTitle = () => {
    if (!document) return;
    const title = document.title.trim() || "Untitled assessment";
    if (title !== document.title) updateDocument({ ...document, title });
  };

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await adminLogout();
    } catch {
      // Clear local credentials even if the server is unavailable.
    }
    clearSession();
    router.replace(LOGIN_PATH);
  };

  const addSection = () => {
    setPreviewInitialMode("add-section");
    setPreviewInitialSectionId(undefined);
    setPreviewOpen(true);
  };

  const saveNewSection = (draft: AdminAssessmentSectionDraft) => {
    if (!document) return;
    const section: AdminAssessmentSection = {
      id: createId("section"),
      title: draft.title,
      description: draft.description || undefined,
      instructions: draft.instructions || undefined,
      questions: [],
    };
    const sections = [...document.sections];
    sections.splice(draft.position - 1, 0, section);
    updateDocument({ ...document, sections });
    setSelectedSectionId(section.id);
    setActiveTab("Questions");
    setShowQuestionForm(false);
  };

  const removeSection = (sectionId: string) => {
    if (!document) return;
    const sections = document.sections.filter(
      (section) => section.id !== sectionId,
    );
    updateDocument({ ...document, sections });
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(sections[0]?.id ?? null);
    }
    setShowQuestionForm(false);
  };

  const openNewQuestionForm = () => {
    setEditingQuestionId(null);
    setShowQuestionForm(false);
    setPreviewInitialMode("add-question");
    setPreviewInitialSectionId(selectedSection?.id);
    setPreviewOpen(true);
  };

  const openPreview = () => {
    setPreviewInitialMode("preview");
    setPreviewInitialSectionId(undefined);
    setPreviewOpen(true);
  };

  const openEditQuestionForm = (question: AdminAssessmentQuestion) => {
    setEditingQuestionId(question.id);
    setQuestionPrompt(question.prompt);
    setQuestionDescription(question.helperText ?? "");
    setQuestionType(question.type);
    setQuestionTypeOpen(false);
    setQuestionRequired(question.required);
    setShowQuestionForm(true);
  };

  const saveQuestion = () => {
    if (!document || !selectedSection || !questionPrompt.trim()) return;

    const nextQuestion: AdminAssessmentQuestion = {
      id: editingQuestionId ?? createId("question"),
      prompt: questionPrompt.trim(),
      helperText: questionDescription.trim() || undefined,
      type: questionType,
      required: questionRequired,
    };
    const sections = document.sections.map((section) =>
      section.id !== selectedSection.id
        ? section
        : {
            ...section,
            questions: editingQuestionId
              ? section.questions.map((question) =>
                  question.id === editingQuestionId ? nextQuestion : question,
                )
              : [...section.questions, nextQuestion],
          },
    );
    updateDocument({ ...document, sections });
    setQuestionTypeOpen(false);
    setShowQuestionForm(false);
  };

  const removeQuestion = (questionId: string) => {
    if (!document || !selectedSection) return;
    updateDocument({
      ...document,
      sections: document.sections.map((section) =>
        section.id === selectedSection.id
          ? {
              ...section,
              questions: section.questions.filter(
                (question) => question.id !== questionId,
              ),
            }
          : section,
      ),
    });
  };

  const reorderQuestions = (sourceId: string, targetId: string) => {
    if (!document || !selectedSection || sourceId === targetId) return;
    const questions = [...selectedSection.questions];
    const sourceIndex = questions.findIndex(
      (question) => question.id === sourceId,
    );
    const targetIndex = questions.findIndex(
      (question) => question.id === targetId,
    );
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [movedQuestion] = questions.splice(sourceIndex, 1);
    questions.splice(targetIndex, 0, movedQuestion);
    updateDocument({
      ...document,
      sections: document.sections.map((section) =>
        section.id === selectedSection.id ? { ...section, questions } : section,
      ),
    });
  };

  const changeStatus = async (status: AdminAssessmentStatus) => {
    if (!document || statusPending) return;

    setActionsOpen(false);
    setStatusPending(true);
    setActionError("");
    try {
      // Publish/archive must not race an unsaved edit.
      const saved = await flushSave();
      if (!saved) return;

      const applied = await setAdminAssessmentStatus(document.id, status);
      setDocument((current) =>
        current
          ? {
              ...current,
              status: applied.status,
              isClientPrimary: applied.isClientPrimary,
            }
          : current,
      );
    } catch (cause) {
      setActionError(errorMessage(cause, "Could not update the status."));
    } finally {
      setStatusPending(false);
    }
  };

  const setAsClientAssessment = async (enabled: boolean) => {
    if (!document || statusPending) return;
    if (document.status !== "Published") {
      setActionError("Publish this assessment before toggling client-facing.");
      return;
    }

    setActionsOpen(false);
    setStatusPending(true);
    setActionError("");
    try {
      const applied = await setAdminAssessmentClientPrimary(
        document.id,
        enabled,
      );
      setDocument((current) =>
        current
          ? {
              ...current,
              status: applied.status,
              isClientPrimary: applied.isClientPrimary,
            }
          : current,
      );
    } catch (cause) {
      setActionError(
        errorMessage(
          cause,
          enabled
            ? "Could not turn on the client-facing assessment."
            : "Could not turn off the client-facing assessment.",
        ),
      );
    } finally {
      setStatusPending(false);
    }
  };

  const publish = () => {
    if (!document) return;
    // The API rejects publishing an already-published row; just save instead.
    if (document.status === "Published") {
      void flushSave();
      return;
    }
    void changeStatus("Published");
  };

  const removeAssessment = async () => {
    if (!document || statusPending) return;

    setActionsOpen(false);
    setStatusPending(true);
    setActionError("");
    try {
      deletedRef.current = true;
      await deleteAdminAssessment(document.id);
      router.push("/assessments");
    } catch (cause) {
      deletedRef.current = false;
      setActionError(errorMessage(cause, "Could not delete this assessment."));
      setStatusPending(false);
    }
  };

  const retrySave = () => {
    const snapshot = pendingRef.current ?? document;
    if (snapshot) void enqueueSave(snapshot);
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-admin-canvas">
        <p className="flex items-center gap-2 font-sans text-[14px] text-admin-muted">
          <Loader2 className="size-4 animate-spin" />
          Checking your session…
        </p>
      </main>
    );
  }

  if (!document) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-admin-canvas px-4 text-center text-admin-text">
        <p>{loadError ? loadError : "This assessment could not be found."}</p>
        <div className="flex items-center gap-4">
          {loadError ? (
            <button
              type="button"
              onClick={() => {
                setLoadError("");
                setChecking(true);
                setReloadKey((key) => key + 1);
              }}
              className="cursor-pointer text-[13px] font-semibold text-admin-info hover:underline"
            >
              Try again
            </button>
          ) : null}
          <Link
            href="/assessments"
            className="text-[13px] font-medium text-admin-info hover:underline"
          >
            Return to assessments
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="grid min-h-screen w-full max-w-full min-w-0 grid-cols-1 bg-admin-canvas lg:grid-cols-[286px_minmax(0,1fr)]">
      <AdminSidebar
        onLogout={handleLogout}
        signingOut={signingOut}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <main
        id="main"
        className="w-full min-w-0 px-4 pb-8 text-admin-text sm:px-6 lg:px-8"
      >
        <AdminTopbar
          title="Sales Alignment Assessment"
          adminName={admin?.name}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="pt-7">
            <Link
              href="/assessments"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-admin-info hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              All assessments
            </Link>
          </div>

          <section className="flex flex-col justify-between gap-4 py-5 sm:py-7 lg:flex-row lg:items-center">
            <div className="min-w-0 lg:flex-1">
              <input
                aria-label="Assessment name"
                value={document.title}
                onChange={(event) =>
                  updateDocument({ ...document, title: event.target.value })
                }
                onBlur={normalizeTitle}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
                maxLength={200}
                placeholder="Untitled assessment"
                title="Click to rename this assessment"
                className="-mx-2 w-[calc(100%+1rem)] min-w-0 cursor-text rounded-lg border border-transparent bg-transparent px-2 font-sans text-[25px] leading-tight font-bold tracking-[-0.035em] text-admin-navy outline-none transition-colors placeholder:text-admin-navy/40 hover:border-admin-border-strong focus:border-admin-info focus:ring-2 focus:ring-admin-info/15 sm:text-[30px]"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
                    statusClass(document.status),
                  )}
                >
                  {document.status}
                </span>
                {document.status === "Published" ? (
                  <div className="inline-flex shrink-0 items-center gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.04em] text-admin-muted uppercase">
                      Primary
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={document.isClientPrimary}
                      aria-label="Primary assessment"
                      title={
                        document.isClientPrimary
                          ? "This is the default Primary assessment shown on client dashboards"
                          : "Set as Primary — the default assessment shown on client dashboards (only one at a time)"
                      }
                      disabled={statusPending}
                      onClick={() =>
                        void setAsClientAssessment(!document.isClientPrimary)
                      }
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info disabled:cursor-not-allowed",
                        document.isClientPrimary
                          ? "bg-admin-navy"
                          : "bg-[#D7DCE3] hover:bg-[#C8CED6]",
                        statusPending && "opacity-60",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                          document.isClientPrimary
                            ? "translate-x-4"
                            : "translate-x-0",
                        )}
                      />
                    </button>
                  </div>
                ) : null}
                <span className="text-[12px] text-admin-muted">
                  {questionCount} questions · {document.sections.length}{" "}
                  sections
                </span>
              </div>
            </div>

            <div className="flex w-full items-center gap-1.5 sm:w-auto sm:gap-2">
              <div className="relative">
                <button
                  type="button"
                  aria-label="Assessment actions"
                  aria-expanded={actionsOpen}
                  onClick={() => setActionsOpen((open) => !open)}
                  disabled={statusPending}
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-admin-border-strong bg-admin-surface text-admin-text-strong hover:bg-admin-soft disabled:cursor-not-allowed disabled:opacity-60 sm:size-[52px] sm:rounded-xl"
                >
                  <Ellipsis className="size-3.5 sm:size-4" />
                </button>
                {actionsOpen ? (
                  <div className="absolute top-[calc(100%+8px)] right-0 z-30 min-w-[220px] rounded-xl border border-admin-border-strong bg-admin-surface p-1.5 shadow-lg">
                    <button
                      type="button"
                      onClick={() => void changeStatus("Archived")}
                      disabled={statusPending}
                      className="block w-full rounded-md px-3 py-2.5 text-left text-[14px] text-admin-text transition-colors hover:bg-admin-sidebar hover:text-admin-sidebar-text focus-visible:bg-admin-sidebar focus-visible:text-admin-sidebar-text focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Archive
                    </button>
                    <button
                      type="button"
                      onClick={() => void changeStatus("Draft")}
                      disabled={statusPending}
                      className="block w-full rounded-md px-3 py-2.5 text-left text-[14px] text-admin-text transition-colors hover:bg-admin-sidebar hover:text-admin-sidebar-text focus-visible:bg-admin-sidebar focus-visible:text-admin-sidebar-text focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeAssessment()}
                      disabled={statusPending}
                      className="block w-full rounded-md px-3 py-2.5 text-left text-[14px] text-admin-logout transition-colors hover:bg-admin-sidebar hover:text-admin-sidebar-text focus-visible:bg-admin-sidebar focus-visible:text-admin-sidebar-text focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={openPreview}
                className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[11px] font-semibold text-admin-text-strong hover:bg-admin-soft sm:h-[52px] sm:rounded-xl sm:px-6 sm:text-[14px]"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={publish}
                disabled={statusPending}
                className="inline-flex h-9 w-auto shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-admin-assessment-gold px-3 text-[11px] font-semibold whitespace-nowrap text-admin-surface hover:bg-admin-assessment-gold-hover disabled:cursor-not-allowed disabled:opacity-60 sm:h-[52px] sm:rounded-xl sm:px-7 sm:text-[14px]"
              >
                {statusPending
                  ? "Publishing…"
                  : document.status === "Published"
                    ? "Publish changes"
                    : "Publish"}
              </button>
            </div>
          </section>

          {actionError ? (
            <p
              role="alert"
              className="mb-3 rounded-lg border border-admin-logout/30 bg-admin-surface px-3 py-2 text-[12px] text-admin-logout"
            >
              {actionError}
            </p>
          ) : null}

          <div
            aria-live="polite"
            className="mb-3 flex min-h-5 items-center gap-2 text-[12px] text-admin-muted"
          >
            {saveState === "saving" ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving…
              </>
            ) : saveState === "saved" ? (
              "All changes saved"
            ) : null}
            {saveState === "error" ? (
              <>
                <span role="alert" className="text-admin-logout">
                  {saveError || "Could not save changes."}
                </span>
                <button
                  type="button"
                  onClick={retrySave}
                  className="cursor-pointer font-semibold text-admin-info hover:underline"
                >
                  Retry
                </button>
              </>
            ) : null}
          </div>

          <div className="grid grid-cols-4 border-b border-admin-border sm:flex sm:gap-5">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "min-w-0 border-b-2 px-0.5 py-2.5 text-[11px] leading-tight font-medium transition-colors sm:shrink-0 sm:border-b-[3px] sm:px-4 sm:pt-0 sm:pb-4 sm:text-[14px]",
                  activeTab === tab
                    ? "border-admin-info text-admin-info"
                    : "border-transparent text-admin-muted hover:text-admin-text",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Questions" || activeTab === "Sections" ? (
            <div className="grid gap-6 py-6 md:grid-cols-[228px_minmax(0,1fr)]">
              <aside className="min-w-0">
                <p className="mb-3 px-3 text-[12px] font-bold tracking-[0.06em] text-admin-muted uppercase">
                  Sections
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
                  {document.sections.map((section) => {
                    const selected = section.id === selectedSectionId;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => {
                          setSelectedSectionId(section.id);
                          setShowQuestionForm(false);
                        }}
                        className={cn(
                          "flex min-h-10 min-w-[118px] cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[12px] md:min-w-0 md:rounded-xl md:px-4 md:py-3 md:text-[14px]",
                          selected
                            ? "bg-admin-info/10 font-semibold text-admin-navy"
                            : "text-admin-text hover:bg-admin-soft",
                        )}
                      >
                        <span className="truncate">{section.title}</span>
                        <span className="text-[12px] text-admin-muted">
                          {section.questions.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={addSection}
                  className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-start gap-2 rounded-lg border border-dashed border-admin-border-strong px-3 text-[12px] font-medium text-admin-info hover:bg-admin-soft md:mt-3 md:h-[50px] md:rounded-xl md:px-4 md:text-[14px]"
                >
                  <Plus className="size-3.5" />
                  Add section
                </button>
              </aside>

              <section className="min-w-0">
                {activeTab === "Sections" ? (
                  <div className="space-y-3">
                    {document.sections.length ? (
                      document.sections.map((section, index) => (
                        <div
                          key={section.id}
                          className="flex flex-wrap items-center gap-3 rounded-xl border border-admin-border-strong bg-admin-surface p-3"
                        >
                          <span className="text-[11px] font-semibold text-admin-muted">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <input
                            aria-label={`Section ${index + 1} name`}
                            value={section.title}
                            onChange={(event) =>
                              updateDocument({
                                ...document,
                                sections: document.sections.map((item) =>
                                  item.id === section.id
                                    ? { ...item, title: event.target.value }
                                    : item,
                                ),
                              })
                            }
                            className="h-9 min-w-[150px] flex-1 rounded-md border border-admin-border-strong px-3 text-[12px] font-medium text-admin-text-strong outline-none focus:border-admin-info"
                          />
                          <span className="text-[11px] text-admin-muted">
                            {section.questions.length} questions
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            aria-label={`Delete ${section.title}`}
                            className="flex size-9 cursor-pointer items-center justify-center rounded-md text-admin-logout hover:bg-admin-soft"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        title="No sections yet"
                        description="Create a section to organize this assessment."
                        action="Add section"
                        onAction={addSection}
                      />
                    )}
                  </div>
                ) : selectedSection ? (
                  <>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="size-2.5 shrink-0 rounded-full bg-admin-info" />
                        <input
                          aria-label="Selected section name"
                          value={selectedSection.title}
                          onChange={(event) =>
                            updateDocument({
                              ...document,
                              sections: document.sections.map((section) =>
                                section.id === selectedSection.id
                                  ? { ...section, title: event.target.value }
                                  : section,
                              ),
                            })
                          }
                          className="min-w-0 border-b border-transparent bg-transparent text-[20px] font-semibold text-admin-text-strong outline-none hover:border-admin-border-strong focus:border-admin-info"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={openNewQuestionForm}
                        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-admin-assessment-gold px-3 text-[12px] font-semibold text-admin-surface hover:bg-admin-assessment-gold-hover sm:h-[46px] sm:gap-2 sm:rounded-xl sm:px-6 sm:text-[14px]"
                      >
                        <Plus className="size-3.5 sm:size-4" />
                        Add question
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedSection.questions.map((question, index) => (
                        <article
                          key={question.id}
                          draggable
                          onDragStart={() => setDraggingQuestionId(question.id)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => {
                            if (draggingQuestionId) {
                              reorderQuestions(draggingQuestionId, question.id);
                            }
                            setDraggingQuestionId(null);
                          }}
                          onDragEnd={() => setDraggingQuestionId(null)}
                          className={cn(
                            "flex min-h-[72px] flex-wrap items-center gap-3 rounded-xl border border-admin-border-strong bg-admin-surface px-4 py-3",
                            draggingQuestionId === question.id && "opacity-50",
                          )}
                        >
                          <GripVertical
                            aria-label="Drag to reorder"
                            className="size-4 shrink-0 cursor-grab text-admin-subtle active:cursor-grabbing"
                          />
                          {!/^Question \d+$/i.test(question.prompt.trim()) ? (
                            <span className="w-5 shrink-0 text-[14px] font-semibold text-admin-muted">
                              {index + 1}
                            </span>
                          ) : null}
                          <div className="min-w-0 flex-1 pl-1">
                            <p className="break-words text-[15px] font-medium text-admin-text-strong">
                              {question.prompt}
                            </p>
                            {question.helperText ? (
                              <p className="mt-1 text-[13px] leading-relaxed text-admin-muted">
                                {question.helperText}
                              </p>
                            ) : null}
                            <p className="mt-1 text-[13px] text-admin-muted">
                              {questionTypeLabels[question.type]}
                              {question.required
                                ? " · Required"
                                : " · Optional"}
                              {question.type === "scale"
                                ? " · 1-10 points"
                                : question.type === "five-point-scale"
                                  ? " · 1–10 scale"
                                  : ""}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openEditQuestionForm(question)}
                            aria-label={`Edit question ${index + 1}`}
                            className="flex size-9 cursor-pointer items-center justify-center rounded-md text-admin-muted hover:bg-admin-soft hover:text-admin-text-strong"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeQuestion(question.id)}
                            aria-label={`Delete question ${index + 1}`}
                            className="flex size-9 cursor-pointer items-center justify-center rounded-md text-admin-logout hover:bg-admin-soft"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </article>
                      ))}
                    </div>

                    {showQuestionForm ? (
                      <div className="mt-3 rounded-xl border border-admin-border-strong bg-admin-surface p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h2 className="text-[13px] font-semibold text-admin-text-strong">
                            {editingQuestionId
                              ? "Edit question"
                              : "New question"}
                          </h2>
                          <button
                            type="button"
                            onClick={() => setShowQuestionForm(false)}
                            aria-label="Close question form"
                            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-admin-muted hover:bg-admin-soft"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                        <label className="grid gap-1.5 text-[11px] font-medium text-admin-text">
                          Question
                          <textarea
                            autoFocus
                            rows={3}
                            value={questionPrompt}
                            onChange={(event) =>
                              setQuestionPrompt(event.target.value)
                            }
                            placeholder="Write your question"
                            className="w-full resize-none rounded-lg border border-admin-border-strong bg-admin-surface px-3 py-2.5 text-[12px] text-admin-text-strong outline-none focus:border-admin-info"
                          />
                        </label>
                        <label className="mt-3 grid gap-1.5 text-[11px] font-medium text-admin-text">
                          Description
                          <textarea
                            rows={2}
                            value={questionDescription}
                            onChange={(event) =>
                              setQuestionDescription(event.target.value)
                            }
                            placeholder="Add a description to help respondents answer."
                            className="w-full resize-none rounded-lg border border-admin-border-strong bg-admin-surface px-3 py-2.5 text-[12px] text-admin-text-strong outline-none focus:border-admin-info"
                          />
                        </label>
                        <div className="mt-3 flex flex-wrap items-end gap-4">
                          <label className="grid gap-1.5 text-[13px] font-medium text-admin-text">
                            Answer type
                            <span className="relative block">
                              <button
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded={questionTypeOpen}
                                aria-controls="question-type-options"
                                onClick={() =>
                                  setQuestionTypeOpen((open) => !open)
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Escape") {
                                    setQuestionTypeOpen(false);
                                  }
                                }}
                                className="flex h-11 w-[164px] cursor-pointer items-center justify-between gap-2 rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[14px] font-normal text-admin-text-strong shadow-admin-card transition-colors hover:bg-admin-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-info"
                              >
                                {questionTypeLabels[questionType]}
                                <ChevronDown
                                  className={cn(
                                    "size-3.5 text-admin-muted transition-transform",
                                    questionTypeOpen && "rotate-180",
                                  )}
                                />
                              </button>
                              {questionTypeOpen ? (
                                <div
                                  id="question-type-options"
                                  role="listbox"
                                  aria-label="Answer type"
                                  className="absolute top-[calc(100%+4px)] left-0 z-30 w-full overflow-y-auto rounded-lg border border-admin-border-strong bg-admin-surface p-1 shadow-lg"
                                >
                                  {(
                                    Object.entries(questionTypeLabels) as [
                                      QuestionType,
                                      string,
                                    ][]
                                  ).map(([type, label]) => (
                                    <button
                                      key={type}
                                      type="button"
                                      role="option"
                                      aria-selected={questionType === type}
                                      onClick={() => {
                                        setQuestionType(type);
                                        setQuestionTypeOpen(false);
                                      }}
                                      className={cn(
                                        "block w-full cursor-pointer rounded-md px-3 py-2 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-admin-info",
                                        questionType === type
                                          ? "bg-admin-navy font-medium text-admin-surface"
                                          : "text-admin-text-strong hover:bg-admin-soft",
                                      )}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              ) : null}
                            </span>
                          </label>
                          <label className="inline-flex h-11 cursor-pointer items-center gap-2 text-[14px] text-admin-text">
                            <input
                              type="checkbox"
                              checked={questionRequired}
                              onChange={(event) =>
                                setQuestionRequired(event.target.checked)
                              }
                              className="size-4 accent-admin-info"
                            />
                            Required
                          </label>
                          <button
                            type="button"
                            disabled={!questionPrompt.trim()}
                            onClick={saveQuestion}
                            className="ml-auto inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-admin-navy px-4 text-[12px] font-semibold text-admin-surface hover:bg-admin-navy-hover disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Check className="size-3.5" />
                            Save question
                          </button>
                        </div>
                      </div>
                    ) : null}
                    <p className="mt-5 text-[13px] text-admin-muted">
                      Drag to reorder. Changes stay in draft until you publish.
                    </p>
                  </>
                ) : (
                  <EmptyState
                    title="Start with a section"
                    description="Add a section, then add questions inside it."
                    action="Add section"
                    onAction={addSection}
                  />
                )}
              </section>
            </div>
          ) : null}

          {activeTab === "Results text" ? (
            <section className="max-w-5xl py-6">
              <label className="grid gap-2 text-[14px] font-medium text-admin-text-strong">
                Results introduction
                <textarea
                  rows={8}
                  value={document.resultText}
                  onChange={(event) =>
                    updateDocument({
                      ...document,
                      resultText: event.target.value,
                    })
                  }
                  placeholder="Explain what participants will see after completing the assessment."
                  className="w-full resize-none rounded-xl border border-admin-border-strong bg-admin-surface p-4 text-[14px] leading-6 font-normal text-admin-text outline-none transition-colors placeholder:text-admin-muted focus:border-admin-info focus:ring-2 focus:ring-admin-info/15"
                />
              </label>
              <p className="mt-2 text-[12px] text-admin-muted">
                This text appears at the beginning of the participant results.
              </p>
            </section>
          ) : null}

          {activeTab === "Settings" ? (
            <section className="grid max-w-5xl gap-5 py-6">
              <label className="grid gap-2 text-[14px] font-medium text-admin-text-strong">
                Assessment name
                <input
                  value={document.title}
                  maxLength={200}
                  onBlur={normalizeTitle}
                  onChange={(event) =>
                    updateDocument({ ...document, title: event.target.value })
                  }
                  className="h-11 w-full rounded-lg border border-admin-border-strong bg-admin-surface px-3 text-[14px] font-normal text-admin-text outline-none transition-colors placeholder:text-admin-muted focus:border-admin-info focus:ring-2 focus:ring-admin-info/15"
                />
              </label>
              <label className="grid gap-2 text-[14px] font-medium text-admin-text-strong">
                Introduction
                <textarea
                  rows={8}
                  value={document.settings.introduction}
                  onChange={(event) =>
                    updateDocument({
                      ...document,
                      settings: {
                        ...document.settings,
                        introduction: event.target.value,
                      },
                    })
                  }
                  placeholder="Add instructions or context for participants."
                  className="w-full resize-none rounded-lg border border-admin-border-strong bg-admin-surface p-4 text-[14px] leading-6 font-normal text-admin-text outline-none transition-colors placeholder:text-admin-muted focus:border-admin-info focus:ring-2 focus:ring-admin-info/15"
                />
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-admin-text-strong">
                <input
                  type="checkbox"
                  checked={document.settings.allowRetake}
                  onChange={(event) =>
                    updateDocument({
                      ...document,
                      settings: {
                        ...document.settings,
                        allowRetake: event.target.checked,
                      },
                    })
                  }
                  className="size-4 accent-admin-info"
                />
                Allow participants to retake this assessment
              </label>
            </section>
          ) : null}
        </div>
      </main>

      {previewOpen ? (
        <AdminAssessmentPreviewSheet
          assessment={document}
          onClose={() => setPreviewOpen(false)}
          initialMode={previewInitialMode}
          initialSectionId={previewInitialSectionId}
          onCreateQuestion={(question, sectionId) => {
            const sections = document.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    questions: [
                      ...section.questions,
                      { ...question, id: createId("question") },
                    ],
                  }
                : section,
            );
            updateDocument({ ...document, sections });
            setSelectedSectionId(sectionId);
            setActiveTab("Questions");
          }}
          onCreateSection={saveNewSection}
        />
      ) : null}
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
  onAction,
}: {
  title: string;
  description: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-admin-border-strong bg-admin-surface p-6 text-center">
      <CirclePlus className="size-7 text-admin-subtle" />
      <h2 className="mt-3 text-[14px] font-semibold text-admin-text-strong">
        {title}
      </h2>
      <p className="mt-1 max-w-sm text-[12px] text-admin-muted">
        {description}
      </p>
      <button
        type="button"
        onClick={onAction}
        className="mt-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-admin-border-strong px-3 text-[12px] font-semibold text-admin-info hover:bg-admin-soft"
      >
        <Plus className="size-3.5" />
        {action}
      </button>
    </div>
  );
}

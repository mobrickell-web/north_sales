import {
  AdminApiError,
  adminDownload,
  adminFetch,
  type StaffPosition,
} from "@/lib/auth-api";

/** A8 + A13 + A14 — Current Status values. */
export const LEAD_STATUSES = [
  "NEW_PROSPECT",
  "NO_ANSWER",
  "GATEKEEPER_REACHED",
  "DECISION_MAKER_REACHED",
  "CALLBACK_REQUIRED",
  "INTERESTED",
  "ZOOM_SCHEDULED",
  "APPOINTMENT_COMPLETED",
  "PROPOSAL_SENT",
  "CLIENT_ACQUIRED",
  "NOT_INTERESTED",
  "NOT_QUALIFIED",
  "DO_NOT_CONTACT",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW_PROSPECT: "New Prospect",
  NO_ANSWER: "No Answer",
  GATEKEEPER_REACHED: "Gatekeeper Reached",
  DECISION_MAKER_REACHED: "Decision Maker Reached",
  CALLBACK_REQUIRED: "Callback Required",
  INTERESTED: "Interested",
  ZOOM_SCHEDULED: "Zoom Scheduled",
  APPOINTMENT_COMPLETED: "Appointment Completed",
  PROPOSAL_SENT: "Proposal Sent",
  CLIENT_ACQUIRED: "Client Acquired",
  NOT_INTERESTED: "Not Interested",
  NOT_QUALIFIED: "Not Qualified",
  DO_NOT_CONTACT: "Do Not Contact",
};

/** A12 — Annual Gross Revenue kind. */
export const ANNUAL_GROSS_REVENUE_KINDS = [
  "REPORTED",
  "ESTIMATED",
  "UNKNOWN",
] as const;

export type AnnualGrossRevenueKind =
  (typeof ANNUAL_GROSS_REVENUE_KINDS)[number];

export const ANNUAL_GROSS_REVENUE_KIND_LABELS: Record<
  AnnualGrossRevenueKind,
  string
> = {
  REPORTED: "Reported",
  ESTIMATED: "Estimated",
  UNKNOWN: "Unknown",
};

/** A12 — Existing Sales Force. */
export const EXISTING_SALES_FORCE_VALUES = ["YES", "NO", "UNKNOWN"] as const;

export type ExistingSalesForce = (typeof EXISTING_SALES_FORCE_VALUES)[number];

export const EXISTING_SALES_FORCE_LABELS: Record<ExistingSalesForce, string> = {
  YES: "Yes",
  NO: "No",
  UNKNOWN: "Unknown",
};

export type LeadOwner = {
  id: string;
  name: string;
  email: string;
  role: string;
  position: StaffPosition | null;
};

export type LeadPrimaryContact = {
  id: string;
  name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
};

export type Lead = {
  id: string;
  /** A11 — null when unassigned. */
  ownerId: string | null;
  companyName: string;
  website: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  gatekeeperName: string | null;
  gatekeeperPhone: string | null;
  decisionMakerName: string | null;
  decisionMakerEmail: string | null;
  decisionMakerPhone: string | null;
  /** A12 — Annual Gross Revenue amount (free-text). */
  annualRevenue: string | null;
  /** A12 — Reported / Estimated / Unknown. */
  annualGrossRevenueKind: AnnualGrossRevenueKind | null;
  /** A12 — Existing Sales Force Yes / No / Unknown. */
  existingSalesForce: ExistingSalesForce | null;
  /** A12 — Number of Sales Representatives. */
  numberOfSalesRepresentatives: number | null;
  /** Legacy free-text size (synced from number when set). */
  salesForceSize: string | null;
  /** A12 — Lead Source. */
  leadSource: string | null;
  status: LeadStatus;
  notQualifiedReason: string | null;
  followUpAt: string | null;
  followUpNotes: string | null;
  appointmentAt: string | null;
  appointmentNotes: string | null;
  /** A13 — set when appointment is marked completed (keeps appointmentAt). */
  appointmentCompletedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  /** A11 — null when unassigned. */
  owner: LeadOwner | null;
  /** A11 — first contact by name (for list Contact Person). */
  primaryContact?: LeadPrimaryContact | null;
  /** A11 — latest call timestamp (for list Last Contact). */
  lastContactAt?: string | null;
};

/** Create payload. `companyName` is required. Admin may omit `ownerId` (unassigned). */
export type CreateLeadInput = {
  companyName: string;
  ownerId?: string;
  website?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gatekeeperName?: string;
  gatekeeperPhone?: string;
  decisionMakerName?: string;
  decisionMakerEmail?: string;
  decisionMakerPhone?: string;
  annualRevenue?: string;
  annualGrossRevenueKind?: AnnualGrossRevenueKind;
  existingSalesForce?: ExistingSalesForce;
  numberOfSalesRepresentatives?: number | null;
  salesForceSize?: string;
  leadSource?: string;
  status?: LeadStatus;
  notQualifiedReason?: string;
  followUpAt?: string;
  followUpNotes?: string;
  appointmentAt?: string;
  appointmentNotes?: string;
  notes?: string;
  /** A5 — proceed after reviewing duplicate warnings. */
  acknowledgeDuplicates?: boolean;
};

/**
 * Partial update. Empty string clears optional text/date fields on the server.
 * Admin may reassign via `ownerId`.
 */
export type UpdateLeadInput = {
  companyName?: string;
  ownerId?: string;
  website?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gatekeeperName?: string;
  gatekeeperPhone?: string;
  decisionMakerName?: string;
  decisionMakerEmail?: string;
  decisionMakerPhone?: string;
  annualRevenue?: string;
  /** Empty string clears. */
  annualGrossRevenueKind?: AnnualGrossRevenueKind | "";
  /** Empty string clears. */
  existingSalesForce?: ExistingSalesForce | "";
  /** `null` or omit-after-clear via empty — null clears. */
  numberOfSalesRepresentatives?: number | null;
  salesForceSize?: string;
  leadSource?: string;
  status?: LeadStatus;
  notQualifiedReason?: string;
  followUpAt?: string;
  followUpNotes?: string;
  appointmentAt?: string;
  appointmentNotes?: string;
  notes?: string;
  /** A5 — proceed after reviewing duplicate warnings. */
  acknowledgeDuplicates?: boolean;
};

export type LeadDuplicateMatchField = "company" | "website" | "phone";

export type LeadDuplicateHit = {
  id: string;
  companyName: string;
  website: string | null;
  phone: string | null;
  status: LeadStatus;
  owner: { id: string; name: string; email: string } | null;
  matchedOn: LeadDuplicateMatchField[];
};

/** @deprecated Prefer CreateLeadInput / UpdateLeadInput. */
export type LeadInput = CreateLeadInput;

/** Click-through buckets matching GET /leads/totals. */
export const LEAD_LIST_FILTERS = [
  "active",
  "follow_ups_due_today",
  "follow_ups_overdue",
  "upcoming_appointments",
] as const;

export type LeadListFilter = (typeof LEAD_LIST_FILTERS)[number];

export const LEAD_LIST_FILTER_LABELS: Record<LeadListFilter, string> = {
  active: "Active leads",
  follow_ups_due_today: "Follow-ups due today",
  follow_ups_overdue: "Overdue follow-ups",
  upcoming_appointments: "Upcoming appointments",
};

export type ListLeadsParams = {
  q?: string;
  status?: LeadStatus;
  /** Master Admin only — filter by assigned rep. */
  ownerId?: string;
  /** Dashboard totals click-through filter. */
  filter?: LeadListFilter;
};

/** Display label: company first, then contact name. */
export function leadDisplayName(lead: Pick<Lead, "companyName" | "name">) {
  return lead.companyName || lead.name || "Untitled lead";
}

/** A11 — Contact Person for list rows. */
export function leadContactPerson(
  lead: Pick<
    Lead,
    "primaryContact" | "name" | "decisionMakerName" | "gatekeeperName"
  >,
) {
  return (
    lead.primaryContact?.name ||
    lead.name ||
    lead.decisionMakerName ||
    lead.gatekeeperName ||
    null
  );
}

/** A11 — Phone for list rows (prefer primary contact phone). */
export function leadListPhone(
  lead: Pick<Lead, "primaryContact" | "phone" | "decisionMakerPhone">,
) {
  return (
    lead.primaryContact?.phone || lead.phone || lead.decisionMakerPhone || null
  );
}

/** A11 — assignee label; unassigned when owner is null. */
export function leadOwnerLabel(lead: Pick<Lead, "owner">) {
  return lead.owner?.name ?? "Unassigned";
}

function buildLeadsQuery(params?: ListLeadsParams) {
  const search = new URLSearchParams();
  if (params?.q?.trim()) search.set("q", params.q.trim());
  if (params?.status) search.set("status", params.status);
  if (params?.ownerId) search.set("ownerId", params.ownerId);
  if (params?.filter) search.set("filter", params.filter);
  const suffix = search.toString();
  return suffix ? `?${suffix}` : "";
}

export function listLeads(params?: ListLeadsParams) {
  return adminFetch<Lead[]>(`/api/v1/leads${buildLeadsQuery(params)}`);
}

export function getLead(id: string) {
  return adminFetch<Lead>(`/api/v1/leads/${encodeURIComponent(id)}`);
}

/**
 * Active Sales Representatives for Admin assignment.
 * Returns [] for reps (assignment is Admin-only).
 */
export function listLeadAssignees() {
  return adminFetch<LeadOwner[]>("/api/v1/leads/assignees");
}

export function createLead(input: CreateLeadInput) {
  return adminFetch<Lead>("/api/v1/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateLead(id: string, input: UpdateLeadInput) {
  return adminFetch<Lead>(`/api/v1/leads/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function checkLeadDuplicates(input: {
  companyName?: string;
  website?: string;
  phone?: string;
  excludeId?: string;
}) {
  const search = new URLSearchParams();
  if (input.companyName?.trim())
    search.set("companyName", input.companyName.trim());
  if (input.website?.trim()) search.set("website", input.website.trim());
  if (input.phone?.trim()) search.set("phone", input.phone.trim());
  if (input.excludeId) search.set("excludeId", input.excludeId);
  const suffix = search.toString();
  return adminFetch<{ duplicates: LeadDuplicateHit[] }>(
    `/api/v1/leads/duplicates${suffix ? `?${suffix}` : ""}`,
  );
}

export function isLeadDuplicatesError(
  error: unknown,
): error is AdminApiError & { duplicates: LeadDuplicateHit[] } {
  return (
    error instanceof AdminApiError &&
    error.status === 409 &&
    error.code === "LEAD_DUPLICATES" &&
    Array.isArray(error.duplicates)
  );
}

/** A5 — download CSV for the current list scope/filters. */
export async function downloadLeadsCsv(params?: ListLeadsParams) {
  const { blob, filename } = await adminDownload(
    `/api/v1/leads/export${buildLeadsQuery(params)}`,
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download =
    filename ?? `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function deleteLead(id: string) {
  return adminFetch<{ deleted: true }>(
    `/api/v1/leads/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}

// ---------------------------------------------------------------------------
// A2 — Activities, follow-ups, CRM totals
// ---------------------------------------------------------------------------

export const MANUAL_LEAD_ACTIVITY_TYPES = [
  "NOTE",
  "CALL",
  "EMAIL",
  "MEETING",
] as const;

export type ManualLeadActivityType =
  (typeof MANUAL_LEAD_ACTIVITY_TYPES)[number];

export type LeadActivityType =
  | ManualLeadActivityType
  | "FOLLOW_UP_SCHEDULED"
  | "FOLLOW_UP_COMPLETED"
  | "APPOINTMENT_COMPLETED"
  | "REASSIGNED";

export const LEAD_ACTIVITY_TYPE_LABELS: Record<LeadActivityType, string> = {
  NOTE: "Note",
  CALL: "Call",
  EMAIL: "Email",
  MEETING: "Meeting",
  FOLLOW_UP_SCHEDULED: "Follow-up scheduled",
  FOLLOW_UP_COMPLETED: "Follow-up completed",
  APPOINTMENT_COMPLETED: "Appointment completed",
  REASSIGNED: "Reassigned",
};

export type LeadContact = {
  id: string;
  leadId: string;
  name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadActivity = {
  id: string;
  leadId: string;
  authorId: string | null;
  authorName: string;
  type: LeadActivityType;
  body: string;
  /** A9 — permanent call disposition; null for non-call rows. */
  disposition: LeadStatus | null;
  /** A9 — next follow-up noted on the call row. */
  nextFollowUpAt: string | null;
  /** A10 — contact spoken to (nullable). */
  contactId: string | null;
  contact?: LeadContact | null;
  createdAt: string;
};

export type CreateLeadCallInput = {
  disposition: LeadStatus;
  notes: string;
  followUpAt?: string;
  /** When true, also set lead Current Status to this disposition. */
  updateCurrentStatus?: boolean;
  /** A10 — contact spoken to (must belong to this lead). */
  contactId?: string;
};

export type CreateLeadContactInput = {
  name: string;
  title?: string;
  phone?: string;
  email?: string;
};

export type UpdateLeadContactInput = {
  name?: string;
  title?: string;
  phone?: string;
  email?: string;
};

export type LeadFollowUp = {
  id: string;
  leadId: string;
  createdById: string | null;
  createdByName: string;
  dueAt: string;
  notes: string | null;
  completedAt: string | null;
  completedById: string | null;
  completedByName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadCrmTotals = {
  activeLeads: number;
  followUpsDueToday: number;
  followUpsOverdue: number;
  upcomingAppointments: number;
};

export type CreateLeadActivityInput = {
  type: ManualLeadActivityType;
  body: string;
};

export type CreateLeadFollowUpInput = {
  dueAt: string;
  notes?: string;
};

export function getLeadTotals() {
  return adminFetch<LeadCrmTotals>("/api/v1/leads/totals");
}

export function listLeadActivities(leadId: string) {
  return adminFetch<LeadActivity[]>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/activities`,
  );
}

export function addLeadActivity(
  leadId: string,
  input: CreateLeadActivityInput,
) {
  return adminFetch<LeadActivity>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/activities`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

/** A9 — company-level call disposition history (newest first). */
export function listLeadCalls(leadId: string) {
  return adminFetch<LeadActivity[]>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/calls`,
  );
}

/** A9 — log a call with permanent disposition (append-only). */
export function logLeadCall(leadId: string, input: CreateLeadCallInput) {
  return adminFetch<LeadActivity>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/calls`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

/** A10 — list contacts under a company/prospect. */
export function listLeadContacts(leadId: string) {
  return adminFetch<LeadContact[]>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/contacts`,
  );
}

export function createLeadContact(
  leadId: string,
  input: CreateLeadContactInput,
) {
  return adminFetch<LeadContact>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/contacts`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function updateLeadContact(
  leadId: string,
  contactId: string,
  input: UpdateLeadContactInput,
) {
  return adminFetch<LeadContact>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/contacts/${encodeURIComponent(contactId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export function deleteLeadContact(leadId: string, contactId: string) {
  return adminFetch<{ deleted: true }>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/contacts/${encodeURIComponent(contactId)}`,
    { method: "DELETE" },
  );
}

export function listLeadFollowUps(leadId: string) {
  return adminFetch<LeadFollowUp[]>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/follow-ups`,
  );
}

export function scheduleLeadFollowUp(
  leadId: string,
  input: CreateLeadFollowUpInput,
) {
  return adminFetch<LeadFollowUp>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/follow-ups`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function completeLeadFollowUp(leadId: string, followUpId: string) {
  return adminFetch<LeadFollowUp>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/follow-ups/${encodeURIComponent(followUpId)}/complete`,
    { method: "POST" },
  );
}

/** A13 — Mark the lead’s manual CRM appointment completed. */
export function completeLeadAppointment(
  leadId: string,
  input?: { notes?: string },
) {
  return adminFetch<Lead>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/appointment/complete`,
    {
      method: "POST",
      body: JSON.stringify(input ?? {}),
    },
  );
}

/** Master Admin only — assign / reassign a lead to an active Sales Representative. */
export function assignLead(leadId: string, ownerId: string) {
  return adminFetch<Lead>(
    `/api/v1/leads/${encodeURIComponent(leadId)}/assign`,
    {
      method: "POST",
      body: JSON.stringify({ ownerId }),
    },
  );
}

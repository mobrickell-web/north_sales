import { adminFetch } from "@/lib/auth-api";

export type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadInput = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
};

export function listLeads() {
  return adminFetch<Lead[]>("/api/v1/leads");
}

export function createLead(input: LeadInput) {
  return adminFetch<Lead>("/api/v1/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Partial update; an empty string clears an optional field.
export function updateLead(id: string, input: Partial<LeadInput>) {
  return adminFetch<Lead>(`/api/v1/leads/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteLead(id: string) {
  return adminFetch<{ deleted: true }>(
    `/api/v1/leads/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}

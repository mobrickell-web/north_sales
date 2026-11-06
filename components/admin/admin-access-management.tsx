"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";

import {
  AdminAlert,
  AdminCard,
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-ui";
import {
  STAFF_POSITION_LABELS,
  createClientAccount,
  createSalesRepresentative,
  deactivateClientAccess,
  decideClientAccessRequest,
  deactivateSalesRepresentative,
  listClientAccessRequests,
  listSalesRepresentatives,
  restoreClientAccess,
  restoreSalesRepresentative,
  type ClientAccessRequest,
  type SalesRepresentative,
  type StaffPosition,
} from "@/lib/auth-api";

const staffPositionOptions = Object.entries(STAFF_POSITION_LABELS) as [
  StaffPosition,
  string,
][];

function isStaffPosition(value: string): value is StaffPosition {
  return value in STAFF_POSITION_LABELS;
}

export function AdminAccessManagement() {
  const [requests, setRequests] = useState<ClientAccessRequest[]>([]);
  const [representatives, setRepresentatives] = useState<SalesRepresentative[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingClient, setSavingClient] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [nextRequests, nextRepresentatives] = await Promise.all([
        listClientAccessRequests(),
        listSalesRepresentatives(),
      ]);
      setRequests(nextRequests);
      setRepresentatives(nextRepresentatives);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load access management data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const decide = async (
    request: ClientAccessRequest,
    decision: "APPROVE" | "REJECT",
  ) => {
    setWorkingId(request.id);
    setError("");
    setNotice("");
    try {
      await decideClientAccessRequest(request.id, decision);
      setNotice(
        `${request.account.name}'s access request was ${decision.toLowerCase()}d.`,
      );
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not update the request.",
      );
    } finally {
      setWorkingId(null);
    }
  };

  const setClientAccess = async (
    request: ClientAccessRequest,
    action: "REMOVE" | "RESTORE",
  ) => {
    if (
      action === "REMOVE" &&
      !window.confirm(
        `Remove ${request.account.name}'s access? Their active sessions will be revoked.`,
      )
    ) {
      return;
    }

    setWorkingId(request.id);
    setError("");
    setNotice("");
    try {
      if (action === "REMOVE") {
        await deactivateClientAccess(request.account.id);
        setNotice(
          `${request.account.name}'s access has been removed and active sessions revoked.`,
        );
      } else {
        await restoreClientAccess(request.account.id);
        setNotice(
          `${request.account.name}'s access has been restored. Previous sessions remain revoked.`,
        );
      }
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : `Could not ${action === "REMOVE" ? "remove" : "restore"} client access.`,
      );
    } finally {
      setWorkingId(null);
    }
  };

  const addClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSavingClient(true);
    setError("");
    setNotice("");
    try {
      const client = await createClientAccount({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      form.reset();
      setNotice(
        `Client account created for ${client.name}. Share their login credentials with them directly.`,
      );
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not create the client account.",
      );
    } finally {
      setSavingClient(false);
    }
  };

  const addRepresentative = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const position = String(formData.get("position") ?? "");
    if (!isStaffPosition(position)) {
      setNotice("");
      setError("Select a position for the team member.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await createSalesRepresentative({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        position,
      });
      form.reset();
      setNotice(`${STAFF_POSITION_LABELS[position]} account created.`);
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not create the team member account.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeRepresentative = async (representative: SalesRepresentative) => {
    if (
      !window.confirm(
        `Remove ${representative.name}'s access? Their active sessions will be revoked.`,
      )
    ) {
      return;
    }
    setWorkingId(representative.id);
    setError("");
    setNotice("");
    try {
      await deactivateSalesRepresentative(representative.id);
      setNotice(`${representative.name}'s access has been removed.`);
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not remove the team member account.",
      );
    } finally {
      setWorkingId(null);
    }
  };

  const restoreRepresentative = async (representative: SalesRepresentative) => {
    setWorkingId(representative.id);
    setError("");
    setNotice("");
    try {
      await restoreSalesRepresentative(representative.id);
      setNotice(
        `${representative.name}'s access has been restored. Their previous sessions remain revoked.`,
      );
      await loadData();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not restore the team member's access.",
      );
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="mx-auto mt-6 flex w-full max-w-[1500px] flex-col gap-6">
      {error ? <AdminAlert>{error}</AdminAlert> : null}
      {notice ? <AdminAlert tone="info">{notice}</AdminAlert> : null}

      <AdminCard
        title="Clients"
        description="Create client accounts and share their login credentials with them, review access requests, and manage access. Removing access revokes the client's active sessions."
      >
        <form
          onSubmit={(event) => void addClient(event)}
          className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <label>
            <span className={adminLabelClass}>Client name</span>
            <input
              name="name"
              required
              maxLength={120}
              className={adminInputClass}
              autoComplete="off"
            />
          </label>
          <label>
            <span className={adminLabelClass}>Email</span>
            <input
              name="email"
              type="email"
              required
              maxLength={255}
              className={adminInputClass}
              autoComplete="off"
            />
          </label>
          <label>
            <span className={adminLabelClass}>Initial password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              className={adminInputClass}
              autoComplete="new-password"
            />
          </label>
          <button
            type="submit"
            disabled={savingClient}
            className={`${adminPrimaryButtonClass} self-end`}
          >
            <UserPlus className="mr-2 size-4" />
            {savingClient ? "Creating…" : "Create client"}
          </button>
        </form>

        {loading ? (
          <p className="flex items-center gap-2 text-[14px] text-admin-muted">
            <Loader2 className="size-4 animate-spin" />
            Loading requests…
          </p>
        ) : requests.length === 0 ? (
          <p className="text-[14px] text-admin-muted">
            There are no client accounts or access requests.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E8E4DC] font-secondary text-[11px] tracking-[0.08em] text-[#5C5F66] uppercase">
                  <th className="px-3 py-3">Client</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Added</th>
                  <th className="px-3 py-3">Email status</th>
                  <th className="px-3 py-3">Access status</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-[#E8E4DC] last:border-0"
                  >
                    <td className="px-3 py-4 font-semibold text-[#001528]">
                      {request.account.name}
                    </td>
                    <td className="px-3 py-4 text-[13px] text-[#5C5F66]">
                      {request.account.email}
                    </td>
                    <td className="px-3 py-4 text-[13px] text-[#5C5F66]">
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-4 text-[13px]">
                      {request.account.emailVerifiedAt
                        ? "Verified"
                        : "Not verified"}
                    </td>
                    <td className="px-3 py-4 text-[13px]">
                      {request.status === "PENDING"
                        ? "Pending"
                        : request.status === "REJECTED"
                          ? "Rejected"
                          : request.account.isActive
                            ? "Approved"
                            : "Access removed"}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        {request.status === "PENDING" ? (
                          <>
                            <button
                              type="button"
                              disabled={
                                workingId === request.id ||
                                !request.account.emailVerifiedAt
                              }
                              onClick={() => void decide(request, "APPROVE")}
                              className="rounded-full bg-[#1f6b33] px-3 py-1.5 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={workingId === request.id}
                              onClick={() => void decide(request, "REJECT")}
                              className="rounded-full bg-[#8f2d2d] px-3 py-1.5 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Reject
                            </button>
                          </>
                        ) : request.status === "APPROVED" ? (
                          request.account.isActive ? (
                            <button
                              type="button"
                              disabled={workingId === request.id}
                              onClick={() =>
                                void setClientAccess(request, "REMOVE")
                              }
                              className="rounded-full border border-[#f3c9c9] px-3 py-1.5 text-[11px] font-bold text-[#8f2d2d] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Remove access
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={workingId === request.id}
                              onClick={() =>
                                void setClientAccess(request, "RESTORE")
                              }
                              className="rounded-full border border-[#1f6b33]/30 px-3 py-1.5 text-[11px] font-bold text-[#1f6b33] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Restore access
                            </button>
                          )
                        ) : (
                          <span className="text-[12px] text-admin-muted">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <AdminCard
        title="Team members"
        description="Create Account Executive, Implementation Specialist, Fractional VP, and Regional Sales Manager accounts, remove access, or restore a deactivated account. Removing access revokes all active sessions."
      >
        <form
          onSubmit={(event) => void addRepresentative(event)}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
        >
          <label>
            <span className={adminLabelClass}>Name</span>
            <input
              name="name"
              required
              maxLength={120}
              className={adminInputClass}
              autoComplete="name"
            />
          </label>
          <label>
            <span className={adminLabelClass}>Email</span>
            <input
              name="email"
              type="email"
              required
              maxLength={255}
              className={adminInputClass}
              autoComplete="email"
            />
          </label>
          <label>
            <span className={adminLabelClass}>Initial password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              className={adminInputClass}
              autoComplete="new-password"
            />
          </label>
          <label>
            <span className={adminLabelClass}>Position</span>
            <select
              name="position"
              required
              defaultValue=""
              className={adminInputClass}
            >
              <option value="" disabled>
                Select position
              </option>
              {staffPositionOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={saving}
            className={`${adminPrimaryButtonClass} self-end`}
          >
            <UserPlus className="mr-2 size-4" />
            {saving ? "Creating…" : "Add team member"}
          </button>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E8E4DC] font-secondary text-[11px] tracking-[0.08em] text-[#5C5F66] uppercase">
                <th className="px-3 py-3">Team member</th>
                <th className="px-3 py-3">Position</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Added</th>
                <th className="px-3 py-3">Access</th>
              </tr>
            </thead>
            <tbody>
              {representatives.map((representative) => (
                <tr
                  key={representative.id}
                  className="border-b border-[#E8E4DC] last:border-0"
                >
                  <td className="px-3 py-4 font-semibold text-[#001528]">
                    {representative.name}
                  </td>
                  <td className="px-3 py-4 text-[13px] text-[#001528]">
                    {representative.position
                      ? STAFF_POSITION_LABELS[representative.position]
                      : "—"}
                  </td>
                  <td className="px-3 py-4 text-[13px] text-[#5C5F66]">
                    {representative.email}
                  </td>
                  <td className="px-3 py-4 text-[13px] text-[#5C5F66]">
                    {new Date(representative.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-4">
                    {representative.isActive ? (
                      <button
                        type="button"
                        disabled={workingId === representative.id}
                        onClick={() =>
                          void removeRepresentative(representative)
                        }
                        className="rounded-full border border-[#f3c9c9] px-3 py-1.5 text-[11px] font-bold text-[#8f2d2d] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove access
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={workingId === representative.id}
                        onClick={() =>
                          void restoreRepresentative(representative)
                        }
                        className="rounded-full border border-[#1f6b33]/30 px-3 py-1.5 text-[11px] font-bold text-[#1f6b33] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Restore access
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && representatives.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-5 text-[14px] text-admin-muted"
                  >
                    No team members have been added.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}

# Implementation Workflow — North Sales Backend

Companion to `docs/APPOINTMENT-FLOW.md`. Backend repo: `north-landing/backend` (NestJS 12 + Prisma 7 + PostgreSQL on Docker). Frontend: `north_sales` (Next.js).

Status legend: ✅ done · ⏳ in progress · ⬜ pending

---

## Chunk 0 — Prereqs

- ✅ Native PostgreSQL on port 5432 had unknown credentials → Docker container `north-sales-postgres` (`postgres:16-alpine`) on **port 5434**, DB `north_sales`, user `postgres` / `mysecret123`, volume `north-sales-pgdata`.
- ✅ `backend/.env` → `DATABASE_URL=postgresql://postgres:mysecret123@localhost:5434/north_sales?schema=public` (+ example with the docker run command).
- ✅ `backend/tsconfig.json` `include: ["src/**/*"]` (fixes VS Code rootDir noise).

## Chunk 1 — DB schema & seed ✅

- ✅ Migration `20260929154746_init`: `admin_users`, `appointments`, `appointment_logs`.
- ✅ Enums: single role `SUPER_ADMIN`; `AppointmentType` matches the site form (4 types); `AppointmentStatus` flow (CONFIRMED/RESCHEDULED/CANCELLED/COMPLETED; legacy unused `NO_SHOW` kept in DB only — provider can't `DROP VALUE`); `ActionType` log events.
- ✅ Idempotent seed: `admin@northpointsales.com` / SUPER_ADMIN / active.
- ✅ `appointment.rescheduleToken` + `cancelToken` unique UUIDs (email link tokens), `scheduledAtUtc`, `prospectTimezone`, `durationMinutes`, `cancellationReason`, reminder-flag columns.

## Chunk 2 — Auth, envelope, refresh tokens ✅

- ✅ `POST /auth/login`, `GET /auth/me` (Local + JWT strategies, `@CurrentUser()`, `JwtAuthGuard`).
- ✅ Rate limits (@nestjs/throttler): global 50/min, login 5/min.
- ✅ Swagger (`/api-docs`) with bearer.
- ✅ Response envelope everywhere: success `{status, data, meta:{timestamp, requestId}}`; errors `{status, message, statusCode, path, method, meta}` + `X-Request-Id` header (TransformInterceptor, AllExceptionsFilter, request-id middleware).
- ✅ Refresh tokens: `admin_refresh_tokens` table (migration `20260929172605_add_refresh_tokens`), opaque tokens stored as SHA-256, rotation on refresh, **family revocation** on reuse, logout revokes. TTL from `JWT_REFRESH_EXPIRES_IN=7d`.
- ✅ Failed-login audit loop in backend logs.

## Chunk 3 — Public booking API ✅

- ✅ `POST /api/v1/appointments` (201, no auth) — DTO mapped 1:1 to the site form: `contactName, companyName, email, appointmentType, date, time, timezone, duration`.
- ✅ Human labels → DB enum (4 types), US-timezone labels → IANA (`date-fns-tz` `fromZonedTime`), `30/45/60 minutes` → `durationMinutes`, full time-slot whitelist.
- ✅ `GET /api/v1/appointments/manage/:token` (accepts reschedule or cancel token) — internal loader for the reschedule/cancel pages.
- ✅ `PATCH /api/v1/appointments/:token/reschedule` (rescheduleToken) → `RESCHEDULED`.
- ✅ `DELETE /api/v1/appointments/:token/cancel` (cancelToken, optional reason) → `CANCELLED`.
- ✅ Audit rows: `BOOKED`, `RESCHEDULED_BY_PROSPECT`, `CANCELLED_BY_PROSPECT` with previous/new times.
- ✅ Guards: past time 400, no-op reschedule 400, 404 bad token, 409 on CANCELLED/COMPLETED/NO_SHOW (public links use `assertMutable()`). End-to-end verified. ⚠️ This is **not** the admin status contract — see Chunk 11 Step 6 for the looser admin rules.

## Chunk 4 — Admin appointment management ✅

- ✅ `GET /api/v1/admin/appointments` — **3 tabs**: `upcoming` (CONFIRMED+RESCHEDULED, `scheduledAtUtc >= now`), `completed`, `cancelled`; paginated (`skip`/`take`), search (name/company/email), `from`/`to` date filter.
- ✅ `GET /api/v1/admin/appointments/:id` — detail + audit history, with `adminUser.name` flattened onto each history row as `adminUserName`.
- ✅ `PATCH /api/v1/admin/appointments/:id/status` → `{ status: COMPLETED | CANCELLED, reason? }`; audited with `adminUserId` (`MARKED_COMPLETED_BY_ADMIN` / `CANCELLED_BY_ADMIN`). Error contract is documented in full under Chunk 11 Step 6 — note it is **not** the same as the public endpoints.
- ✅ No-Shows tab removed. `NO_SHOW` removed from the product flow entirely.
- ✅ JWT protected (admin only). Verified end-to-end: list tabs, detail, mark-completed, cancel, same-status 400, cancelled→409.
- ℹ️ Legacy note: `NO_SHOW` stays as an **unused** DB enum value — this PostgreSQL build rejects `DROP VALUE` (checked on a scratch enum), so it stays forever in the type but is never used/exposed (docs: `APPOINTMENT-FLOW.md` §6). `MARKED_COMPLETED_BY_ADMIN` was added to `ActionType` (+ `prisma generate`).

## Chunk 5 — Email delivery (SendGrid SMTP) ✅

- ✅ Backend `MailModule` + `MailService` (nodemailer, SMTP from `SMTP_*` env vars — `SMTP_PASS` already holds the SendGrid API key).
- ✅ Templates (`mail.templates.ts`) reuse the frontend branding (logo, navy/bronze shell): booking confirmation, reschedule, cancellation — each with **prospect + admin (`SMTP_TO`)** copies and inline **reschedule / cancel** links (`APP_URL` base). No manage/view link: the email already carries the full form details.
- ✅ Wired into `AppointmentsService`: book → confirmation (logs `CONFIRMATION_EMAIL_SENT`), reschedule → reschedule mail (old time shown), cancel → cancellation mail (reason shown).
- ✅ Fire-and-forget — booking/API never fails because of email; `mail.dryRun` (`MAIL_DRY_RUN=true`) logs instead of sending.
- ✅ Verified in dry-run: 6 emails (book/reschedule/cancel × prospect/admin) with correct subjects/recipients, links present in HTML+text, audit chain `BOOKED → CONFIRMATION_EMAIL_SENT → RESCHEDULED_BY_PROSPECT → CANCELLED_BY_PROSPECT`.
- ✅ Frontend no longer sends email: `app/api/schedule-appointment` + `lib/appointment-emails.ts` **deleted** (that was backend code living in the frontend). Templates are now a **single source of truth in the backend** (`mail.templates.ts`, ported verbatim from the old frontend file, extended with reschedule/cancel + action buttons).
- ✅ Verified **live** (no dry-run) via SendGrid: 6/6 emails actually delivered — `concept` booking, reschedule, cancel × prospect + admin (`SMTP_TO`).

## Chunk 6 — Frontend wiring: submit to backend ✅

- ✅ `schedule-appointment-dialog.tsx` now POSTs to `${NEXT_PUBLIC_API_URL}/api/v1/appointments` (was `/api/schedule-appointment`); success/error driven by the response envelope.
- ✅ Removed duplicate/backend-owned code from the frontend: deleted `app/api/schedule-appointment/route.ts` + `lib/appointment-emails.ts` (email templates/mailer now backend-only).
- ✅ Frontend env: dropped `SMTP_*` (backend-only); added `NEXT_PUBLIC_API_URL` (+ kept `SITE_URL`) in `.env.local` / `.env.example`.
- ✅ Added the pages the email links point to (all client components, token-gated, no duplicated backend logic):
  - `/appointments/reschedule/[token]` — loads current booking via `GET /api/v1/appointments/manage/:token`, submits `PATCH /api/v1/appointments/:token/reschedule` (date/time/timezone from `siteConfig.appointmentForm`).
  - `/appointments/cancel/[token]` — loads current booking, submits `DELETE /api/v1/appointments/:token/cancel` (optional reason).
  - No Manage/View page (email already shows the full form details — only Reschedule + Cancel links are sent).
- ✅ Shared frontend API client `lib/appointment-api.ts` (base URL + typed helpers, unwraps the `{status,data,meta}` envelope) and `components/schedule/appointment-page-shell.tsx` (brand shell/components).
- ✅ Verified: `next build` clean (routes `/appointments/{reschedule,cancel}/[token]` generated), `eslint` clean.

## Chunk 7 — Reminders (cron) ✅

- ✅ `ScheduleModule.forRoot()` in `app.module.ts` — this is what makes `@Cron` decorators live; without it the decorator is inert. `@nestjs/schedule@12` was already in `package.json` but never registered.
- ✅ `backend/src/modules/appointments/reminders.service.ts` — `RemindersService`, `@Cron(CronExpression.EVERY_MINUTE)`, one tick per minute. No per-appointment timers.
- ✅ Re-entrancy guard (`ticking` flag): a slow SMTP call can't let the next tick pile up. Top-level try/catch so one rejection can't kill the tick.
- ✅ Windowed query per offset (`REMINDER_OFFSETS = [24, 1]`): `scheduledAtUtc > now - lookbackMinutes && <= now + offset`, `reminder*hSent = false`, and `status IN (CONFIRMED, RESCHEDULED)`. A narrow window means a reminder missed while the server was down is **skipped**, not fired late in bulk.
- ✅ Claim-before-send via conditional `updateMany` (`where: { id, reminder*hSent: false }`) — a single atomic statement, so two API instances can't both win the same row.
- ✅ If the send fails, the claim is **released** (flag → `false`, `sentAt` → `null`) so the next tick retries inside the window. Retries are bounded by the lookback window (~5 attempts at the default), so no infinite loop.
- ✅ `buildReminderEmails(details, links, hoursBefore)` in `mail.templates.ts` — prospect-only (no admin copy; admin already has the booking notification). Reuses the on-brand shell, detail rows, and the reschedule/cancel/add-to-calendar action buttons. Subject: `Reminder: your appointment is in <24 hours|1 hour> — NORTH POINT SALES GROUP`.
- ✅ `MailService.sendReminderNotifications(appointment, hoursBefore)`.
- ✅ Audit rows `REMINDER_24H_SENT` / `REMINDER_1H_SENT` with notes `24h reminder email sent to <email>`.
- ✅ **Reschedule resets all four reminder fields.** Offsets are relative to `scheduledAtUtc`, so a moved appointment needs a fresh pair of reminders against the new time; without this a moved appointment would either skip its reminder or double-send.
- ✅ Env: `REMINDERS_ENABLED` (default on, set `false` to pause the cron without a code change), `REMINDER_LOOKBACK_MINUTES` (default `5`).
- ✅ Verified live against `north-sales-postgres` under `MAIL_DRY_RUN=true` (no real emails sent): 24h fired once with flags + `REMINDER_24H_SENT` audit row; **two further ticks produced no duplicate** (atomic claim holds); 1h fired independently; moving an appointment from 24h-out to 1h-out did **not** re-fire 24h (flag still true); a `CANCELLED` appointment with flags reset was never claimed; reschedule with both flags `true` reset them to `false`/`null`. Test appointment + its 5 audit rows deleted afterwards.

## Chunk 8 — Sendgrid webhooks ⬜

- Optional: opened/clicked tracking into `appointment_logs` or email table.

## Chunk 9 — Testing & hardening ⬜

- ⚠️ **Nothing is automated.** The backend has no `test` script and no `*.spec.ts` / `*.e2e-spec.ts` files; `@nestjs/testing` is installed but unused. The frontend has no test setup either.
- ⚠️ Everything verified so far ran as throwaway Node scripts under the OS temp dir, calling the real `lib/` and `dist/` modules against the live local stack: auth `15/15`, list `27/27`, detail `17/17`, status transitions `19/21` + `8/8` (the 2 failures were wrong assertions in the script, not product bugs), calendar links `30/30`, calendar emails `42/42`, calendar live `13/13`, admin-name `14/14`. **None of this survives — there is no regression safety net.**
- Next: add Jest/Supertest to the backend and port these suites to run in CI against a disposable database.
- Still to do: input fuzzing, rate-limit tuning for the public booking endpoint (currently the global 50/min applies — unauthenticated booking is the most exposed route), security headers (helmet/CSP), and an email-client render check for the new calendar button block.

## Chunk 10 — Deferred items ⬜

- Admin password-reset flow (email + token).
- Audit table for login events (currently only log lines).
- Docs = source of truth; keep `APPOINTMENT-FLOW.md` in sync with the code. ✅ Kept in sync through Chunks 11/12; keep doing this when contracts change.

## Chunk 11 — Admin frontend (login + dashboard) ⬜

**Scope:** UI only. The backend admin API (Chunk 4) and auth (Chunk 2) are already built and verified — **no backend code is written in this chunk.**

### Build order (strict — UI only after the API it calls is reachable)

1. ✅ **Unblock the local backend.** Port `3001` is now served by the North Sales backend (the unrelated `Baked.pk` app is gone). `GET /api/v1/admin/appointments` returns **401 (not 404)** unauthenticated, confirming the route is registered and `JwtAuthGuard` is live. `main.ts` sets the global `api/v1` prefix and calls `app.enableCors()`.
2. ✅ **`/admin/login`** — email + password form → `POST /api/v1/auth/login`. Store the access + refresh tokens, redirect to the dashboard. Handle 401 (wrong credentials) and 429 (rate limit: login is capped at 5/min by `@nestjs/throttler`) as distinct messages.
3. ✅ **Auth guard for the admin area** — a client-side check that redirects to `/admin/login` when no valid token is present, plus token refresh via `POST /api/v1/auth/refresh` on `401`. **Note:** this is a UX guard, not a security boundary — the real protection is `JwtAuthGuard` on every admin endpoint.
4. ✅ **`/admin/dashboard`** — `GET /api/v1/admin/appointments` with the existing query DTO: 3 tabs (`upcoming` = CONFIRMED+RESCHEDULED with `scheduledAtUtc >= now`, `completed`, `cancelled`), search across name/company/email, `from`/`to` date filter, `skip`/`take` pagination.
5. ✅ **Detail view** — `GET /api/v1/admin/appointments/:id`, showing the `appointment_logs` audit trail (booking → confirmation email → reminders → reschedule/cancel) plus both link tokens. The endpoint flattens `adminUser.name` into `adminUserName` on every history row, so the UI shows _who_ performed an admin action (null for prospect/system rows).
6. ✅ **Admin actions** — `PATCH /api/v1/admin/appointments/:id/status` for `COMPLETED` and `CANCELLED` (optional reason).

   **Error contract (verified live, do not assume it mirrors the public endpoints):**

   | Case                                     | Status | Message                                    |
   | ---------------------------------------- | ------ | ------------------------------------------ |
   | Unknown `id`                             | `404`  | `Appointment not found`                    |
   | Target status equals current status      | `400`  | `Appointment is already in this status`    |
   | Appointment is **already `CANCELLED`**   | `409`  | `Cancelled appointments cannot be changed` |
   | `status` outside `COMPLETED`/`CANCELLED` | `400`  | DTO validation                             |
   | Not authenticated                        | `401`  | `JwtAuthGuard`                             |

   Note the difference from the **public** reschedule/cancel endpoints (Chunk 3), which use `assertMutable()` and return `409` on `CANCELLED`, `COMPLETED` **and** `NO_SHOW`. The admin status endpoint is deliberately looser: it only guards `CANCELLED`, so **`COMPLETED → CANCELLED` is allowed** (returns `200`) and a completed appointment can still be reopened as cancelled. There is no `NO_SHOW` guard here at all, since `NO_SHOW` is unused in the product flow.

   The UI hides the action buttons entirely once the appointment is `CANCELLED`, shows `400` in an info-toned alert and `409` in an error-toned alert, then refetches the detail so the status badge and audit trail update in place.

### Access control

- ✅ **Single role: `SUPER_ADMIN` only.** The schema has exactly one role value and every admin who can log in holds it, so there is no per-user permission branching to build. Anything authenticated is authorized — **do not add a role-check UI or a fake permission matrix.**
- ✅ `is_active = false` admins are rejected by the backend at login, before the UI's redirect behaviour is relied on.

### Environment notes

- ✅ `NEXT_PUBLIC_API_URL` resolves to `http://localhost:3001` in development, which is where the backend actually listens. Nothing to repoint locally.
- ⚠️ The dashboard works **locally** only. On Vercel the admin API is unreachable until the backend is deployed — the same blocker as the live booking form (`/appointments` currently 404s in production).
- ⚠️ Do not reintroduce email sending in the frontend. `app/api/schedule-appointment` + `lib/appointment-emails.ts` were removed in Chunk 5/6 for being backend-owned; the admin UI must not recreate that duplication.

---

## Chunk 12 — Add to Calendar ✅

**Goal:** clicking "Add to Calendar" must open the prospect's calendar app directly, never force a file download.

- ✅ New `backend/src/modules/appointments/calendar-links.ts` — `calendarEventDetails()` is the single source of truth for the summary, description, location and start/end times, so the `.ics` file and the two deep links can never drift. Builds:
  - **Google**: `calendar.google.com/calendar/render?action=TEMPLATE&text=…&dates=<compact UTC>/<compact UTC>&details=…&location=…&ctz=<IANA>`
  - **Outlook**: `outlook.live.com/calendar/0/deeplink/compose?rru=addevent&subject=…&startdt=…&enddt=…&body=…&location=…`
  - **`.ics` fallback**: the existing `GET /api/v1/appointments/:token/calendar.ics`, still served as an `attachment` on purpose (manual import for Apple Calendar and desktop clients, where deep links do not work).
- ✅ `calendar-ics.ts` now consumes `calendarEventDetails()` instead of recomputing the summary/description.
- ✅ `MailService.calendarLink()` → `calendarLinks()`, returning all three. Booking, reschedule and reminder emails render a dedicated **"Add to your calendar"** row with three buttons, plus the three URLs in the plain-text part. The block stays inside `<tr><td>` — a bare `<div>` inside the email table breaks Outlook/Gmail.
- ✅ Frontend mirror `lib/calendar-links.ts` and a shared dropdown `components/schedule/add-to-calendar.tsx` (click-outside + Escape to close, `rel="noopener noreferrer"`, opens in a new tab).
- ✅ Wired into the reschedule success screen and the admin detail "Prospect links" section. Hidden when the appointment is `CANCELLED`.
- ⚠️ **Not on the cancel page or the cancellation email.** Cancelling an event and then offering to add it to a calendar is contradictory; those screens intentionally have no action buttons.
- ⚠️ `lib/calendar-links.ts` (frontend) and `calendar-links.ts` (backend) hold the same logic because emails and pages render in different runtimes. If the summary/description wording changes, update both.
- Verified: 30/30 link-builder, 42/42 email-template, 13/13 live (all three links resolve to the identical start instant). ⚠️ Dry-run HTML only — the rendered result in a real inbox still needs a look after deploy.

---

## Environment

`backend/.env`: `JWT_SECRET=yVxVXKrv…` (HS256), `JWT_EXPIRES_IN=15m`, `JWT_REFRESH_EXPIRES_IN=7d`, `INITIAL_ADMIN_EMAIL=admin@northpointsales.com`, SMTP/SendGrid vars.
Health of a run: `npm run build` (clean) → `node dist/main.js` → `http://localhost:3001/api/v1`, Swagger `/api-docs`.

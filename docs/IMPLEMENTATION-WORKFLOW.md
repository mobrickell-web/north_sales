# Appointment System — Chunked Implementation Workflow

> Companion to `docs/APPOINTMENT-FLOW.md`. This file breaks the build into
> **10 independently verifiable chunks**. Work one chunk at a time; each chunk
> has tasks and an explicit _Definition of Done_ (DoD) you can tick off before
> moving on.
>
> Repo layout targets (separate repos):
>
> - `../backend` — **own git repo** (`/projects/North-Landing/backend`),
>   NestJS + Prisma + PostgreSQL API
> - this repo (`north_sales`) — Next.js frontend (marketing + booking + admin)

---

## Chunk 0 — Setup & Standalone Backend Scaffold ✅ Done

- [x] Scaffold standalone NestJS app (Nest 12, TS 6, manual scaffold) in
      `../backend` (own git repo, own `node_modules`, own `package-lock.json`),
      install `@nestjs/jwt @nestjs/passport @nestjs/schedule prisma
    @prisma/client bcrypt class-validator class-transformer date-fns-tz
    nodemailer`.
- [x] Define `backend/.env` / `backend/.env.example`:
      `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `MAIL_*`, `APP_URL`,
      `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD` (required — no fallback).
- [x] Wire VS Code CSS lint ignore (`css.lint.unknownAtRules: "ignore"`).
- [ ] Create proxy setup later (Chunk 9) so Next.js dev can call NestJS on
      `/api/v1`.

> **Notes:** backend is fully separate now — not a workspace, not a folder in
> this repo. Boot on `:3001` with global prefix `api/v1`
> (`src/main.ts`, loads `backend/.env`). Frontend runs with plain `npm run dev`
> (Next only). Run each app from its own directory. npm 11 requires approving
> install scripts for `prisma`/`@prisma/engines`/`bcrypt`
> (`npm approve-scripts --all`; recorded in `backend/package.json#allowScripts`).
> Nest 12 requires TypeScript ≥6 (`^6.0.3`); Next stays on TS 5.

**DoD:** `npm run dev` boots both apps; `git status` clean after scaffolds.

---

## Chunk 1 — Database Schema, Migrations & Seed

**Goal:** Persistent layer with audit logging and a seeded Super Admin.

- [x] Encode `schema.prisma` as in APPOINTMENT-FLOW §3:
      enums (`Role`, `AppointmentStatus`, `AppointmentType`, `ActionType`) and
      models (`AdminUser`, `Appointment`, `AppointmentLog`) with the exact
      `@map`/indexes.
- [x] Run `prisma migrate dev` for initial migration on PostgreSQL.
- [x] Implement `prisma/seed.ts`:
  - [x] **Require** `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` from env
        (throw if missing) — **no hardcoded default password** (fixes §8).
- [ ] `@nestjs/schedule` disabled until Chunk 5 (no cron yet).

**DoD:** `prisma migrate dev` succeeds; `prisma db seed` creates only one Super
Admin on re-run (idempotent); `prisma studio` shows the 3 tables.

> **Chunk 1 ✅ Done (2026-09-29).** Local DB runs via Docker dedicated container
> `north-sales-postgres` (`postgres:16-alpine`) on port **5434** — native PG18 on
> 5432 is unused for this project; `DATABASE_URL` reflects the container. Tables
> verified: `admin_users`, `appointments`, `appointment_logs`; seeded
> `admin@northpointsales.com` (role `SUPER_ADMIN`, active), idempotent on re-seed.

---

## Chunk 2 — Auth Module (Super Admin Login)

- [x] JWT Strategy + LocalStrategy; `POST /api/v1/auth/login` returns signed JWT
      (configurable: HTTP-only cookie or Bearer).
- [x] `@CurrentUser()` decorator + `JwtAuthGuard`. Single role only
      (`SUPER_ADMIN`) — no `RolesGuard`/`@Roles()`.
- [x] `GET /api/v1/auth/me` (any active admin).
- [x] Rate-limit login attempts (e.g. `@nestjs/throttler` or express-rate-limit);
      make failed login audit the Attempt.
- [x] No public admin registration endpoint.

**DoD:** Unauthorized API calls return 401; wrong-password attempts are
rate-limited; `me` returns the seeded admin profile.

> **Chunk 2 ✅ Done (2026-09-29).** Swagger UI on `http://localhost:3001/api-docs`
> (Bearer auth scheme). Verified: login 200 + JWT; wrong password 401; 6th login
> in 60s → 429; `/me` 401 without token / 200 with token; failed logins audited
> (`AuthService` warn) with client IP. Rate limits: global 50 req/min,
> login route 5/min (via `@nestjs/throttler` v6).
>
> **Refresh tokens added (DB-backed opaque, standards-style):** `POST
/auth/refresh` rotates the pair (old token stored as revoked + `replaced_by_id`),
> replaying a rotated token revokes the entire token family for that admin;
> `POST /auth/logout` revokes the presented token; tokens stored as SHA-256 hashes
> only, 7-day TTL (`JWT_REFRESH_EXPIRES_IN`). Verified: login → rotate → replay-old
> 401 → logout (`revoked:true`) → refresh-after-logout 401. Model
> `AdminRefreshToken`/`admin_refresh_tokens` added (migration `add_refresh_tokens`).

---

## Chunk 3 — Public Booking API + Token Management

- [ ] `POST /api/v1/appointments` — validate DTO
      (`contactName`, `companyName`, `email`, `phone?`, `notes?`,
      `appointmentType`, `durationMinutes`, `scheduledAtUtc` or
      `date`+`timeSlot`, `prospectTimezone`).
- [ ] Normalize to UTC with `date-fns-tz` (store `TIMESTAMPTZ`).
- [ ] Generate `rescheduleToken` + `cancelToken` (UUIDv4), status `CONFIRMED`.
- [ ] `GET /api/v1/appointments/manage/:token` — fetch booking details for the
      prospect manage page (token-scoped, returns masked/expected fields only).
- [ ] `PATCH /api/v1/appointments/:token/reschedule` — validate token, update
      `scheduledAtUtc`, **reset** `reminder24hSent`/`reminder1hSent`, write
      `RESCHEDULED_BY_PROSPECT` log.
- [ ] `DELETE /api/v1/appointments/:token/cancel` — token-scoped, set status +
      `cancellationReason`, write `CANCELLED_BY_PROSPECT` log.
- [ ] Token expiry/invalid → 404 (don't reveal existence).

**DoD:** curl end-to-end happy path books, fetches, reschedules and cancels
using only emailed tokens; db rows + logs correct.

---

## Chunk 4 — Email & Calendar Integration

- [ ] `MailService` abstraction over Nodemailer/Resend (template dir +
      `transporter`).
- [ ] Templates (Handlebars): `confirmation.hbs`,
      `admin-notification.hbs`, `reminder-24h.hbs`, `reminder-1h.hbs`,
      `cancellation.hbs`.
- [ ] Calendar utilities: Google/Outlook web URLs + `.ics` builder
      (`calendar.util.ts`).
- [ ] On `create()` (after commit): send prospect confirmation + internal
      NPSG alert to `sales@northpointsales.com` (fire-and-forget with
      retry/queue).
- [ ] Embed reschedule/cancel links + timezone-formatted times in emails.
- [ ] **Idempotency:** guard against duplicate sends (flag check before send).

**DoD:** Booking an appointment via API produces readable emails with working
links + `.ics`; admin alert arrives; no duplicate sends on retry.

---

## Chunk 5 — Reminder Scheduler (24h & 1h)

- [ ] `@nestjs/schedule` cron service:
      `*/10 * * * *` → 24h reminders; `*/2 * * * *` → 1h reminders.
- [ ] Query due appointments (`scheduledAtUtc` window AND
      `reminder24hSent=false` / `reminder1hSent=false` AND status in
      `CONFIRMED|RESCHEDULED`).
- [ ] Send + flip flags, set `reminder24hSentAt` / `reminder1hSentAt`, write
      `REMINDER_24H_SENT` / `REMINDER_1H_SENT` logs.
- [ ] Idempotent & timezone-safe (compute windows in UTC).

**DoD:** Book an appointment 25h out → reminder arrives ~24h before; 65min out
→ 1h reminder arrives; flags + logs update once.

---

## Chunk 6 — Super Admin Management APIs & Audit

- [ ] `GET /api/v1/admin/dashboard/stats` — totals (all time, week, month),
      status breakdown.
- [ ] `GET /api/v1/admin/appointments` — paginated list with search
      (name/email/company/phone) + status filter; include UTC and ET-rendered
      times.
- [ ] `GET /api/v1/admin/appointments/:id` — detail + full history timeline.
- [ ] `PATCH .../:id/reschedule` (Super Admin) — manual change,
      notify prospect, log `RESCHEDULED_BY_ADMIN` (+ `adminUserId`).
- [ ] `DELETE .../:id/cancel` — manual cancel + reason, log
      `CANCELLED_BY_ADMIN`.
- [ ] `POST /api/v1/admin/appointments/:id/resend-email` — resend
      confirmation/`.ics`, log `EMAIL_RESENT_BY_ADMIN`.
- [ ] `POST /api/v1/admin/users` (Super Admin only) — create/invite secondary
      admins.

**DoD:** All admin routes enforce roles; every mutation appends an
`AppointmentLog` row attributable to the acting admin.

---

## Chunk 7 — CSV Export

- [ ] `GET /api/v1/admin/export/csv` (Super Admin) with date-range + status
      filtering.
- [ ] Streaming CSV in ET + prospect local time columns; filename includes
      date range.
- [ ] Audit: log export arrival as `ActionType` if desired; guard client-side by
      role.

**DoD:** Filtered export downloads as a valid CSV opening in Excel/Sheets with
correct UTF-8/encoding.

---

## Chunk 8 — Public Frontend (Booking Modal + Manage Pages)

- [ ] Booking form/modal in the Next.js landing page; client-side validation,
      timezone detection via `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- [ ] POST to NestJS `/api/v1/appointments` (via Next.js route handler or
      rewrites).
- [ ] `/reschedule?token=UUID` page — fetch manage data, pick new slot, PATCH.
- [ ] `/cancel?token=UUID` page — confirm + reason, DELETE.
- [ ] Success/error states + email copy consistent with template language.

**DoD:** Book a real appointment from the landing page; complete
reschedule **and** cancel flows from a real emailed link.

---

## Chunk 9 — Admin Dashboard (Next.js /admin)

- [ ] `/admin/login` — form posting to `/api/v1/auth/login`; store JWT
      (cookie or memory) + route guard.
- [ ] `/admin` — stats cards + appointments table with search/filter/pagination
      (dual timezone: prospect local + ET).
- [ ] Row actions: manual reschedule, cancel (+ reason modal), resend email.
- [ ] Appointment detail drawer/route with full audit timeline.
- [ ] CSV export button wired to protected download.
- [ ] Users page (Super Admin only) to create/invite admins.
- [ ] Dev proxy: Next rewrites `(/api/v1/*)` → NestJS so no CORS in dev.

**DoD:** Log in as seeded Super Admin; view/update/cancel/export bookings;
all role-gated UI hidden for non-admins.

---

## Chunk 10 — Hardening, Secrets & Deploy

- [ ] Remove default passwords everywhere; require `INITIAL_ADMIN_PASSWORD`.
- [ ] JWT: strong `JWT_SECRET`, `JWT_EXPIRES_IN` (short access + optional
      refresh); HTTPS-only cookies if using cookies.
- [ ] Global exception filter → consistent error shape; hide internal errors.
- [ ] Rate limit public booking (spam) and login; add basic request caps.
- [ ] Email failure handling: queue/retry + dead-letter log.
- [ ] DB: backups, `SELECT`-scoped db user for app if applicable.
- [ ] Env validation (`configuration.ts`) fails fast on missing vars.
- [ ] CI: lint + typecheck both apps; `prisma migrate deploy` migration step.
- [ ] Deploy backend + frontend; replace placeholder production email address.

**DoD:** Full smoke test on staging: book → confirm → reminders → reschedule →
admin manage → export → audit trail; no secrets in repo; CI green.

---

## Suggested Execution Order

Backend-heavy first (Chunks 0–7) so the frontend has live APIs to point at;
frontend (Chunks 8–9) then hardening (Chunk 10). Chunks 1–4 can be developed
before auth is finished since public booking is unauthenticated.

| Track               | Chunks                |
| ------------------- | --------------------- |
| Infrastructure / DB | 0 · 1                 |
| Backend API         | 2 · 3 · 4 · 5 · 6 · 7 |
| Frontend            | 8 · 9                 |
| Production          | 10                    |

---

## Known Spec Gaps to Resolve During Build

1. `APPOINTMENT-FLOW.md` §8 hardcodes a seed fallback password — use required
   env vars (addressed in Chunk 1 / 10).
2. No concurrency guard on reminder cron — must be idempotent (Chunk 5).
3. No rate limiting defined on public + login endpoints (Chunk 2 / 10).
4. Calendar `.ics` spec (method, organizer, attendee) not detailed — pin down
   during Chunk 4.
5. Pagination cursor/offset and max page size unspecified (Chunk 6).
6. Refresh tokens implemented (Chunk 2, DB-backed + rotation + reuse detection);
   password-reset flow for admins still deferred to Chunk 10.

# Appointment Flow & Public Booking API

Backend: `north-landing/backend` (NestJS 12 + Prisma 7 + PostgreSQL on Docker, port `5434`)
Frontend form: `north_sales/components/schedule/schedule-appointment-dialog.tsx` · options in `north_sales/config/site.ts`

> This doc mirrors the **actual website form**. Anything the form does not send is marked `[not in form]`.

---

## 1. Roles

Single-role system. Only `SUPER_ADMIN` exists (`admin@northpointsales.com`, seeded). No sales-rep / viewer roles.

## 2. API base

`http://localhost:3001/api/v1` · Swagger UI: `http://localhost:3001/api-docs`

- Response envelope (all endpoints): `{ status, data?, message?, statusCode?, path?, method?, meta: { timestamp, requestId } }`
- Success: `status: true`, `data` = payload. Errors: `status: false`.
- Every request gets an `X-Request-Id` header (mirrored in `meta.requestId`).
- Rate limits (`@nestjs/throttler`): global 50 req/min; login 5/min; refresh 20/min.

## 3. Admin auth (`/api/v1/auth`)

| Endpoint             | Auth   | Notes                                                                                                  |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `POST /auth/login`   | none   | `{ email, password }` → `{ accessToken, refreshToken, tokenType, expiresIn, refreshExpiresIn, admin }` |
| `POST /auth/refresh` | —      | `{ refreshToken }`; rotates token, old one revoked                                                     |
| `POST /auth/logout`  | Bearer | `{ refreshToken }` → token revoked                                                                     |
| `GET /auth/me`       | Bearer | current admin                                                                                          |

- Access token: JWT (HS256), default `15m` (`JWT_EXPIRES_IN`, verified `exp-iat=900s`). Refresh token: opaque, stored as SHA-256 hash, default `7d`.
- Reuse of a rotated/revoked refresh token → `401` and **revokes all of that admin's refresh tokens** (family revocation).
- Failed login audited in backend logs (IP).

## 4. Public booking (`/api/v1/appointments`) — no auth

| Endpoint                                | Purpose                                                    | Token in URL                       |
| --------------------------------------- | ---------------------------------------------------------- | ---------------------------------- |
| `POST /appointments`                    | Book from website form → `201`                             | —                                  |
| `GET /appointments/manage/:token`       | Load booking detail page (accepts either link token)       | `rescheduleToken` or `cancelToken` |
| `PATCH /appointments/:token/reschedule` | Prospect reschedules from email link                       | `rescheduleToken`                  |
| `DELETE /appointments/:token/cancel`    | Prospect cancels from email link                           | `cancelToken`                      |
| `GET /appointments/:token/calendar.ics` | Download `.ics` calendar file for "Add to Calendar" button | `rescheduleToken`                  |

### 4.1 Booking payload (mapped from the site's form)

| Form field       | API field         | Required                       | Backend handling                                                             |
| ---------------- | ----------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| Contact Name     | `contactName`     | yes                            | string ≤150                                                                  |
| Company Name     | `companyName`     | yes                            | string ≤150                                                                  |
| Business Email   | `email`           | yes (form also marks required) | valid email, lowercased                                                      |
| Appointment Type | `appointmentType` | yes                            | must be one of the 4 labels (see 4.2) → stored as enum                       |
| Date             | `date`            | yes                            | `YYYY-MM-DD`                                                                 |
| Available Time   | `time`            | yes (form also marks required) | must be one of the 14 slots → combined with date+timezone → `scheduledAtUtc` |
| Time Zone        | `timezone`        | yes                            | must be one of the 11 labels → mapped to IANA (see 4.3)                      |
| Meeting Duration | `duration`        | yes                            | `30 / 45 / 60 minutes` → `durationMinutes`                                   |

- Past date/time rejected with `400`.
- Duplicate/same-time reschedule rejected with `400`.
- Reschedule/cancel on `CANCELLED` or `COMPLETED` → `409`.
- Unknown token → `404`.
- Malformed (non-UUID) link token → `404` as well (validated before hitting Postgres, so no `500` from UUID parsing).

### 4.2 Appointment types (form labels ⇄ enum)

`Initial Consultation` ⇄ `INITIAL_CONSULTATION`
`Sales Performance Discussion` ⇄ `SALES_PERFORMANCE_DISCUSSION`
`Sales Performance Review` ⇄ `SALES_PERFORMANCE_REVIEW`
`Follow-Up Meeting` ⇄ `FOLLOW_UP_MEETING`

### 4.3 Time zones (form labels ⇄ IANA, for UTC conversion)

| Form label                                             | IANA                  |
| ------------------------------------------------------ | --------------------- |
| Eastern Time (ET) — US East Coast                      | `America/New_York`    |
| Central Time (CT) — US Central                         | `America/Chicago`     |
| Mountain Time (MT) — US Mountain                       | `America/Denver`      |
| Mountain Time (MT) — Arizona (no daylight saving)      | `America/Phoenix`     |
| Pacific Time (PT) — US West Coast                      | `America/Los_Angeles` |
| Alaska Time (AKT) — Alaska                             | `America/Anchorage`   |
| Hawaii-Aleutian Time (HAT) — Aleutian Islands, Alaska  | `America/Adak`        |
| Hawaii Time (HT) — Hawaii                              | `Pacific/Honolulu`    |
| Atlantic Time (AST) — Puerto Rico & US Virgin Islands  | `America/Puerto_Rico` |
| Chamorro Time (ChST) — Guam & Northern Mariana Islands | `Pacific/Guam`        |
| Samoa Time (SST) — American Samoa                      | `Pacific/Pago_Pago`   |

### 4.4 Time slots (form dropdown)

`9:00 AM` → `4:30 PM` in 30-min steps: 9:00, 9:30, 10:00, 10:30, 11:00, 11:30, 1:00, 1:30, 2:00, 2:30, 3:00, 3:30, 4:00, 4:30.

## 5. Admin appointment management (`/api/v1/admin/appointments`) — JWT required

| Endpoint                                                        | Purpose                                                               |
| --------------------------------------------------------------- | --------------------------------------------------------------------- |
| `GET /admin/appointments?status=...&search=...&from=...&to=...` | List, paginated (`skip`/`take`) for one of the **3 tabs**             |
| `GET /admin/appointments/:id`                                   | Detail + full audit history (`history[]` carries `adminUserName`)     |
| `PATCH /admin/appointments/:id/status`                          | `{ status: COMPLETED \| CANCELLED, reason? }`; admin action (audited) |

**3 tabs** (loop/UI driven by `AdminAppointmentQueryDto.status`):

| Tab           | Filter                                               |
| ------------- | ---------------------------------------------------- |
| **Upcoming**  | `CONFIRMED` + `RESCHEDULED`, `scheduledAtUtc >= now` |
| **Completed** | `COMPLETED`                                          |
| **Cancelled** | `CANCELLED`                                          |

- Row actions: **Mark Done** → `COMPLETED`, **Cancel** → `CANCELLED` (with optional reason).
- Same status again → `400`; changing a `CANCELLED` appointment → `409`.
- Completed → cancelled is allowed (admin correction); cancelled appointments are terminal.
- Search covers `contactName` / `companyName` / `email` (case-insensitive). `from`/`to` filter by `scheduledAtUtc` (UTC days).

## 6. Appointment states & audit

- `AppointmentStatus` (product flow): `CONFIRMED` (default) → `RESCHEDULED` / `CANCELLED` / `COMPLETED`.
- **No-Shows removed from the product flow** — no tab, no status transition. `NO_SHOW` remains as a legacy (unused) value in the DB enum only because this PostgreSQL build does not support `DROP VALUE` on enum types; it is never used or exposed by the API.
- Every change writes an `appointment_logs` row with `ActionType` + previous/new time + notes (admin actions store `adminUserId`):
  - `BOOKED` (site form)
  - `RESCHEDULED_BY_PROSPECT` (prospect email link)
  - `RESCHEDULED_BY_ADMIN` (future)
  - `CANCELLED_BY_PROSPECT` (email link, reason stored in `cancellationReason`)
  - `CANCELLED_BY_ADMIN` (admin tab action)
  - `MARKED_COMPLETED_BY_ADMIN` (admin tab action)
  - `CONFIRMATION_EMAIL_SENT` (after the booking email to the prospect)
  - `REMINDER_24H_SENT` / `REMINDER_1H_SENT` (after each automated reminder email — see §7.1)

**Who did it.** Admin rows store `adminUserId`. `GET /admin/appointments/:id` joins `admin_users` and returns it as a flat `adminUserName` on each history row so the dashboard can attribute an action without a second request. Both `adminUserId` and `adminUserName` are `null` for prospect and system actions (`BOOKED`, `*_BY_PROSPECT`, `*_EMAIL_SENT`, `REMINDER_*`). The relation is `onDelete: SetNull`, so deleting an admin keeps the log row intact and `adminUserName` simply becomes `null`.

### 6.1 Add to calendar

Every calendar link is built from one shared `calendarEventDetails()` so the `.ics` file and both deep links always describe the same instant:

| Target        | URL                                                                | Behaviour                                                       |
| ------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Google        | `calendar.google.com/calendar/render?action=TEMPLATE&…&ctz=<IANA>` | Opens the Google event composer in a new tab — user clicks Save |
| Outlook       | `outlook.live.com/calendar/0/deeplink/compose?rru=addevent&…`      | Opens the Outlook compose form in a new tab                     |
| Apple / other | `GET /api/v1/appointments/:token/calendar.ics`                     | Downloads a file for manual import                              |

Times are sent as UTC (`DTSTART`-style compact stamps for Google, ISO-8601 for Outlook), and the prospect's timezone is carried through as the IANA `ctz` so the event renders at the right local wall-clock time. All three links are offered together in the booking/reschedule/reminder emails, on the reschedule confirmation screen, and in the admin detail view. The `.ics` endpoint deliberately stays an `attachment` — it is the fallback for clients where deep links do not work.

## 7. Email notifications

Sent automatically (fire-and-forget, never blocks the API). Sender/recipient from env: `SMTP_FROM` (branded `"NORTH POINT SALES GROUP"`), admin inbox = `SMTP_TO`, prospect = the booking email.

| Event                   | Prospect gets                                                                                                                                                       | Admin (`SMTP_TO`) gets                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Booking                 | Confirmation (full form details) + **Reschedule / Cancel / Add to Calendar** buttons (links use `FRONTEND_URL`, e.g. `…/appointments/reschedule/<rescheduleToken>`) | New-lead notification (reply-to prospect)             |
| Reschedule (email link) | Reschedule confirmation incl. old time                                                                                                                              | Reschedule notification                               |
| Cancel (email link)     | Cancellation confirmation incl. reason                                                                                                                              | Cancellation notification                             |
| 24h / 1h before start   | Reminder incl. details + the same 3 buttons                                                                                                                         | — (prospect only; admin already has the booking mail) |

- `MAIL_DRY_RUN=true` → logs would-be emails instead of sending (SMTP vars in `.env` remain required for real mode).
- All emails use the on-brand HTML shell + logo (`backend/assets/north-logo.svg`, copied from the site).

### 7.1 Reminder cron (24h / 1h)

Automated reminder emails, one per offset, no admin copy.

| Aspect         | Detail                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Schedule       | `@Cron(EVERY_MINUTE)` in `backend/src/modules/appointments/reminders.service.ts`                                                                |
| Enabling       | Requires `ScheduleModule.forRoot()` in `app.module.ts` — the decorator is inert without it                                                      |
| Offsets        | `REMINDER_OFFSETS = [24, 1]` hours before `scheduledAtUtc`                                                                                      |
| Eligibility    | `status IN (CONFIRMED, RESCHEDULED)` (cancelled/completed are never claimed)                                                                    |
| Idempotency    | Conditional `updateMany` sets `reminder*hSent = true` **before** sending — a single atomic statement, so two API instances can't both win a row |
| Failure        | Claim is released (`reminder*hSent → false`, `*SentAt → null`) so the next tick retries; bounded by the lookback window                         |
| Missed windows | A reminder whose window passed while the server was down is **skipped**, never fired late in bulk                                               |
| Reschedule     | Resets all four reminder fields, because offsets are relative to `scheduledAtUtc`                                                               |
| Env            | `REMINDERS_ENABLED` (default on; `false` pauses the cron), `REMINDER_LOOKBACK_MINUTES` (default `5`)                                            |

The eligibility window is `scheduledAtUtc > now - lookbackMinutes && <= now + offset`. A reminder whose window passed while the server was down is skipped, not fired late in bulk — deliberate, to avoid a thundering herd of stale reminders after downtime.

**Single source of truth (no duplication):** the templates live only in `backend/src/modules/mail/mail.templates.ts` — ported verbatim from the former frontend `lib/appointment-emails.ts`, extended with reschedule/cancel + action buttons. The frontend no longer contains any email code (`app/api/schedule-appointment/route.ts` + `lib/appointment-emails.ts` were deleted).

**Frontend integration:** the booking form (`schedule-appointment-dialog.tsx`) POSTs to `${NEXT_PUBLIC_API_URL}/api/v1/appointments`. Email link targets are frontend pages:

| Link (`FRONTEND_URL` base)                   | Frontend page                         | Calls                                                                                          |
| -------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `/appointments/reschedule/<rescheduleToken>` | `app/appointments/reschedule/[token]` | `GET /appointments/manage/:token` (load current), then `PATCH /appointments/:token/reschedule` |
| `/appointments/cancel/<cancelToken>`         | `app/appointments/cancel/[token]`     | `GET /appointments/manage/:token` (load current), then `DELETE /appointments/:token/cancel`    |

There is **no Manage/View page** — the prospect email already contains the full booking details, so only the action buttons are sent. `GET /appointments/manage/:token` stays as the internal loader used by the two frontend pages.

**Env split:** `FRONTEND_URL` builds the reschedule/cancel page links; `APP_URL` is this API's own public base and builds the calendar-file link. In dev that is `FRONTEND_URL=http://localhost:3000` and `APP_URL=http://localhost:3001`.

**Add to Calendar:** the calendar row carries three buttons — Google and Outlook deep links plus the `.ics` file. Clicking Google or Outlook opens that service's event composer in a new tab, so nothing is downloaded (see §6.1). The `.ics` button points at `GET {APP_URL}/api/v1/appointments/<rescheduleToken>/calendar.ics`, which returns `text/calendar` as an attachment (e.g. `north-point-sales-initial-consultation-2026-10-20-1000.ics`) for manual import. The file is built by `backend/src/modules/appointments/calendar-ics.ts`: one `VEVENT` with UTC `DTSTART`/`DTEND` (`durationMinutes`), a stable `UID`, `SUMMARY`/`DESCRIPTION` with the prospect's local time, and a 30-minute `VALARM`. `recipients` of the file are the prospect's own calendar — nothing is stored server-side. `TransformInterceptor` skips the JSON envelope for `.ics` paths so the body stays a raw file. The summary, description and times come from the shared `calendarEventDetails()` in `calendar-links.ts`, which is the same source the Google/Outlook links use.

The pages share `lib/appointment-api.ts` (base URL + typed helpers, unwraps the `{status,data,meta}` envelope) and `components/schedule/appointment-page-shell.tsx`. Verified **live** via SendGrid (6/6 emails delivered).

## 8. Schema fields NOT in the current form `[not in form]`

- `phone`, `notes` — optional columns exist on `appointment` but the website does **not** send them (kept for future/admin use).
- `status`, `cancellationReason` — backend-managed.
- `reminder24hSent`, `reminder24hSentAt`, `reminder1hSent`, `reminder1hSentAt` — **not form-driven**; written only by the reminder cron (§7.1) and by the reschedule reset.

## 9. Environment (backend/.env)

`DATABASE_URL=postgresql://postgres:mysecret123@localhost:5434/north_sales?schema=public`
Docker: `north-sales-postgres` (`postgres:16-alpine`) on port 5434, DB `north_sales`, volume `north-sales-pgdata`.

- Backend mail: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (SendGrid API key), `SMTP_FROM`, `SMTP_TO`; optional `MAIL_DRY_RUN`. Link base = `APP_URL` (fallback `FRONTEND_URL`).
- Backend reminders (§7.1): `REMINDERS_ENABLED` (default `true`), `REMINDER_LOOKBACK_MINUTES` (default `5`).
- Frontend (`north_sales/.env.local`): `SITE_URL` (site canonical) + `NEXT_PUBLIC_API_URL` (backend API base, e.g. `http://localhost:3001`). The frontend holds **no** SMTP vars.

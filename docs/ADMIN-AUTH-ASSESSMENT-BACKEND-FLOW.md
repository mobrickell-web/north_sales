# Admin Authentication and Dynamic Assessment Backend Flow

Planning document based on the current backend, frontend, and the supplied admin
screens. This describes the work required; it does not implement the backend.
For the detailed screen-by-screen auth flow, see
[ADMIN-AUTH-FLOW.md](./ADMIN-AUTH-FLOW.md).

## Scope and assumptions

- Admin authentication screens are under `/admin/*`.
- The existing overview screenshot is illustrative. Its summary cards, chart, and
  other sample engagement metrics remain static initially.
- The overview's **Assessment & Implementation** area and assessment-related
  screens/data become dynamic.
- Admins can create and publish assessments. Public visitors can complete a
  published assessment, see computed results, and have their submission appear
  in the admin area.
- Assessment administration should cover the screens shown: list, edit, sections,
  questions, results text, settings, preview, and question creation.
- Signup is not open public registration. An unauthenticated admin signup route
  must not be allowed to create a privileged `SUPER_ADMIN` account.

## Current implementation reviewed

### Backend

- NestJS 12, Prisma 7, PostgreSQL, and a single `SUPER_ADMIN` role.
- `AdminUser` and hashed-at-rest, rotating `AdminRefreshToken` models already
  exist. The seed provisions the initial admin using environment variables.
- `POST /api/v1/auth/login`, `POST /auth/refresh`, `POST /auth/logout`, and
  `GET /auth/me` are implemented. Login has a 5-per-minute throttle; the global
  limit is 50 requests per minute.
- JWT guards, DTO validation, request IDs, response envelopes, Swagger, and
  configured SMTP/SendGrid mail delivery are already present.
- No assessment, assessment-response, or password-reset models/routes exist.
- The frontend docs in `docs/IMPLEMENTATION-WORKFLOW.md` list password reset as
  deferred. They do not define assessment backend functionality.

### Frontend

- `/admin/login`, `/admin/signup`, `/admin/forgot-password`,
  `/admin/verification-code`, and `/admin/update-password` screens exist and
  share the auth layout.
- Only login is connected to backend auth. Signup, Google auth, forgot-password,
  code sending/resend/verification, and password update currently show
  frontend-only messaging or navigation.
- The dashboard currently authenticates and manages appointments; assessment
  authoring and submission management screens do not yet exist.
- `/sales-alignment-assessment` reads its questions and copy from
  `config/site.ts`. `sales-alignment-assessment.tsx` holds answers in component
  state, calculates results in the browser, and does not send or persist a
  submission.
- The current public assessment has three pillars, ten required 1–10 ratings,
  first-name/email capture, immediate results, pillar averages, and a relative
  closer-review calculation. This is the initial assessment content to migrate
  into the database.

## 1. Admin authentication flow

### Existing login/session flow — retain

1. Admin submits email and password on `/admin/login`.
2. Frontend calls `POST /api/v1/auth/login`.
3. Backend validates the active admin and bcrypt password, applies the login
   throttle, and returns access/refresh tokens and the admin profile.
4. Frontend stores the tokens in session storage and navigates to the admin
   dashboard.
5. Protected requests use the access token. On expiry, the frontend rotates the
   refresh token through `/auth/refresh`; logout revokes the refresh token.

The existing login behavior is the base for all protected authoring and response
management endpoints.

### Auth screen API map — proposed endpoints

These are recommended contracts, not existing routes. The backend currently
implements login, refresh, logout, and `/auth/me`; signup and password recovery
are frontend-only and need the endpoints below.

| Screen/action                          | Method and endpoint                         | Access             | Request body                                                                       | Successful response                                                                |
| -------------------------------------- | ------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Signup: invite a new admin             | `POST /api/v1/admin/invitations`            | Existing admin JWT | `{ "email": "new-admin@example.com", "name": "New Admin", "role": "SUPER_ADMIN" }` | `{ "invitationId": "...", "expiresAt": "..." }`; send invitation email             |
| Signup: inspect invite                 | `POST /api/v1/auth/invitations/validate`    | Public, throttled  | `{ "token": "..." }`                                                               | `{ "valid": true, "email": "...", "name": "..." }`; return only invite-safe fields |
| Signup: accept invite / create account | `POST /api/v1/auth/invitations/accept`      | Public, throttled  | `{ "token": "...", "name": "...", "password": "..." }`                             | `{ "admin": { "id": "...", "name": "...", "email": "..." } }`; consume invite      |
| Forgot password: request code          | `POST /api/v1/auth/password-reset/request`  | Public, throttled  | `{ "email": "admin@example.com" }`                                                 | Generic `{ "message": "If the account exists, a code has been sent." }`            |
| Verification code: verify code         | `POST /api/v1/auth/password-reset/verify`   | Public, throttled  | `{ "email": "admin@example.com", "code": "123456" }`                               | `{ "resetToken": "...", "expiresAt": "..." }`                                      |
| Verification code: resend code         | `POST /api/v1/auth/password-reset/request`  | Public, throttled  | `{ "email": "admin@example.com" }`                                                 | Same generic response as request; enforce resend cooldown                          |
| Update password: complete reset        | `POST /api/v1/auth/password-reset/complete` | Public, throttled  | `{ "resetToken": "...", "password": "...", "confirmPassword": "..." }`             | `{ "message": "Password updated." }`; revoke existing refresh tokens               |

`confirmPassword` may instead be checked only in the browser; if included in the
request, validate it server-side too. Never return an access/refresh session as
part of password reset: send the user back to login.

The signup flow above is **invitation-only**. The invite-creation endpoint is
protected because only an existing admin may provision an account. If signup is
intended to remain disabled, omit all three invitation endpoints and remove or
repurpose `/admin/signup`; do not expose public self-registration for
`SUPER_ADMIN`.

### Password recovery — backend behavior

Flow:

1. User enters email on `/admin/forgot-password` and the frontend calls
   `POST /api/v1/auth/password-reset/request`.
2. Backend always returns a generic success-shaped response so callers cannot
   discover whether an email belongs to an admin.
3. For an active admin, backend creates a cryptographically random numeric code,
   stores only a secure hash, sets a short expiry and attempt limit, and emails
   the code using the existing `MailService`.
4. User enters the code on `/admin/verification-code` and the frontend calls
   `POST /api/v1/auth/password-reset/verify`. Backend compares the
   hashed value in constant time, checks expiry and attempt count, then marks
   the code consumed and returns a short-lived, single-use reset proof.
5. User enters and confirms a password on `/admin/update-password` and the
   frontend calls `POST /api/v1/auth/password-reset/complete`. Backend
   validates the reset proof, hashes the new password with bcrypt, consumes the
   proof, and revokes all refresh tokens for that admin.
6. User returns to `/admin/login` and signs in with the new password.

Security and operational requirements:

- Store only hashes of codes/reset proofs; never log codes, passwords, or tokens.
- Codes and proofs must expire, be single-use, and have bounded verification
  attempts. Apply per-IP and per-email throttles to request, verify, and complete.
- Use generic request responses and avoid materially different timing for
  known/unknown emails.
- Keep reset mail content and delivery in the backend. Reuse SMTP configuration,
  but add dedicated password-reset templates and delivery/error logging.
- Record reset-request, successful reset, and relevant failure events without
  storing secrets. Consider a dedicated auth audit model; currently failed login
  attempts are log-only.
- Do not put email or reset proof in query strings. The current mock flow passes
  email in a URL; replace that with short-lived browser state for the display
  email, and pass the reset proof only in a POST body.

### Admin signup / provisioning decision

The current database has only `SUPER_ADMIN`, and the seed is the trusted initial
provisioning path. Public self-signup would let an unknown visitor request a
privileged admin account and must not be wired as a public create-user endpoint.

Recommended options:

1. Keep initial provisioning via the seed and disable public signup; or
2. Add an authenticated super-admin invitation flow: an existing admin creates
   an invite, the backend emails a random one-time invite token, and the invited
   person sets their name/password before the invite expires.

The current Signup screen should become an invite-accept screen if option 2 is
selected. Decide invitation policy before implementing signup APIs.

## 2. Dynamic assessment authoring and submission flow

### Admin authoring flow

1. Admin opens **Sales Alignment Assessment** from the dashboard navigation.
2. `GET /api/v1/admin/assessments` loads the list, status filters
   (`All`, `Published`, `Draft`, `Archived`), response counts, and edit dates.
3. Admin creates a draft with title, public slug, description, intro, and
   settings.
4. Admin builds ordered sections and questions. Each question defines its text,
   help text, required state, answer type, ordering, and answer configuration
   (for example 1–10 scale labels, yes/no values, or multiple-choice options).
5. Admin edits public result text and score/range configuration, previews the
   respondent experience, and saves draft changes.
6. Publish validates the draft and creates an immutable published version. New
   visitors see only that published version. Existing submissions remain tied
   to the version they answered.
7. Admin may later edit a new draft version, publish it, or archive an
   assessment. Do not silently mutate the historical version used by existing
   submissions.

The UI tabs shown in the supplied screens map to:

- **Questions:** section and question authoring/reordering.
- **Sections:** section metadata and ordering.
- **Results text:** result headings, explanatory copy, bands, and guidance.
- **Settings:** title, slug, introduction, required lead fields, scoring scale,
  publication controls, and privacy text.
- **Preview:** render the exact published/draft respondent form without saving a
  submission.

### Public respondent flow

1. `/sales-alignment-assessment` requests the currently published assessment
   definition from a public read endpoint, such as
   `GET /api/v1/assessments/:slug`.
2. Endpoint returns only public fields: published version, ordered sections and
   questions, answer configuration, and respondent-facing copy. Never expose
   drafts or internal admin notes.
3. Respondent answers the questions and enters required first name/email.
4. Frontend submits answer IDs/values and respondent details to
   `POST /api/v1/assessments/:slug/submissions`.
5. Backend verifies the assessment is published, every question belongs to the
   submitted version, required questions are answered, values are in range, and
   lead fields are valid. Apply public endpoint throttling and abuse protection.
6. Backend computes scores itself. Do not accept client-computed totals, pillar
   scores, or “areas for closer review” as authoritative.
7. Backend saves the submission, answers, and score snapshot transactionally,
   then returns the respondent-facing results. Frontend displays the returned
   result and existing booking CTA.
8. Repeated submission behavior should be explicit: normally each accepted
   submission is a separate response; use an idempotency key to prevent
   accidental duplicate POSTs from retries.

### Admin responses and overview flow

1. Admin response list loads from
   `GET /api/v1/admin/assessments/:assessmentId/submissions`, with pagination,
   search, date/status filters, and response counts.
2. Admin opens a response detail to see contact details, assessment version,
   answers, computed scores, submission time, and review history.
3. Admin may mark a response reviewed, add internal notes, assign an owner, or
   create/update implementation follow-up items. These operations require JWT
   auth and should be auditable.
4. The **Assessment & Implementation** table in the overview loads actual
   assessment/implementation data. Its row model and status/owner vocabulary
   should be specified separately from the top-level sample KPI/chart data,
   which remains static in the initial phase.
5. Do not treat private respondent answers or internal notes as public
   assessment content.

## 3. Proposed API surface

Names are provisional; finalize DTOs before frontend integration.

### Admin assessment management — JWT required

| Method and path                                            | Purpose                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| `GET /api/v1/admin/assessments`                            | Search/filter/paginate assessment list                  |
| `POST /api/v1/admin/assessments`                           | Create assessment draft                                 |
| `GET /api/v1/admin/assessments/:id`                        | Load editable draft and its sections/questions/settings |
| `PATCH /api/v1/admin/assessments/:id`                      | Save draft metadata/content                             |
| `POST /api/v1/admin/assessments/:id/publish`               | Validate and publish a new immutable version            |
| `POST /api/v1/admin/assessments/:id/archive`               | Archive without deleting response history               |
| `GET /api/v1/admin/assessments/:id/submissions`            | Paginated response inbox                                |
| `GET /api/v1/admin/assessment-submissions/:submissionId`   | Response detail                                         |
| `PATCH /api/v1/admin/assessment-submissions/:submissionId` | Update review state, owner, and internal notes          |

Use the existing JWT guard, DTO validation, request ID, error filter, and response
envelope conventions.

### Public assessment endpoints

| Method and path                              | Purpose                                         |
| -------------------------------------------- | ----------------------------------------------- |
| `GET /api/v1/assessments/:slug`              | Return currently published public definition    |
| `POST /api/v1/assessments/:slug/submissions` | Validate, score, persist, and return a response |

Public GET can be cached by published version. Submission POST needs a stricter
throttle than the current global 50/min limit, plus input size limits and abuse
controls. Do not require admin login from public respondents.

## 4. Proposed data model

Use normalized relational records for entities users edit/search independently;
reserve JSON for versioned result copy/settings that do not need joins. Final
names are subject to schema review.

- **Assessment:** stable ID, unique slug, status (`DRAFT`, `PUBLISHED`,
  `ARCHIVED`), current published version, created/updated timestamps, creator.
- **AssessmentVersion:** assessment ID, monotonically increasing version,
  published timestamp, immutable public metadata/result configuration snapshot.
- **AssessmentSection:** version, title, description, ordering.
- **AssessmentQuestion:** section, prompt/help text, type, required flag,
  ordering, answer/scale configuration.
- **AssessmentChoice:** question, label, value, ordering for choice questions
  (or a validated JSON configuration if the final question type needs it).
- **AssessmentSubmission:** assessment/version, respondent first name/email,
  optional company/consent fields if approved, submitted timestamp, review state,
  owner/admin relation, internal notes.
- **AssessmentAnswer:** submission, question/version reference, normalized
  answer value; unique constraint per submission/question.
- **AssessmentScoreSnapshot:** submission total, section/pillar scores, result
  category and closer-review items captured at submission time. Could instead
  use typed columns plus JSON for the dynamic score breakdown.
- **AssessmentImplementationItem:** optional follow-up/action row linked to a
  submission or engagement, with title/question, focus, priority, owner, status,
  due/updated dates, and audit history. This powers the overview's
  Assessment & Implementation table if that table represents work items rather
  than raw submissions.
- **AssessmentAuditLog:** actor, assessment/submission/item, action, timestamp,
  and non-sensitive change summary for publish and review actions.
- **AdminPasswordResetChallenge** (or equivalent): admin, code hash, expiry,
  attempt count, consumed timestamp, and reset-proof hash/expiry; never raw
  secrets.

Add indexes for assessment slug/status, version, submission assessment/date,
respondent email, review state, and owner. Use foreign keys and delete policies
that preserve submission history when assessments are archived. Apply the schema
with a Prisma migration and regenerate the Prisma client.

## 5. Scoring and version integrity

- Reproduce the current 10-item behavior as the initial configuration: total
  score out of 100, section averages out of 10, and the existing lower-third
  closer-review rule.
- Move scoring to a backend service with unit tests and a versioned scoring
  configuration. Assessment authors must not be able to publish invalid scales,
  missing questions, duplicate identifiers, or malformed result bands.
- Persist a score snapshot so a later scoring-algorithm/content change cannot
  rewrite historical respondent results.
- If administrators can author arbitrary question types later, define a scoring
  strategy per type before allowing publication; answer labels alone are not a
  scoring contract.

## 6. Implementation phases

1. **Decisions and contracts**
   - Decide whether admin provisioning is seed-only or invitation-based.
   - Agree on response fields, consent/retention, response access, owner/status
     rules, score bands, and implementation item semantics.
   - Freeze endpoint DTOs and frontend response types.
2. **Auth recovery backend**
   - Add reset challenge schema/migration, DTOs, service/controller routes,
     throttles, email templates, audit events, refresh-token invalidation, and
     automated tests.
   - Wire existing forgot-password, verification, and update-password screens
     to the API; remove frontend-only success messages and query-string PII.
3. **Assessment schema and admin APIs**
   - Add assessment/version/section/question/submission/answer/score/review
     schema, migration, seed the existing live Sales Alignment Assessment as
     the first published version, then implement guarded authoring/list/publish
     and response endpoints.
4. **Public assessment API**
   - Implement public published-definition and submission endpoints, server-side
     validation/scoring, rate limiting, persistence, duplicate-request handling,
     and result response shape.
5. **Admin authoring UI**
   - Build assessment list, draft editor, sections/questions editor, results
     text/settings tabs, preview, publish/archive, and response count/status.
   - Replace static assessment config as the source for this page with the API
     response. Keep static config only as temporary migration seed/source.
6. **Respondent and results UI**
   - Load published content from API, submit lead/answers, show server-calculated
     results, handle errors/retries, and maintain accessible loading/submission
     states.
7. **Dashboard dynamic area**
   - Keep overview header/cards/chart static as requested.
   - Wire only the Assessment & Implementation table to submissions and
     implementation items, then add response detail, status/owner updates, and
     audit trail screens.
8. **Verification and rollout**
   - Add backend unit/integration tests and frontend API/UI tests.
   - Test draft isolation, publish versioning, required/range validation,
     anonymous submissions, scoring, duplicate POSTs, access control,
     throttling, password-reset expiry/reuse, email dry-run/live delivery, and
     migration rollback/restore procedures.
   - Deploy backend/migrations before enabling dynamic frontend routes; retain a
     controlled fallback during cutover and monitor submission/email failures.

## 7. Required decisions before implementation

1. Should admin signup be disabled, seed-only, or invitation-only? Public
   self-registration is not recommended for a `SUPER_ADMIN` role.
2. Should assessment respondents provide only first name/email as today, or also
   company, consent, phone, and other fields? What is the retention/deletion
   policy?
3. Are all published assessments public, or should some require a private link
   or access code?
4. Should each valid repeat submission create a new record, or should one
   respondent be limited to one response per assessment/version?
5. Who can see respondent PII and answers, and which review/implementation
   states and owner assignment are required?
6. Which fields and semantics should populate the overview's
   Assessment & Implementation rows? The supplied UI suggests implementation
   tasks; submissions alone do not provide owner/priority/status values.
7. Should result copy and scoring bands be editable by admins, or should the
   existing scoring algorithm stay fixed for the initial version?
8. Are Google sign-in and email delivery for password recovery required now, or
   should Google remain absent and recovery use the configured SMTP provider?

## Existing source files reviewed

- Backend auth: `backend/src/modules/auth/`
- Backend mail: `backend/src/modules/mail/`
- Backend schema and seed: `backend/prisma/schema.prisma`,
  `backend/prisma/seed.ts`
- Backend module/bootstrap: `backend/src/app.module.ts`, `backend/src/main.ts`
- Frontend auth: `frontend/north_sales/components/auth/`,
  `frontend/north_sales/lib/admin-auth.ts`
- Frontend admin dashboard: `frontend/north_sales/components/admin/`
- Current assessment UI/content:
  `frontend/north_sales/components/assessment/sales-alignment-assessment.tsx`,
  `frontend/north_sales/config/site.ts`
- Existing implementation documentation:
  `frontend/north_sales/docs/IMPLEMENTATION-WORKFLOW.md`,
  `frontend/north_sales/docs/APPOINTMENT-FLOW.md`

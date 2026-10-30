# Admin Authentication Flow

This document explains the admin authentication implementation currently in
the repository and the intended behavior for auth screens that are still
frontend-only. The backend has one admin role: `SUPER_ADMIN` (shown as Admin in
the UI/product language). There are no separate staff, editor, or user roles.

## Status at a glance

| Flow                       | Current status                                                            |
| -------------------------- | ------------------------------------------------------------------------- |
| Email/password login       | Connected to backend                                                      |
| Session refresh            | Connected to backend with rotating refresh tokens                         |
| Logout                     | Connected to backend                                                      |
| Current admin profile      | Connected to backend                                                      |
| Signup                     | UI exists; does not create an account                                     |
| Forgot password            | UI only; does not send an email                                           |
| Verification code / resend | UI only; does not verify or resend a code                                 |
| Update password            | UI only; checks matching passwords in the browser, then shows unavailable |
| Google login/signup        | UI button only; OAuth is not configured or connected                      |

The backend API prefix is `/api/v1`. Unless noted otherwise, successful API
responses use the existing response envelope; the frontend auth client unwraps
the `data` property.

## 1. Email and password login — implemented

### User journey

1. Admin opens `/admin/login`, enters email and password, and submits.
2. The frontend calls `POST /api/v1/auth/login` with:

   ```json
   {
     "email": "admin@example.com",
     "password": "admin-password"
   }
   ```

3. NestJS applies the local Passport strategy and validates the DTO. The auth
   service normalizes the email to lowercase, finds the admin, compares the
   submitted password with the stored bcrypt hash, and checks that the account
   is active.
4. Invalid credentials and inactive accounts are rejected with the same
   unauthorized response. Login is limited to five attempts per minute. Failed
   attempts are logged with email and IP.
5. On success, the backend updates `lastLoginAt`, creates a cryptographically
   random opaque refresh token, stores only its SHA-256 hash, and returns a
   signed JWT access token plus the refresh token and admin profile.
6. Frontend verifies the returned role is `SUPER_ADMIN`, stores the access
   token, refresh token, and profile in browser `sessionStorage`, and navigates
   to `/admin/dashboard`.

The current UI's **Continue with Google** button is separate; it only displays
that Google sign-in is unavailable and does not submit a request.

### Current endpoint

| Method and path           | Access                    | Behavior                                         |
| ------------------------- | ------------------------- | ------------------------------------------------ |
| `POST /api/v1/auth/login` | Public, 5 requests/minute | Validate credentials and return an admin session |

The session response contains `accessToken`, `refreshToken`, `tokenType`,
`expiresIn`, `refreshExpiresIn`, and `admin` (`id`, `name`, `email`, `role`).
Configured defaults are a 15-minute access token and a 7-day refresh token.

## 2. Session refresh, profile, and logout — implemented

### Refresh

When a protected frontend request receives `401`, `adminFetch` makes one shared
refresh request (concurrent requests share the same in-flight promise). It
calls:

```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

```json
{ "refreshToken": "opaque-refresh-token" }
```

The backend hashes and looks up the token, checks revocation, expiry, and admin
status, then issues a new access/refresh pair. It revokes the old token and
links it to the replacement. Reuse of a revoked token revokes all active
refresh tokens for that admin. Refresh is limited to 20 requests per minute.
The frontend stores the replacement session and retries the original request
once. If refresh fails, it clears the browser session.

### Current profile

`GET /api/v1/auth/me` requires a valid bearer access token and returns the
current active admin profile.

### Logout

`POST /api/v1/auth/logout` requires a valid bearer access token and receives the
refresh token in its request body. It revokes that token if it belongs to the
authenticated admin. The frontend should clear its stored session after logout.

## 3. Signup — UI exists; account creation is not implemented

The `/admin/signup` screen currently collects name, email, and password, but
submitting only displays an unavailable message. Its Google button is also
inactive. There is no signup, invitation, or admin-creation endpoint in the
auth controller.

The only role in the Prisma schema is `SUPER_ADMIN`, and the initial admin is
created through the environment-backed Prisma seed. Therefore, unrestricted
public signup must not be added: it would let visitors create privileged admin
accounts.

### Recommended admin provisioning flow

Use an invitation flow controlled by an existing admin:

1. Authenticated admin creates an invitation for an email address.
2. Backend generates a random, one-time invitation token, stores only its hash
   with an expiry, and sends an invitation email.
3. Invitee opens the signup page and submits the invite token, name, and
   password.
4. Backend validates the token and expiry, creates an active `SUPER_ADMIN`
   account, consumes the invitation, and invalidates the invitation token.
5. New admin goes to the login page and signs in.

Suggested endpoints (not implemented):

| Method and path                          | Access                      | Purpose                                        |
| ---------------------------------------- | --------------------------- | ---------------------------------------------- |
| `POST /api/v1/admin/invitations`         | Existing admin bearer token | Create and email an invitation                 |
| `POST /api/v1/auth/invitations/validate` | Public, throttled           | Validate invite and return safe invite details |
| `POST /api/v1/auth/invitations/accept`   | Public, throttled           | Accept invite and create the single admin role |

If admin invitations are not needed, keep signup disabled and retain seed-based
provisioning. Do not treat the current signup form as a working registration
flow.

## 4. Forgot password — UI exists; email request is not implemented

Currently `/admin/forgot-password` accepts an email and navigates to the
verification screen. It does not call the backend or send an email. The email is
currently passed in the URL query string for display; replace this with
short-lived client-side state when wiring recovery so personal data is not
placed in browser history or referrer URLs.

### Recommended flow

1. Admin submits their email.
2. Frontend calls `POST /api/v1/auth/password-reset/request`.
3. Backend always returns the same generic message, whether or not an active
   admin exists, to prevent account enumeration.
4. For an active account, backend generates a random one-time code, stores only
   a hash with expiry and attempt limits, and sends it using the configured mail
   service.
5. Apply throttles to prevent repeated requests, including a resend cooldown.

Suggested request:

```json
{ "email": "admin@example.com" }
```

Suggested response:

```json
{ "message": "If the account exists, a verification code has been sent." }
```

Proposed endpoint (not implemented):

| Method and path                            | Access            | Purpose                                                           |
| ------------------------------------------ | ----------------- | ----------------------------------------------------------------- |
| `POST /api/v1/auth/password-reset/request` | Public, throttled | Request recovery code; response does not reveal account existence |

## 5. Verification code — UI exists; verification/resend is not implemented

The current `/admin/verification-code` screen accepts six digits and checks
only that every input contains a digit. Submitting navigates to update-password
without sending the code anywhere. Resend displays an unavailable message.

### Recommended verify and resend flow

1. Frontend submits email and the six-digit code to the backend.
2. Backend checks the hashed code, expiry, attempt limit, and unused state.
3. On success, backend consumes the code and returns a short-lived,
   single-use reset token. The code itself must never authorize a password
   update after verification.
4. Frontend holds the reset token in short-lived memory/session state and moves
   to update-password. Do not put it in a query string.
5. Resend calls the request endpoint again, subject to cooldown and throttles;
   older outstanding codes should be invalidated.

Suggested verify request/response:

```json
{ "email": "admin@example.com", "code": "123456" }
```

```json
{ "resetToken": "short-lived-one-time-token", "expiresAt": "..." }
```

Proposed endpoints (not implemented):

| Method and path                            | Access            | Purpose                                        |
| ------------------------------------------ | ----------------- | ---------------------------------------------- |
| `POST /api/v1/auth/password-reset/verify`  | Public, throttled | Verify code and return one-time reset proof    |
| `POST /api/v1/auth/password-reset/request` | Public, throttled | Resend code with cooldown and generic response |

## 6. Update password — UI exists; persistence is not implemented

The current `/admin/update-password` screen checks that password and
confirmation match. If they do, it displays an unavailable message. It does not
call the backend or change the stored password.

### Recommended completion flow

1. Frontend submits reset token and new password to
   `POST /api/v1/auth/password-reset/complete`.
2. Backend validates the token's hash, expiry, and unused state, checks password
   policy, and hashes the new password with bcrypt.
3. Backend updates the admin password and consumes the reset token in one
   transaction.
4. Backend revokes every active refresh token for that admin so existing
   sessions end.
5. Frontend clears any local state and sends the admin to `/admin/login`.
   Password recovery should not automatically create an authenticated session.

Suggested request:

```json
{
  "resetToken": "short-lived-one-time-token",
  "password": "new-strong-password"
}
```

The frontend can compare confirmation fields before submission; the API does
not need to receive `confirmPassword`.

Proposed endpoint (not implemented):

| Method and path                             | Access            | Purpose                                               |
| ------------------------------------------- | ----------------- | ----------------------------------------------------- |
| `POST /api/v1/auth/password-reset/complete` | Public, throttled | Set a new password and revoke existing refresh tokens |

## 7. Google sign-in — UI only; OAuth is not implemented

Both login and signup screens currently display a Google button and local
“unavailable” notice. There is no Google OAuth strategy, callback, Google
configuration, identity verification, or frontend OAuth request in the code.
The Google icon is presentation only.

### Recommended Google login flow

Google sign-in should authenticate an existing admin account, not create an
admin automatically:

1. Frontend starts Google OpenID Connect (OIDC) Authorization Code flow with
   PKCE using an approved client library/provider integration.
2. Google authenticates the user and redirects to the configured callback.
3. Backend validates the authorization response and ID token using Google's
   issuer keys, expected audience/client ID, signature, expiry, nonce, and
   state. Do not trust an email or profile sent directly by the browser.
4. Backend finds an active `AdminUser` whose normalized email matches the
   verified Google email (and requires Google's `email_verified` claim).
5. If there is no matching, provisioned admin, deny access. Do not create a
   `SUPER_ADMIN` account based only on Google sign-in.
6. For a known admin, backend returns the same session shape as password login:
   short-lived JWT access token and hashed-at-rest rotating opaque refresh
   token. Frontend stores the session and opens `/admin/dashboard`.
7. Logout and refresh continue through the existing endpoints.

Implementation choices include a backend-managed OAuth callback or a trusted
frontend OIDC flow followed by backend ID-token verification. Whichever is
chosen, validate tokens server-side, use state/nonce/PKCE, restrict callback
URLs, and keep client secrets server-side. Do not treat Google OAuth as signup.

Possible API shape if backend-managed:

| Method and path                    | Access                             | Purpose                                                                  |
| ---------------------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `GET /api/v1/auth/google`          | Public, OAuth state/PKCE protected | Begin Google OIDC                                                        |
| `GET /api/v1/auth/google/callback` | Provider callback                  | Validate Google identity, require existing admin, issue standard session |

No Google endpoints or configuration currently exist.

## 8. Roles and access control

- Prisma enum `Role` currently contains only `SUPER_ADMIN`; frontend login also
  checks for that exact role.
- Product screens may label this account simply **Admin**, but API/session
  values remain `SUPER_ADMIN` unless the code and database are deliberately
  migrated.
- Admin API routes require a valid JWT and active admin account. Public auth
  endpoints (login, refresh, and any future recovery/invitation acceptance)
  must each have explicit validation and throttling.
- When adding future admin accounts, assign the same single role only through a
  controlled invitation/provisioning process. Do not add a role selector to
  public signup.

## 9. Auth files in this repository

- Backend endpoints: `backend/src/modules/auth/auth.controller.ts`
- Credential, token, and profile behavior: `backend/src/modules/auth/auth.service.ts`
- Email/password strategy: `backend/src/modules/auth/strategies/local.strategy.ts`
- JWT validation: `backend/src/modules/auth/strategies/jwt.strategy.ts`
- Authentication wiring: `backend/src/modules/auth/auth.module.ts`
- Admin and refresh-token records / role enum: `backend/prisma/schema.prisma`
- Frontend API, session storage, and refresh: `frontend/north_sales/lib/admin-auth.ts`
- Login form and dashboard redirect: `frontend/north_sales/components/admin/admin-login.tsx`
- Login and Google placeholder button: `frontend/north_sales/components/auth/login-screen.tsx`
- Signup placeholder: `frontend/north_sales/components/auth/signup-screen.tsx`
- Recovery screens: `frontend/north_sales/components/auth/forgot-pass-screen.tsx`,
  `frontend/north_sales/components/auth/verification-code-screen.tsx`, and
  `frontend/north_sales/components/auth/update-password-screen.tsx`

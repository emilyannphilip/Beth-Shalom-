# Beth Shalom portal authentication

Next.js sends credentials to NestJS and signs in against existing PostgreSQL user records. The browser uses the same-origin Next.js bridge. The bridge stores access and refresh tokens in HttpOnly cookies and forwards the access token to NestJS as a bearer credential. It sends only account context to the browser in the response body. Phase 7 uses the existing `users`, `roles`, `role_permissions`, `auth_sessions`, `password_reset_tokens` and `audit_logs` tables.

## Authentication endpoints

All endpoints are under `/api/v1`. The NestJS login and refresh responses carry token pairs for the trusted bridge. The bridge sets cookies and omits the tokens from the browser response body.

| Method and path | Access and behavior |
|---|---|
| `POST /auth/login` | Validates an active account by username or Staff ID and opens a database session. |
| `GET /auth/context` | Returns the current identity, role, and permissions for an active session. |
| `POST /auth/session` | Next.js only. Reconciles the browser session, rotates a refresh token when needed, and returns the account context or JSON `null` for a signed-out browser. It uses the same origin and CSRF checks as other portal writes. |
| `POST /auth/refresh` | Rotates the current refresh token and issues a new access token. |
| `POST /auth/logout` | Revokes the session associated with a valid credential. The bridge clears the cookies. |
| `POST /auth/forgot-password` | Returns a generic response. An eligible account receives mail when SMTP is configured. |
| `POST /auth/reset-password` | Consumes the recovery token, updates the password, and revokes existing sessions. |
| `POST /auth/change-password` | Requires sign-in and the current password. Updates the password and revokes existing sessions. |
| `POST /staff/:id/password-reset` | Allows Admin to request recovery for an active account at its registered email address. |

Both roles sign in at `/portal/login`. Admin lands at `/portal/admin` and Staff lands at `/portal/staff`. Both can change their password from the profile dialog. The recovery link opens `/portal/reset-password`.

## Permissions

| Module | Admin | Staff |
| --- | --- | --- |
| Dashboard | Full access | Full access to permitted modules |
| Enquiry Management | Full access | Full access |
| Admitted Resident Management | Full access | Full access |
| Room Management | Full access | Full access |
| Dormitory and Bed Management | Full access | Full access |
| Reservations and Allocations | Full access | Full access |
| Allocation History | Read-only | Read-only |
| Staff Account Management | Full access | No access |
| System Audit Logs | Read-only | No access |
| Own Profile and Password | Full access | Full access |

NestJS checks the active session and current role mappings on every private request. The Staff grants `enquiries.manage` and `residents.manage` cover all enquiry and resident operations, including resident records with a legacy visibility flag of false. Staff and Admin share permitted-module dashboard counts. Staff-account totals and system audit endpoints require administrator access. The enquiry assignee directory exposes active account IDs and display names only. Public APIs expose intake and aggregate availability.

## Environment

Copy the backend and frontend environment examples to ignored local files and restart both services when configuration changes. Use synthetic records for testing. Open the portal at the exact `PORTAL_ORIGIN`. Browsers treat `localhost` and `127.0.0.1` as different cookie hosts. The default local portal origin is `http://127.0.0.1:3000`.

| Variable | Location and purpose |
|---|---|
| `DATABASE_URL` | Backend PostgreSQL database. Tests use a separate migrated database. |
| `AUTH_ACCESS_SECRET`, `AUTH_REFRESH_SECRET` | Backend only. Generate two different random secrets of at least 48 characters. |
| `AUTH_ACCESS_SECONDS`, `AUTH_REFRESH_SECONDS` | Backend token limits. Defaults are 600 seconds for access and 604800 seconds for the absolute session lifetime. |
| `PORTAL_ORIGIN` | Both services. Use the same exact browser origin. HTTPS is required in production. Development defaults to `http://127.0.0.1:3000`. |
| `API_ORIGIN` | Frontend server only. The NestJS upstream, normally `http://127.0.0.1:3001` for local development. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM` | Backend recovery provider. Port 587 with required STARTTLS is the default. Port 465 uses implicit TLS. |
| `SMTP_USER`, `SMTP_PASSWORD` | Backend only. Set both when SMTP authentication is required. |
| `DEV_SEED_ENABLED`, `DEV_ADMIN_*`, `DEV_STAFF_*`, `DEV_SEED_SAMPLE_DATA` | Optional local seed settings for fictional PostgreSQL accounts and records. |

## Security

- Passwords use versioned, salted scrypt hashes. Successful sign-in upgrades a legacy hash. New passwords require at least 12 characters.
- PostgreSQL stores hashes for refresh and reset tokens. Reuse of an older valid refresh token revokes its session. Reset tokens expire after 30 minutes and can be used once. Password reset or change revokes existing sessions and outstanding reset tokens.
- Browser session cookies use HttpOnly and SameSite Strict. On HTTPS, they use Secure with the `__Host-` prefix. Authenticated mutations require the configured origin and a custom CSRF header. Private responses use no-store caching.
- Login limits apply per account and network. Requests through one Next.js bridge share its backend network limit. A multi-instance rollout needs shared rate limiting and trusted client network attribution.
- Append-only audit records cover authentication events and permission denials. Audit payloads omit passwords, tokens and personal contact details.
- Recovery mail was verified with an isolated SMTP sink over TLS. The project SMTP provider and sender still need to be configured for actual delivery.

## Verification commands

From the repository root, run `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:unit --workspace backend`. For `npm run test:integration --workspace backend`, set `DATABASE_URL` to the migrated `beth_shalom_test` database. Supply the seeded fictional account names with `DEV_ADMIN_USERNAME` and `DEV_STAFF_USERNAME` and their test passwords with `TEST_ADMIN_PASSWORD` and `TEST_STAFF_PASSWORD`. The SMTP test uses OpenSSL to generate an isolated TLS certificate. If OpenSSL is outside PATH, set `TEST_OPENSSL` to the executable.

The browser regression spec is `frontend/test/auth-session.e2e.mjs`. Run it with `node --test frontend/test/auth-session.e2e.mjs` against isolated loopback services using `TEST_PORTAL_ORIGIN`, `TEST_BACKEND_ORIGIN`, and the same fictional account variables. Set the test backend access lifetime below 45 seconds. Use `playwright-core` and a Chromium browser. `PLAYWRIGHT_MODULE` and `BROWSER_EXECUTABLE` can point to an existing installation. The spec covers anonymous startup, strict origins, cookie attributes, refresh, permissions, session loss, and logout over HTTP or HTTPS.

## Phase 7 verification

- TypeScript and ESLint passed for both workspaces. The NestJS and Next.js production builds passed.
- Three unit tests passed. The isolated PostgreSQL integration run passed both suites and covered login, permission denials, session revocation, refresh reuse, login throttling, TLS recovery email, single-use token expiry, password change and the existing CRUD and availability contracts.
- Browser end-to-end checks passed with fictional accounts. Coverage included Admin and Staff sign-in, Staff ID sign-in, Admin-only access restrictions, a Staff Room Management write at mobile width, protected routes, automatic refresh, logout, and the password change, forgot and reset screens.
- A local HTTPS smoke test of the production builds confirmed Secure, HttpOnly, SameSite Strict, host-only cookies, protected routing, and logout revocation. All eight public routes returned HTTP 200 in the production build.
- Both original design repositories were clean.

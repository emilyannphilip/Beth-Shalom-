# Beth Shalom Phase 6 integration

## Local execution

The project database is `beth_shalom_db` at `127.0.0.1:55432`. Start PostgreSQL using the instructions in [the backend reference](../backend/README.md), then run the backend and frontend from the repository root in separate terminals.

```powershell
npm run dev:backend
npm run dev:frontend
```

The default frontend is `http://127.0.0.1:3000` and NestJS is `http://127.0.0.1:3001`. Restart development processes after updating either environment. The browser sends same-origin requests to Next.js. Configure the upstream NestJS origin with `API_ORIGIN` in `frontend/.env.local`.

The portal uses the Phase 7 PostgreSQL accounts and JWT sessions. For local testing, use an isolated database and fictional accounts. Configure the same `PORTAL_ORIGIN` on both services and open the frontend at that exact origin. See [portal authentication](../backend/AUTHENTICATION.md) for credentials and recovery mail configuration.

## Integrated contracts

All routes in the following table use `/api/v1`.

| Area | Calls used by the frontend |
|---|---|
| Portal access | The Next.js proxy passes sign-in, password and session actions to the [auth endpoints](../backend/AUTHENTICATION.md#authentication-endpoints). |
| Public enquiries | `GET /public/enquiry-categories`, `GET /public/availability`, `POST /public/enquiries`. The same endpoint handles Welcome, Room, Harmony Suite, Admission, Facilities, Campus Walkthrough, and Contact submissions. Each submission stores the original source and topic and returns a database receipt. |
| Public room availability | `GET /public/availability`. Rooms and the visualizer show category totals, vacant rooms, remaining shared-room places, occupied and reserved rooms, and dormitory bed counts. These are aggregate responses. |
| Staff | `/staff` list, create, edit and archive, including item detail and activation actions. `/roles` supplies role IDs. Search, status and designation filters, sorting, and paging use API query parameters. |
| Enquiries | `/enquiries` and `/enquiries/:id` for list, detail, create, edit, and archive. `/enquiries/:id/followups` supplies updates and persistent history. Admin can assign accounts. Visit dates use the enquiry and visit request endpoints. CSV export uses all matching server records. |
| Residents | `/residents` and `/residents/:id` for list, admission, edit, and archive. `/residents/:id/history` and `/residents/:id/discharge` supply history and discharge. Contact and care fields are saved with the resident profile. Staff reads only profiles permitted by the API. |
| Room Management | `/accommodation-categories`, `/rooms`, `/dormitories`, `/beds`, and `/buildings` for the building reference. The four editable inventory tables use server-side search, filters, sorting and paging. |
| Allocations | `/allocations`, `/allocations/residents`, `/allocations/history`, `/allocations/:id/transfer`, and `/allocations/:id/release`. The candidate lookup returns limited resident identifiers for both roles. |
| Reservations | `/reservations` and the confirm, cancel, expire and convert actions. Pending reservations become availability holds on confirmation. |
| Dashboards | `/dashboard/summary` supplies actual counts with role-appropriate fields. |

## Source changes

- `frontend/src/lib/api*.ts` and `frontend/src/app/api/v1/` contain the web client, request state, and versioned proxy.
- `frontend/src/features/public/` contains form payload mapping, saved receipts, the original dialogs, and public availability. `frontend/src/app/(public)/rooms/layout.tsx` shares availability within the Rooms routes.
- `frontend/src/features/portal/` contains the API-backed portal context, record adapters, server table controls, form handlers, and the existing dashboard and management components.
- `backend/src/auth/access.ts`, `backend/src/common/`, `backend/src/enquiries/`, `backend/src/residents/`, `backend/src/housing/`, and `backend/src/administration/` contain authorization and the API contract extensions.
- Browser fixture records and the browser-only housing store were removed from the integrated frontend. The fictional PostgreSQL seed remains available for local development.

## Verification

| Scope | Evidence |
|---|---|
| Browser public intake | All seven forms returned saved receipts. The portal listed all seven distinct sources for the test run. |
| Browser Admin | Staff account creation, viewing, editing and archival. Public enquiry follow-up. Category, room, dormitory and bed creation. Resident admission with a room and emergency contact. |
| Browser Staff | Read the same saved enquiry. Transferred the resident to a bed, created and confirmed a room reservation, then cancelled it. Staff account and resident-profile editing requests were denied. |
| Availability and persistence | Room occupation, transfer, confirmation, cancellation, and discharge changed aggregate availability. The discharged resident and released allocation persisted after NestJS restarted and a fresh browser opened. |
| Responsive browser check | Public Rooms and Admin Room Management at 1440, 820, and 390 pixels. |
| Backend regression | Two unit tests and five integration checks passed against the isolated PostgreSQL test database. These covered validation, Staff activation/deactivation, permissions, manual enquiries and follow-ups, inventory integrity, booking conflicts, transfer and discharge. |

## Pre-Phase 8 Staff module access

Admin and Staff share the enquiry workspace, category controls, and resident management screen. Staff opens the resident module at `/portal/staff/residents`. Both roles can manage enquiry assignments and follow-ups, and resident profiles, care, contacts, admissions and discharge. Category changes, record writes and accommodation changes refresh relevant views through the existing API invalidation and polling. Public enquiry routing uses a stable category topic when a category is renamed.

Apply the PostgreSQL Staff access migration before starting the updated applications. See the [permission matrix](../backend/AUTHENTICATION.md#permissions) for the Admin-only account and audit boundaries.

The migration was applied to the configured local database. A Staff JWT issued before the migration picked up both grants, and resident, enquiry, user, inventory and booking row counts matched before and after. Both workspace builds, TypeScript and ESLint checks, three unit tests, and 12 isolated PostgreSQL integration tests passed. The production browser checks passed for Staff module access, the public support enquiry and registered portal routes. Run the targeted workflow with `node --test frontend/test/staff-access.e2e.mjs` against the isolated loopback services using the browser test environment described in the [authentication guide](../backend/AUTHENTICATION.md#verification-commands).

## Pre-Phase 8 portal cleanup and enquiry copy

The Admin and Staff sidebars render the Enquiry Management and Admitted Residents links without numeric badges. The links keep their icons, destinations and active styles. Staff profile and dashboard copy omits shift details, and the profile retains its password action.

Staff Management already omitted Shift Timing from its create and edit forms, table and write payloads. The NestJS staff DTOs and PostgreSQL schema require no shift data. This update uses the existing account validation, data and role mappings.

The Home hero reads “Submit Admission Enquiry” and links to `/admission-enquiry` with its existing styling. Public labels, page metadata and WhatsApp message text use British English. Route aliases, anchors and intake values retain their existing identifiers.

Edge browser checks passed for both sidebars, their active links, and the Home hero at 1440, 820 and 390 pixels. The production Staff Management forms created and edited a fictional account without shift data, and the account retained its role and password. Both workspace TypeScript, ESLint and production build checks passed, along with three backend unit tests and 12 isolated PostgreSQL integration tests.

## Pre-Phase 8 accommodation synchronization

Room Management previously read database-backed records, and parts of the public Rooms display still used static marketing inventory. The portal dashboard, catalogue, floor summaries and admission picker now use availability calculated from PostgreSQL. Public details, photos and filters follow the selected category or dormitory. Public counters distinguish completely vacant rooms, remaining places in shared rooms and individually available dormitory beds. Visitors see loading or error states when current counts cannot be fetched.

The Room Management screen reuses the existing category and inventory routes. Its category cards show floor breakdowns. Rooms and beds can be switched between a grid and a paginated table. Staff and Admin can use the same room, bed, booking and maintenance actions. Admin and Staff can admit a resident by selecting a category, floor and eligible unit, reviewing the admission, then committing it with the allocation. Resident discharge and admission cancellation release the corresponding accommodation according to the existing transaction rules. Unit and resident history remain read-only.

The same-origin availability request bypasses caches. Portal writes immediately invalidate loaded records. Visible portal and public availability views revalidate every 10 seconds and also refresh on focus. The Rooms catalogue and related Home and Harmony cards therefore pick up changes on an open page. An enquiry saves the accommodation category ID in the existing enquiry details and uses the existing staff follow-up workflow. A public submission does not create a booking.

The development seed previously added ground-floor Harmony rooms DEMO-R01 and DEMO-R02, Sample Dormitory DEMO-D01, and beds DEMO-B01 and DEMO-B02. These records remained eligible for availability after sample seeding was disabled. Room Management soft-archived the two rooms, two beds and dormitory after verifying zero active allocations and open reservations. The released allocation on DEMO-R01, its release history, the cancelled reservation on DEMO-B01, and the linked residents were retained. The public API now reports 32 wholly vacant rooms and 16 available beds, down from 34 and 18. Room counts on floors 0, 1, 2 and 3 are 0, 9, 7 and 16. DORM-01 contains all 16 beds and still needs its approved image, description and floor.

Development seeding leaves units and bookings alone. Two seed runs with sample data disabled, an inventory preview and apply, and a backend restart all preserved 32 rooms and 16 beds. The Next.js API bridge returned the same inventory as NestJS. See the [API and inventory setup](../backend/README.md#approved-inventory-configuration) for the preview and apply commands.

Targeted PostgreSQL integration checks covered room and bed availability edits, allocations, reservations, transfers, and discharges. Browser checks opened both live portal editors and confirmed four Harmony rooms and 16 dormitory beds. In the isolated database, an Admin room edit reached the open Home showcase and Staff availability. A Staff bed edit reached the open Rooms page and Admin availability. The Home showcase displayed room categories only.

### Verification after inventory changes

- The same inventory configuration was applied twice in isolated PostgreSQL. Repeating the local preview returned no changes. Before-and-after fingerprints matched for every existing allocation, reservation and allocation-history row.
- The production browser suite exercised Admin admission, Staff room and bed actions, rejected overbooking, enquiry category linkage, transfer and discharge, pending and confirmed holds, cancellation and automatic expiry, category edits, maintenance and reactivation. The public catalogue and Staff grid were checked at 390, 820 and 1440 pixels.
- PostgreSQL integration, JWT/session and email recovery regressions, browser authentication, category archival and Home support enquiry regressions, unit tests, ESLint, TypeScript, and both production builds passed.

## Pre-Phase 8 public header and breadcrumbs

The previous fixed header measured 108 px on the checked viewports. Public pages reserved 80 px, which put the start of the content 28 px behind the header. The About Us, Harmony and Room Visualizer breadcrumbs were affected.

The shared header is sticky and occupies its full natural height in document flow. The route wrapper preserves page styles without a layout box, so the header stays sticky through the common footer. All eight page mains start directly below it from first paint. The header height observer supplies the scroll offset and available mobile menu height. When a refresh restores a section target under the header, the target is brought back into view. About Us has labelled breadcrumb navigation with an active About Us item and a Home link.

The production Edge regression in `frontend/test/public-header-layout.e2e.mjs` passed on all eight public routes at 1440, 820, 390 and 320 pixels. It covered breadcrumb navigation, desktop and mobile menus, page and section-link refreshes, and a taller header. About Us also cleared the header with JavaScript disabled at all four widths. Both workspaces passed TypeScript, ESLint and production builds.

## Pre-Phase 8 public Rooms category cards

Room category cards on `/rooms` show View Details and Explore layout. View Details opens the selected category preview with its live availability and application action. Dormitory enquiry and the general Admission Enquiry remain available in their existing sections.

Edge checks on the production build verified all six room cards at 1440, 820 and 390 pixels, with three, two and one grid columns respectively. Every View Details button opened its category preview. Counts matched the running public API, and the card and open preview refreshed after a browser-only availability change. Both workspace TypeScript checks, ESLint and production builds passed.

## Pre-Phase 8 availability management

The category and dormitory tables now use the PostgreSQL aggregates. The earlier dormitory table counted statuses from a separate per-bed snapshot. The summary, bulk portal inventory, resident profiles, and public pages could also refresh at different times. Visible views use the same ten-second interval, and successful accommodation or resident changes notify other open tabs on the same origin.

Unit, floor, dormitory, category, and dashboard counts use one availability classification. A whole room is vacant only when it has no occupants or confirmed holds. A partially occupied or reserved shared room may still have unheld places. Pending requests do not consume capacity, but they protect named units from manual adjustments. The public dormitory category includes all of its unarchived beds. An individual dormitory card includes just its assigned beds.

Edit Availability lists the named units under a category or dormitory. It previews the count changes and saves the requested updates in one auditable transaction. The existing room and bed forms add inventory. To change occupied and reserved counts, use the linked allocation and reservation workflows. The public Home and Rooms designs continue to read the existing availability endpoint.

Verification covered an Admin room adjustment, a Staff bed adjustment at phone width, and public refresh on Home, Rooms, and the individual Dormitory card. PostgreSQL tests covered booking conflicts, stale and invalid selections, all-or-nothing changes, audit entries, and automatic updates after resident transfer and discharge. The existing browser flow also passed for admission, transfer, reservation, maintenance, and synchronization.

## Pre-Phase 8 route and resource integrity

The local NestJS process was still serving a compiled build that predated `/accommodation-categories/:id/availability` and `/dormitories/:id/availability`. The configured frontend origin and the `/api/v1` prefix already matched. The replacement build was checked against PostgreSQL on a temporary loopback port, then started on the existing port 3001. Both routes now require authentication on the local service.

Next.js now serves the Beth Shalom favicon from the approved logo. The API bridge preserves a 404 for a missing endpoint and explains that the configured backend does not expose the named method and path. A genuine missing-record 404 still carries its original message. Automatic revalidation of the same missing resource stops until an explicit retry or a new resource selection.

The production browser route audit passed for all eight public pages and both portal roles with no unexpected 404 responses or console errors. The availability editor browser test confirmed that Admin and Staff changes reach the public Home and Rooms views, including Dormitories. Both suites used isolated PostgreSQL test data.

## Pre-Phase 8 loading and performance

Four public Google font stylesheets previously blocked the browser while external resources were slow. A controlled six-second stylesheet delay produced a 7.04-second Home load. Public fonts, icons and approved design photos now load from the site. The Home hero uses responsive WebP versions of the same art. The largest asset fell from 2,284,712 bytes to 256,310 bytes at its original dimensions.

Room Management previously loaded full allocation history on entry and refreshed unrelated resources together every ten seconds. A slow resource could be cancelled on each tick before the browser received a result. Availability checks now wait for the outstanding request to settle and run in the background on visible views. The browser displays a retry action after a failed request. Room Management loads history only when its paginated view is opened, and debounces typed searches. Public and portal navigation keep Next.js client links plus intent-based prefetching. Home and the Rooms routes share a single availability load and revalidation schedule.

Protected routes pass the server-verified identity to the portal. The guest sign-in probe remains, private APIs retain role and JWT checks, and shared refresh logic preserves secure cookies and CSRF. A transient outage keeps the session intact so the user can retry. An invalid refresh returns the user to sign-in.

The availability migration produced identical rows before and after on both isolated and local PostgreSQL. In five measured runs after a warm-up, dashboard execution moved from 22.5 ms to 10.6 ms and public availability from 47.0 ms to 17.3 ms. Timing numbers describe this local synthetic workload. In the cold development run, Home took 71.7 seconds to reach its load event, including 67.4 seconds waiting for the first byte. The first Rooms navigation took 6.7 seconds. A previously compiled production build avoids this on-demand route compilation.

### Production browser measurements

The Home and Rooms measurements used the same six-second fault injected into requests for external stylesheets. Room Management counts include the navigation and the first 11.5 seconds of background traffic. Repeated endpoint counts include legitimate scheduled checks and requests for different pages.

| Measurement | Before | After |
| --- | ---: | ---: |
| Home load event | 7.04 s | 6.62 s |
| Home to Rooms with counts visible | 1.64 s | 1.44 s |
| Home and Rooms availability calls during the sample | 3 | 2 |
| Admin Room Management navigation | 1.52 s | 0.76 s |
| Admin Room Management API calls | 30 | 16 |
| Staff Room Management navigation | 0.46 s | 0.52 s |
| Staff Room Management API calls | 29 | 16 |
| Repeated Admin / Staff endpoint calls | 15 / 16 | 3 / 4 |
| Home compressed JavaScript received | 153 KiB | 155 KiB |

In a desktop Lighthouse run using native timings, the Home performance score moved from 76 to 84, LCP from 1.64 to 1.17 seconds, first contentful paint from 1.44 to 1.17 seconds, and CLS from 0.020 to 0.056. The controlled browser run also logged interaction timings. They varied with local load, so this report does not assign a field INP value. Portal response times likewise varied with concurrent local activity. The navigation checks verified client-side transitions and showed no public authentication probes. The controlled browser regression verified that a 12-second request could finish, the timeout replaced a spinner with a retry action, and the page stayed navigable. The auth, inventory synchronization, category archive, and children’s support regressions passed on production builds. The final TypeScript, ESLint, backend unit and PostgreSQL integrations, and both production builds also passed.

## Phase boundary

The verification table records the Phase 6 baseline. Phase 7 added JWT-backed portal access. Existing directions and architectural PDF controls still depend on those original assets.

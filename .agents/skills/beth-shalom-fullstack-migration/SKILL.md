---
name: beth-shalom-fullstack-migration
description: Analyze, plan, migrate, or verify the Beth Shalom public website and Admin and Staff Portal as one Next.js App Router, NestJS, and PostgreSQL application while preserving both original HTML, CSS, and JavaScript designs. Use for explicitly requested Beth Shalom migration work.
---

# Beth Shalom Full-Stack Migration

Work on the migration only when explicitly requested. Identify the authorized phase or deliverable and complete phases in order, using existing project work where it already satisfies a phase. For a request covering multiple phases, verify each phase before proceeding to the next.

## Source designs and requirements

- Treat `Beth Shalom/` as the public design and `Beth Shalom Portal/` as the Admin and Staff design. Keep both original folders intact at their existing locations. Use them as the reference for visual and functional parity.
- Preserve each page's layout, copy, colors, typography, imagery, icons, animations, responsive behavior, navigation, and existing interactions. Reuse the original CSS and assets where practical. Use Tailwind CSS where it fits the implementation and preserves the rendered design.
- Inventory pages, shared layouts, styles, scripts, assets, forms, popups, navigation, and interactive states. Map each source page and behavior to its intended route, component, API, or explicit open requirement. Use this mapping during implementation and verification.
- Base portal fields, workflow transitions, and permissions on approved requirements. Record gaps and ask for clarification when an unresolved requirement would change data access, persistence, or user-visible behavior. Continue work that does not depend on the answer.

## Approved portal permissions

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

- Use the shared Enquiry Management and Admitted Resident Management components on each role's routes. Staff can view and edit all resident profiles, including clinical and contact information. PostgreSQL retains the legacy visibility column for compatibility. It no longer gates access.
- Grant `enquiries.manage` and `residents.manage` through the versioned PostgreSQL Staff role migration. Existing JWT sessions resolve current grants on each private request. Use the scoped, names-and-IDs-only enquiry assignee directory. Keep staff accounts, roles, permissions, staff password recovery and system audit logs protected by their Admin grants.
- Preserve public intake routing when a managed enquiry category is renamed. Its stable public topic stays linked to the original category. Inactive categories leave public intake and keep their existing enquiry links. Attribute management writes and archive operations to the authenticated actor.
- Preserve shared Room Management and read-only allocation history. Use PostgreSQL transactions and constraints to prevent duplicate active allocations and overbooking, and block archival while a room or bed has an active allocation or reservation. Resident discharge releases accommodation. Expose aggregate counts only to public callers.
- Use isolated synthetic data to verify both roles, cross-role persistence, public availability, and denied system operations. Phase 8 requires separate approval.

## Pre-Phase 8 portal cleanup and enquiry copy

- Keep sidebar links to Enquiry Management and Admitted Residents free of numeric badges in both portals. Retain their labels, icons, destinations and active styling. Keep dashboard statistics and notification behavior.
- Keep Shift Timing out of staff account forms, directory columns, profiles and dashboards. Staff account writes use the existing identity, role, status and password rules. Preserve account data and the approved permissions.
- Use British English for user-facing enquiry wording. The Home hero uses “Submit Admission Enquiry” and links to `/admission-enquiry`. Preserve the existing button styling and routing, including internal form values and anchor IDs.
- Verify both role sidebars and the Home CTA at desktop, tablet and mobile widths. Test staff account creation and editing with a fictional account in isolated PostgreSQL. Phase 8 requires separate approval.

## Accommodation category changes

- Show rooms and dormitories that still reference a category before archive. Treat all unarchived inventory as a dependency, including inactive and maintenance units. Archive with a soft delete after the inventory has been reassigned or safely archived.
- Admin and Staff may reassign selected inventory to an active category of the same accommodation type. Validate every selected unit in the housing transaction, and reject the batch if a unit has an active allocation or an open reservation. Keep inventory capacity, booking references and historical records intact.
- Deactivation hides a category from public availability and keeps its linked records when no active bookings would be affected. Await every write before closing a confirmation or reporting success. On a 409, keep the dialog open and refresh the dependency list.
- PostgreSQL regression coverage exercises archive eligibility, all-or-nothing reassignment, dormitory beds, booking protection, public availability and history. The browser regression in `frontend/test/category-archive.e2e.mjs` passed against the production build. It verified concurrent inventory changes, a visible 409 warning, Staff reassignment, Admin deactivation and archive, and public availability updates.

## Pre-Phase 8 inventory and public synchronization

- Extend the existing Room Management routes, NestJS API and PostgreSQL schema. Keep the approved inventory at Nest N-301–316 on floor 3, Heaven H-201–204 on floor 2, Aura A-101/A-201, Vista V-101–104 on floor 1, Harmony HM-101/102 and HM-201/202, and Grande G-101/102 on floor 1. Configure Dormitory DORM-01 with beds D-01 through D-16. Leave its floor unconfigured until confirmed, and derive dormitory capacity from its beds.
- Apply the availability migration, preview `npm run db:inventory --workspace backend`, and review any conflicts before adding `-- --apply`. Keep existing approved occupancy limits and preserve unrelated inventory, allocations, reservations and history. Missing dormitory photos and copy remain unset until supplied. Use stable seed keys so reruns preserve subsequent portal edits and archive actions.
- Derive status and per-floor counts from PostgreSQL. Count wholly vacant rooms separately from places in shared rooms. Confirmed reservations hold capacity, pending requests leave capacity unchanged, and expired holds roll off automatically. The portal reloads after writes. Open, visible public pages refresh availability every 10 seconds and revalidate on focus. The public API exposes aggregate availability and public content only. Room and dormitory enquiries store the selected accommodation category ID and create no booking.
- Require an eligible room or bed for new admissions by Admin and Staff. Select category, floor and unit, then confirm the review and save the admission and allocation together. Both roles retain full Room Management access and read-only allocation history.
- Verify repeatable inventory configuration, responsive Room Management and public Rooms, conflict handling, and Admin/Staff synchronization alongside the Phase 6 and Phase 7 regressions. The inventory, browser synchronization, JWT and build checks passed. See [frontend/INTEGRATION.md](../../../frontend/INTEGRATION.md#pre-phase-8-accommodation-synchronization) for verification and local inventory limitations. Phase 8 requires separate approval.

## Pre-Phase 8 inventory reconciliation

- Legacy development seeding created DEMO-R01/02 in Harmony on floor 0 and Sample Dormitory DEMO-D01 with beds DEMO-B01/02. Before soft archiving known sample units through Room Management, inspect allocations, reservations, and history in PostgreSQL. Preserve residents, released allocations, closed reservations and read-only history. Archive eligible beds before the parent dormitory.
- Development seeding leaves inventory and bookings alone. Only an explicit inventory configuration applies the approved catalogue. Keep sample residents and enquiries behind DEV_SEED_SAMPLE_DATA=true and use the isolated test database for synthetic workflow records.
- The configured database returned 32 rooms and 16 beds after archival, repeated seeding, configuration and backend restart. Room counts are 0 on ground, 9 on floor 1, 7 on floor 2 and 16 on floor 3. DORM-01 contains 16 beds with no configured floor. Keep the public Home showcase room-only and the Dormitory section on Rooms. See [local reconciliation](../../../frontend/INTEGRATION.md#pre-phase-8-accommodation-synchronization). Phase 8 requires separate approval.

## Pre-Phase 8 availability management

- Count every room and bed once using the shared PostgreSQL availability classification for unit, floor, dormitory, category, and dashboard views. Use separate metrics for wholly vacant rooms and remaining places in rooms that share capacity. Category and dormitory totals include their unarchived inventory.
- Admin and Staff use Edit Availability on a category or dormitory to select named rooms or beds, review current and projected totals, and confirm the changes. Apply the whole batch in the existing housing transaction. Reject stale, duplicate, out-of-scope, booked, or invalid selections. Archive only eligible units and retain their records and history. Audit each changed unit.
- Add units through the existing room and bed forms. Update occupied and reserved counts through the existing allocation and reservation actions, including transfers, releases, cancellations, and discharges. Never persist independent manual count fields.
- Use the existing housing permission for the scoped availability API. Publish a same-origin invalidation after successful housing writes and revalidate visible views on the shared schedule. Keep the Home room-only design and separate public Dormitory availability.

## Pre-Phase 8 route and resource integrity

- Check the exact method and URL in browser network logs. Compare the running NestJS route contract with the compiled backend before changing the Next.js proxy. Both category and dormitory availability routes use the existing `/api/v1` bridge and housing authorization.
- Preserve HTTP 404 responses. Distinguish an unregistered upstream route from a missing inventory record. Keep the error visible and pause automatic requests for the same missing resource until the user retries or changes the resource selection.
- Serve the Beth Shalom favicon at `/favicon.ico`. Verify all public pages and both role-specific portal modules against a matching production build and isolated PostgreSQL. See [route and resource verification](../../../frontend/INTEGRATION.md#pre-phase-8-route-and-resource-integrity).

## Pre-Phase 8 loading and performance

- Keep public design media and fonts local where approved assets are available. Serve the original Home hero art as responsive WebP and lazy-load non-critical images. Keep approved typography and the existing navigation, popups, and accessibility.
- Bound database statements, the Next.js proxy, and browser requests. Let a request settle before scheduling another availability check. A failed check exposes a retry action. Only visible, relevant views check availability automatically. Public availability and live tables refresh every 10 seconds after a completed check. Portal availability, relevant profiles, and live inventory use the same interval. Saved housing mutations invalidate active views and notify other open tabs on the same origin.
- Use the server-verified portal actor on protected routes. Keep the signed-out probe on sign-in and coordinate refreshes through the Phase 7 session lock. Return an expired session to sign-in and retain cookies during a transient upstream refresh failure. Keep JWT verification, CSRF and role permissions.
- Use shared PostgreSQL availability calculations and fetch allocation history page by page when it is opened. Compare browser timings, request counts and query plans against an isolated PostgreSQL fixture before changing this strategy. See [frontend/INTEGRATION.md](../../../frontend/INTEGRATION.md#pre-phase-8-loading-and-performance). Phase 8 requires separate approval.

## Public header and breadcrumbs

- Keep the public header sticky and in document flow. Its contact strip and navigation row reserve their combined height at first paint. Public page content begins directly below, with each page retaining its own section spacing.
- Use the observed public header height for scroll clearance and the mobile menu's available viewport height. Correct a restored section target that lands under the header on load or refresh. Keep the About Us breadcrumb as labelled navigation with a Home link and an About Us current-page marker.
- Verify all public routes at desktop, tablet and mobile widths. Exercise direct access, primary navigation, refresh, and direct and clicked section links. Phase 8 requires separate approval.

## Public Rooms category cards

- Show View Details and Explore layout as the card actions for room categories on `/rooms`. Keep View Details connected to the selected category preview and its live availability. Retain the room application inside the preview, the separate Dormitory enquiry, and the general Admission Enquiry links.
- Keep the responsive card grid, images, descriptions and API-backed availability. Verify the card actions and preview at desktop, tablet and mobile widths. Phase 8 requires separate approval.

## Home living spaces showcase

- Preserve the approved “Thoughtfully Planned Living Spaces” styling from the original Home section. Keep the one-, two-, and three-column grid, the 640 × 298 image proportions, original typography and spacing, and “View room options” links with their arrow icons.
- Show only API categories whose accommodation type is `ROOM` in the Home showcase. Use backend category names, images, and a compact line for vacant rooms and remaining places. Keep the separate Dormitory section and enquiry on `/rooms` with the existing live availability integration.

## Home children’s support enquiry

- Keep “Care & Support for Differently-Abled Children” immediately before “Thoughtfully Planned Living Spaces”. Use the Independent Dormitories & Transparent Admissions reference for dormitory accommodation, individualized support, family consultation, and monthly contributions based on care needs and economic background. Keep the Botanical Pastel styling. Use the supplied four-panel collage at `frontend/public/beth-shalom/assets/home-children-support-collage.webp` at its original aspect ratio. Keep the collage uncaptioned and retain its descriptive alt text.
- Reuse the public request dialog and `POST /api/v1/public/enquiries`. Use `HOME_CHILDREN_SUPPORT` and the canonical Differently-Abled Support Living category. Require parent or guardian contact details, accommodation requirements, a message and contact consent. Child name, age and practical support needs are optional. Keep diagnoses and medical records out of this intake.
- Persist the enquiry in the existing enquiry and detail tables, and display the source and support details through the current Admin and Staff enquiry and follow-up views. The production browser regression in `frontend/test/children-support.e2e.mjs` passed with fictional fixtures at desktop, tablet and phone widths. It verified form validation, a retry after an API error, PostgreSQL persistence, access in both portals, and a Staff follow-up visible to Admin. Wait for approval before starting Phase 8.

## Phase 5 implementation

- The NestJS API uses the `/api/v1` prefix. See [backend/README.md](../../../backend/README.md) for setup, migration and seed commands, REST contracts, and permissions. The PostgreSQL migrations in `database/migrations/` define 23 application tables, five calculated views, and database-side integrity checks.
- Preserve the source form and original topic when integrating public enquiries. Read capacity from the database availability endpoint. Completely vacant rooms and remaining places in shared rooms are separate values. Do not send resident fields through public endpoints.
- Use an isolated local PostgreSQL database and synthetic records for verification. Keep credentials in the ignored environment file.

## Phase 6 implementation

- The public frontend sends all seven enquiry forms through the versioned Next.js proxy and receives PostgreSQL-backed receipts. Public accommodation counts come from the availability API. The portal uses API-backed search, filters, paging, actions, and dashboard counts with the existing design.
- See [frontend/INTEGRATION.md](../../../frontend/INTEGRATION.md) for setup, integrated contracts and verification. The frontend uses the same-origin Next.js bridge and NestJS verifies JWT sessions and permissions against PostgreSQL.
- Browser verification covered all seven public submissions, Admin follow-up and staff account CRUD, room, dormitory and bed creation, resident admission, Staff transfer and reservation confirmation/cancellation, and Admin discharge. Persistence was verified after a NestJS restart and a fresh browser session. Public Rooms and Admin Room Management passed at 1440, 820, and 390 pixels. The Phase 7 regression suite exercises these same API contracts with JWT sessions.

## Phase 7 implementation

- Admin and Staff sign in against PostgreSQL records. NestJS verifies JWT access against the current database session and permission mapping on each private request. The Next.js proxy keeps access and rotating refresh tokens in HttpOnly cookies and requires a matching browser origin and CSRF header for authenticated mutations.
- Keep Staff Account Management and system audit logs Admin-only. Apply the approved shared enquiry, resident and housing permissions. Allocation history and system audit logs have no write endpoints. Use append-only audit records for authentication events and permission denials.
- Password recovery uses expiring, hashed single-use tokens and TLS SMTP. Reset and change revoke existing sessions. Require separate access and refresh secrets and matching portal origins. See [backend/AUTHENTICATION.md](../../../backend/AUTHENTICATION.md) for the endpoint list, permission matrix, environment and tests. A project SMTP provider is pending. Use synthetic test accounts and wait for explicit approval before Phase 8.
- Phase 7 TypeScript, ESLint, unit, PostgreSQL integration, and production build checks passed. Browser verification covered both roles, Staff Room Management, login and recovery. The production HTTPS smoke test verified cookie attributes, protected routes, revocation, and the eight public routes.

## Phases

1. **Analyze and plan.** Inventory both designs, map shared components, routes, interactions, data needs, and role boundaries, and record migration priorities and acceptance checks.
2. **Set up the architecture.** Use `frontend/` for a single Next.js App Router application in TypeScript, `backend/` for a separate NestJS REST API in TypeScript, and `database/` for PostgreSQL migrations and database scripts. If an `original-design/` reference area is useful, keep it supplementary to the two existing source folders. Obtain approval before significant architecture changes.
3. **Migrate the public site.** Create App Router pages and reusable components. Translate existing DOM-based JavaScript into typed React state, events, and effects as appropriate. Use Client Components where browser APIs or interactive state require them.
4. **Migrate the portal.** Build separate public and portal layouts within the same application. Use protected portal routes and modular components for Admin and Staff workflows. Preserve the visual and interactive behavior of the source portal.
5. **Build the backend and database.** Organize NestJS modules around authentication, staff accounts, enquiries, and admitted-person records. Use one PostgreSQL database with versioned migrations, appropriate constraints, and indexes for approved query patterns. Define REST contracts and server-side validation for the data each interface sends or receives.
6. **Connect both interfaces.** Submit public enquiry forms to the NestJS API and persist enquiries so authorized portal users can manage them. Connect the approved staff account, enquiry, and admitted-person operations. Implement validation, CRUD, search, pagination, loading, empty, success, and error states where the workflow requires them.
7. **Finish authentication, authorization, and remaining features.** Implement Admin and Staff login with JWT and secure password hashing. Enforce approved role and record-access rules in NestJS for every protected operation and use frontend checks for routing and navigation. Apply server-side validation to public and protected endpoints, configure secrets through environment variables, and account for token expiry and invalid sessions. Enforce access controls before using connected portal routes with real records.
8. **Verify and prepare for deployment.** Compare the migrated pages and interactions with both original designs at representative desktop and mobile widths. Exercise public enquiry submission through portal visibility, role access and denial, and approved management workflows. Run existing or required frontend and backend tests, type checks, and production builds. Fix TypeScript, API, routing, and build failures. Verify migrations against a test database and prepare environment configuration and deployment steps. Obtain permission before any push or deployment.

Keep pages and backend modules focused, and share components and logic where the designs or workflows actually reuse them. At the end of each phase, record the completed scope, checks run, and any open requirements that affect later phases.

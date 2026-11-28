# Beth Shalom API

## Local setup

Use a PostgreSQL instance reserved for this project. Compose binds PostgreSQL to loopback on port 5433 by default. Preserve any existing service and choose a free port. Create `beth_shalom_db` and a separate `beth_shalom_test` for integration tests. Copy `backend/.env.example` to `backend/.env` and set the connection URL with the actual port and a URL-encoded password. To start a new Compose instance, set `POSTGRES_PASSWORD` and run `docker compose -f database/compose.yaml up -d`. PostgreSQL container initialization variables apply only to a new data volume.

| Command | Purpose |
|---|---|
| `npm run db:migrate -- up` | Apply pending migrations. |
| `npm run db:migrate -- down 1` | Roll back one migration. Rehearse on the isolated test database. Rolling back the schema migration removes the application tables. |
| `npm run db:seed --workspace backend` | Seed reference records and optional fictional samples. |
| `npm run db:inventory --workspace backend` | Preview the approved accommodation inventory and report mapping conflicts or additional active records. Add `-- --apply` to persist changes. |
| `npm run dev:backend` | Run the API on loopback port 3001 by default. |
| `npm run build --workspace backend` | Compile the backend. |
| `npm run start --workspace backend` | Start the compiled backend. |
| `npm run test:unit --workspace backend` | Run unit tests after compiling. |
| `npm run test:integration --workspace backend` | Run HTTP and PostgreSQL tests against migrated, seeded `beth_shalom_test`. Supply the database URL and seeded development usernames in the shell environment. |

Swagger is at [localhost port 3001, /api/docs](http://127.0.0.1:3001/api/docs). OpenAPI JSON is available at `/api/docs-json`.

Private routes use JWT sessions and check permissions against PostgreSQL. See [portal authentication](AUTHENTICATION.md) for environment setup, account recovery, and verification. For isolated local testing, set `DEV_SEED_ENABLED=true` with the credentials for fictional accounts before seeding. Set `DEV_SEED_SAMPLE_DATA=true` to also create fictional residents and enquiries. Development seeding leaves room and bed inventory and bookings alone. Use `db:inventory` to configure the approved inventory and create any workflow fixtures through Room Management in the isolated test database.

The Windows Phase 5 development instance was set up separately on port 55432 under the current user's local application data. After a reboot, start that instance with the PostgreSQL 18 tools before starting NestJS.

```powershell
$instance = Join-Path $env:LOCALAPPDATA 'BethShalom/phase5-postgres'
& 'C:/Program Files/PostgreSQL/18/bin/pg_ctl.exe' -D (Join-Path $instance 'data') -l (Join-Path $instance 'postgres.log') -o '-p 55432 -h 127.0.0.1' -w start
```

## Schema and migrations

| Migration | Contents |
|---|---|
| `1795560000000_phase5-schema.sql` | 23 application tables, identifiers, relationships, constraints, indexes, timestamps and append-only history protection. |
| `1795560000001_phase5-availability.sql` | `vw_room_availability`, `vw_dormitory_availability`, `vw_category_availability`, `vw_resident_accommodation`, and `vw_dashboard_summary`. |
| `1795560000002_phase5-integrity.sql` | Matching inventory category and active allocation capacity triggers. |
| `1795560000003_inventory-availability.sql` | Optional dormitory floor and presentation fields, resident expected discharge date, stable inventory keys, and shared PostgreSQL availability views for floors and beds. |
| `1795560000004_availability-performance.sql` | Computes each housing floor once per availability query, then rolls those results up to category totals. Keeps the existing view contract and takes effect without storing inventory snapshots. |
| `1795560000005_shared_availability_state.sql` | Shares one classification across room, bed, floor, dormitory, and category counts. Rows with conflicting legacy flags are counted once, with bookings taking precedence. |
| `1795560000006_staff_module_access.sql` | Grants Staff enquiry and resident management and links the original public forms to stable enquiry-category topics. |

Roles link to permissions through a composite key. Users reference roles and own sessions, reset tokens and management actions. Enquiries reference categories and can have details, follow-ups, visits, residents and reservations. Resident contacts are one-to-many and care details are one-to-one. Rooms and dormitories reference buildings and correctly typed accommodation categories. Every bed belongs to a dormitory. Every allocation and reservation targets exactly one room or bed. Partial unique indexes restrict active allocations to one per resident and one per bed. Allocation history and audit logs are append-only.

The schema preserves the PDF's 23-table structure. Additions cover applicant relationship, an optional configured dormitory bed limit, a legacy resident visibility field, building archival, and the converted allocation reference on reservations. Actual bed counts come from inventory. Confirmed reservations hold capacity during half-open time intervals. Pending requests await confirmation. Expired holds drop out of availability automatically and can be finalized through the expiry action. Active allocations are open-ended and account for future confirmed reservations.

## Approved inventory configuration

Apply the inventory migration before running `db:inventory`. The command reuses the six approved room categories, their configured occupancy limits, and the Dormitory category. It configures 32 rooms and beds D-01 through D-16 under dormitory DORM-01. The initial dormitory floor is unconfigured. The configured room floors come from their individual units. Dormitory capacity comes from its bed inventory.

Review the preview before applying changes. The command aborts on conflicting category or unit mappings. It preserves extra inventory, current assignments, reservations and history. Stable inventory keys prevent duplicate seeds, including after a portal user edits a unit number or archives a seeded unit. Soft-archived demo units stay out of availability.

## REST endpoints

Every route below is under `/api/v1`. CRUD means collection `GET` and `POST` plus item `GET`, `PATCH`, and `DELETE` at `/:id`. Inventory, staff and enquiry deletion archives the record. Reservation and visit deletion cancels it.

| Access | Endpoints |
|---|---|
| Public | `GET /health`, `GET /health/database`, `GET /public/enquiry-categories`, `GET /public/availability`, `POST /public/enquiries` |
| Authentication | See [the authentication contract](AUTHENTICATION.md#authentication-endpoints) for session and password endpoints. |
| Admin | CRUD `/staff`, `POST /staff/:id/activate`, `POST /staff/:id/deactivate`, `GET /roles`, `GET /roles/:id/permissions`, `GET /permissions` |
| Admin and Staff | Read `/enquiry-categories` and `/enquiry-categories/:id`. Admin can create, patch and retire categories. |
| Admin and Staff | `GET /enquiries`, `GET /enquiries/:id`, `PATCH /enquiries/:id`, `POST /enquiries/:id/followups`. Staff patch status and follow-up remarks. Admin can create, assign and archive enquiries. |
| Admin | CRUD `/visit-requests` |
| Admin and Staff | `GET /residents` and `GET /residents/:id`. Staff receive approved resident records and limited profile fields. |
| Admin | `POST /residents`, `PATCH /residents/:id`, `DELETE /residents/:id`, `POST /residents/:id/discharge`, `GET /residents/:id/history`, `POST /residents/:id/contacts`, `PATCH /residents/:id/contacts/:contactId`, `DELETE /residents/:id/contacts/:contactId`, `PUT /residents/:id/care` |
| Admin and Staff | CRUD `/accommodation-categories`, `/buildings`, `/rooms`, `/dormitories`, `/beds`, `/reservations` |
| Admin and Staff | `GET /accommodation-categories/:id/dependencies` and `POST /accommodation-categories/:id/reassign` |
| Admin and Staff | `GET` and `PATCH` on `/accommodation-categories/:id/availability` and `/dormitories/:id/availability` |
| Admin and Staff | `POST /reservations/:id/confirm`, `POST /reservations/:id/cancel`, `POST /reservations/:id/expire`, `POST /reservations/:id/convert` |
| Admin and Staff | `GET /allocations`, `POST /allocations`, `GET /allocations/:id`, `PATCH /allocations/:id`, `GET /allocations/history`, `POST /allocations/:id/transfer`, `POST /allocations/:id/release` |
| Admin and Staff | `GET /dashboard/summary`. Staff receive occupancy totals and approved resident totals. Admin also receives account counts. |
| Admin | `GET /audit-logs` |

Paginated responses contain `data`, `page`, `limit`, `total`, `totalPages`, `hasNext` and `hasPrevious`. Each resource whitelists its sort and filter fields. Rooms, dormitories and beds accept a `floor` filter, including `unconfigured` on dormitories and beds. `GET /allocations/history` accepts `roomId` or `bedId` for unit history. Dashboard room and bed counts come from the same availability views as the public catalogue. Errors return `{ statusCode, message }`. Requests that conflict with availability return `409`.

The scoped availability read returns consistent current totals and the individual rooms or beds under that scope. A patch accepts a `changes` array with each selected unit's `id`, `expected_status`, and target `status` of `ACTIVE`, `MAINTENANCE`, `INACTIVE`, or `ARCHIVE`. The API applies the batch and its per-unit audit records in one housing transaction. It rejects active allocations, open reservations, stale statuses, and units outside the selected scope. Archive retains the inventory record and history. Use the existing creation and booking routes to add units or change occupied and reserved counts. Availability has no independently writable aggregate fields.

Category dependency checks list unarchived rooms and dormitories, their current allocation and open reservation counts, and active destination categories of the same type. Reassignment accepts `destination_category_id` and `inventory_ids`. It moves the selected records together and rejects the entire operation if any selected record is booked or no longer belongs to the source. Reassignment leaves unit capacity and booking references intact.

Category archive is a soft delete. Any unarchived inventory blocks it, including inactive and maintenance units. Deactivation keeps inventory linked, removes the category from public availability, and requires the associated inventory to have no active allocations or open reservations. The category can be reactivated from its edit form. Audit and allocation history retain their recorded targets.

Public intake accepts `category_id`, `source_form`, `original_topic`, contact fields and optional nested `details` and `visit`. Source codes are `WELCOME_ENQUIRY`, `ROOM_APPLICATION`, `HARMONY_SUITE_APPLICATION`, `FACILITIES_ENQUIRY`, `ADMISSION_ENQUIRY`, `CAMPUS_WALKTHROUGH`, `CONTACT_ENQUIRY`, `HOME_CHILDREN_SUPPORT`, and `DORMITORY_ENQUIRY`. Admission, contact, and Home children’s support forms require consent. Walkthrough and contact forms require a preferred visit date. The response contains the enquiry receipt. The children’s support source requires the active Differently-Abled Support Living category, an email address, accommodation requirements, and a message. It accepts optional child name, age in years and practical support requirements via `child_support`. The request uses the existing enquiry and detail tables. Public availability returns category and dormitory presentation, floor summaries, total units, vacant room counts, remaining shared-room places and available beds. Dormitory enquiries use `DORMITORY_ENQUIRY` and the selected accommodation category ID. Neither the public availability payload nor an enquiry receipt includes private allocation details. Public enquiries do not reserve accommodation. Phase 6 can map the existing labels “Differently-Abled Supported Living” and “Facilities Enquiry” to the canonical “Differently-Abled Support Living” and “Facilities” category IDs.

## Staff module access

Apply the Staff module migration to grant existing accounts `enquiries.manage` and `residents.manage`. The authenticated `GET /enquiries/assignees` endpoint returns eligible account IDs and display names. Both roles share the existing enquiry, category, visit, resident, contact and care routes. Staff account, role, permission and system audit routes retain Admin access. See the [permission matrix](AUTHENTICATION.md#permissions).

## Implementation files

- `src/database/database.module.ts` manages the pool and transactions. `src/database/seed.ts` seeds reference and sample data.
- `src/auth/` contains the permission guard, JWT sessions, password management, rate limiting, and recovery mail. `src/common/api.ts` and `src/common/dtos.ts` hold shared responses, validation, paging, and audit utilities.
- `src/administration/administration.module.ts` contains staff, roles, permissions, dashboard and audit controllers.
- `src/enquiries/enquiries.module.ts` contains enquiry, category, visit, public intake and public availability routes.
- `src/residents/residents.module.ts` contains resident, contact, care and discharge routes.
- `src/housing/housing.controller.ts` and `src/housing/housing.service.ts` contain inventory, booking, release, transfer, and allocation history operations.
- `src/main.ts`, `src/app.module.ts`, and `src/health/health.controller.ts` wire the application, Swagger, and readiness checks.

## Request limits and reporting

NestJS uses one PostgreSQL pool with at most ten connections per process, a three-second connection deadline, and an eight-second PostgreSQL statement deadline. The Next.js bridge limits upstream operations to twelve seconds. Browser calls have a separate fifteen-second deadline. Review query plans and pool saturation on representative data before changing these limits.

Dashboard queries aggregate availability and role-appropriate operational counts in one statement. The public endpoint groups dormitory presentation once per category. Private requests still verify the database-backed session and permission grants.

## Phase boundary

The Next.js portal uses these REST contracts and the Phase 7 authentication endpoints. Reservation expiry finalization is available through the expiry action. The public submission rate limiter operates per backend process.

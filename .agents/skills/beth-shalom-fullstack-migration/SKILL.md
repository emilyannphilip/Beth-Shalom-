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

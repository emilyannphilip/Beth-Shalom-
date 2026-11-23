# Beth Shalom full-stack project

## Local development

Use Node.js 22.22.3+ on the 22.x line or Node.js 24.14+ on the 24.x line. Run commands from this directory. The npm workspaces share one lockfile.

```powershell
npm ci
npm run dev:frontend
```

In a second terminal:

```powershell
npm run dev:backend
```

- Frontend: `http://127.0.0.1:3000`
- NestJS REST API: `http://127.0.0.1:3001/api/v1/health`
- Same-origin API through Next.js: `http://127.0.0.1:3000/api/v1/health`

The defaults work without local environment files. To customize them, copy `frontend/.env.example` to `frontend/.env.local` and `backend/.env.example` to `backend/.env`. Update `API_ORIGIN` if the backend host or port changes. Next.js uses that setting when loading its rewrite configuration, including during production builds.

## PostgreSQL and migrations

The optional Compose service binds its development database to `127.0.0.1:5433`. Set `DATABASE_URL` in `backend/.env` to the matching example value or the connection URL of your own local PostgreSQL database. Both applications can start without PostgreSQL during Phase 2.

```powershell
docker compose -f database/compose.yaml up -d
npm run db:migrate -- --help
```

The migration directory is `database/migrations/`. Use `npm run db:migrate -- create descriptive-name` to generate a SQL migration when schema work is approved, and `npm run db:migrate -- up` to apply reviewed migrations to the configured database. The repository currently contains no application migrations.

## Verification

```powershell
npm run typecheck
npm run lint
npm run build
```

Next.js builds in `frontend/.next/` and NestJS builds in `backend/dist/`. Production smoke runs can use `npm run start --workspace frontend` and `npm run start --workspace backend` after building.

The public and portal routes are placeholders for later migration phases. The original design sources are in `Beth Shalom/` and `Beth Shalom Portal/`.

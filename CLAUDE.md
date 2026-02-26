# Project: nexusberry.com

## Tech Stack
- **Framework:** Next.js + Payload CMS 3.76
- **Database:** PostgreSQL via Supabase (production DB used locally — no separate dev DB)
- **DB Adapter:** `@payloadcms/db-postgres` (uses Drizzle ORM internally)
- **Package manager:** pnpm
- **Hosting:** Vercel

## Important: Database
Local development connects to the **Supabase production database**. There is no separate dev/staging DB. Running migrations locally applies them to production. Be careful with destructive migrations (DROP TABLE, DROP COLUMN).

## Payload Collection Field Change Workflow

**MANDATORY** — After ANY change to Payload collection fields, run these steps in order:

1. **Generate Payload types**
   ```bash
   pnpm generate:types
   ```
2. **Verify TypeScript** (no emit)
   ```bash
   pnpm tsc --noEmit
   ```
3. **Verify linting**
   ```bash
   pnpm lint
   ```
4. **Build check**
   ```bash
   pnpm build
   ```
5. **Create migration** (for Postgres schema changes)
   ```bash
   pnpm payload migrate:create
   ```
6. **Run migration**
   ```bash
   pnpm payload migrate
   ```
7. **Then suggest commit and push**

Never skip steps. Fix any errors before proceeding to the next step.

## Key Commands
- `pnpm generate:types` — Regenerate `payload-types.ts`
- `pnpm payload migrate:create` — Create a new migration
- `pnpm payload migrate` — Run pending migrations
- `pnpm build` — Production build
- `pnpm lint` — ESLint check

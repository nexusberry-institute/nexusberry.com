# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NexusBerry Training & Solutions is a full-stack education management platform built with Next.js 15 (App Router), PayloadCMS 3.68.3, and PostgreSQL. It combines a headless CMS with student/course management, LMS, event management, and marketing automation.

**Tech Stack:**
- Next.js 15.4.11 with React 19 (App Router)
- PayloadCMS 3.76.1 (Headless CMS)
- PostgreSQL via Supabase (@payloadcms/db-postgres)
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- pnpm 10.13.1

## Common Commands

### Development
```bash
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server
pnpm dev:prod         # Clean build + start production locally
```

### Code Quality
```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix ESLint issues
```

### PayloadCMS
```bash
pnpm payload          # PayloadCMS CLI
pnpm generate:types   # Generate TypeScript types from collections
pnpm generate:importmap # Generate import map
```

### Database Migrations
```bash
pnpm migrate:create   # Create new migration
pnpm migrate:status   # Check migration status
pnpm migrate:run      # Run pending migrations (alias: payload migrate)
pnpm migrate:rollback # Rollback last migration
```

### CI/CD
```bash
pnpm ci               # Run migrations + build (for deployment)
```

### Testing & Utilities
```bash
pnpm test:email       # Test email configuration
pnpm test:env         # Test environment variables
```

### Package Management
```bash
pnpm ii               # Install with --ignore-workspace
pnpm reinstall        # Clean reinstall (removes node_modules + lockfile)
```

## Architecture

### next.config.js:
  - Integrates PayloadCMS with Next.js via withPayload()
  - Optimizes production (removes console logs)
  - Enables image optimization for remote URLs
  - Custom webpack config for TypeScript support
  - Lenient build process (ignores ESLint errors)

### Next.js App Router Structure

The app follows a grouped route structure:

```
src/app/
├── (frontend)/              # Public-facing routes
│   ├── (auth)/             # Auth pages: login, register, forgot-password, verify-otp
│   ├── (website)/          # Main website
│   │   ├── [slug]/         # Dynamic pages
│   │   ├── blog/           # Blog posts
│   │   ├── course/         # Course pages
│   │   ├── departments/    # Department pages
│   │   ├── events/         # Events with live-stream support
│   │   ├── forms/          # Dynamic forms
│   │   ├── tutorials/       # Tutorials by subject
│   │   └── verify-certificate/
│   └── lms/                # Learning Management System
│       ├── videos/         # Video lectures
│       └── quiz/           # Quiz system
└── (payload)/              # PayloadCMS admin
    └── admin/              # Admin panel (/admin)
```

**Important:** Google Tag Manager is injected in `src/app/(frontend)/(website)/layout.tsx` for all public pages.

### PayloadCMS Configuration

**Location:** `src/payload.config.ts`

**Key Concepts:**
- Single source of truth for PayloadCMS behavior
- Defines admin panel, database, collections, security, uploads
- Auto-creates superadmin on first run
- TypeScript types auto-generated from this config
- Email currently disabled but configured

**Key Notes:**
1. **Collections (40+):** Data models defined in `src/collections/`. See `src/collections/index.ts` for full list.
2. **Globals:** Site-wide settings in `src/globals/`
3. **Blocks:** Reusable content blocks in `src/blocks/` (Banner, CTA, Content, Media, Code, etc.)
4. **Plugins:** Configured in `src/plugins/index.ts`
   - `redirectsPlugin`: SEO redirects (301/302) for pages/posts/departments/web-courses
   - `nestedDocsPlugin`: Hierarchical categories
   - `seoPlugin`: Meta tags, Open Graph, JSON-LD, keywords, canonical
   - `formBuilderPlugin`: Dynamic form builder with submissions
   - `searchPlugin`: Full-text search on posts
   - `uploadthingStorage`: UploadThing CDN file storage (replaces S3)

### Access Control System

**Location:** `src/access/`

**Roles (in priority order):**
- `superadmin` - Full access
- `admin` - High-level access
- `developer` - Technical access
- `writer` - Content creation
- `eventmgr` - Event management

**Key Functions:**
- `checkRole(roles[], user)`: Check if user has any of the specified roles (src/access/checkRole.ts)
- Access helpers: `superAdmin`, `admin`, `developer`, `writer`, `eventmgr`, `authenticated`, `authenticatedOrPublished`, `anyone`, `self`
- Use `accessControl` from `src/access/accessControl.ts` for field/collection-level permissions

**Pattern:** Collections typically use role-based access control. Check existing collections for examples.

### Hooks System

**Location:** `src/hooks/`

**Important Hooks:**
- `formatSlug`: Auto-generates URL-friendly slugs from titles
- `populatePublishedAt`: Auto-sets publish date if not provided
- `protectRoles`: Prevents role escalation/modification
- `checkAndCreateUser`: Auto-creates user accounts (used in student/teacher flows)
- `revalidateRedirects`: Revalidates Next.js cache when redirects change
- `createAttendanceDetails`: Auto-generates attendance detail records

**Usage:** Hooks are attached to collections via `beforeChange`, `afterChange`, `beforeValidate`, etc.

### Collections Organization

**40+ Collections in `src/collections/`:**

**Academic Content:**
- TrainingCourses, WebCourses, Quizzes, QuizQuestions

**People Management:**
- Users, Students, Teachers, Staffs, Employees, Instructors

**Operations:**
- Batches, Enrollments, FeeReceipts, PaymentPlans, DiscountCodes
- TimeTable, ClassRecords, Attendances, AttendanceDetails

**Marketing & Outreach:**
- Leads, Campaigns, Events, EventFeedbacks, ContactMessages, Inquiries

**Content:**
- Posts, Pages, Categories, Media, Departments

**System:**
- Messages, SOPs, CoursesCollection, PlatformRedirects

**Pattern:** Most collections include:
- `slug` field with `formatSlug` hook
- Role-based access control
- SEO fields (for public-facing content)
- Timestamps (createdAt, updatedAt)

### Environment Configuration

**File:** `.env` (see `.env.example` for template)

**Critical Variables:**
- `DATABASE_URI`: PostgreSQL connection string (Supabase)
- `PAYLOAD_SECRET`: PayloadCMS secret key
- `NEXT_PUBLIC_SERVER_URL`: Public URL (http://localhost:3000 in dev)
- `UPLOADTHING_TOKEN`: Auth token from UploadThing dashboard
- `UPLOADTHING_APP_ID`: App identifier for UploadThing

**Marketing Integration:**
- `NEXT_PUBLIC_GTM_ID`: Google Tag Manager
- `FACEBOOK_PIXEL_ID`, `FACEBOOK_ACCESS_TOKEN`: Facebook Conversions API
- `GA4_MEASUREMENT_ID`, `GA4_API_SECRET`: Google Analytics 4
- `META_*`: Meta Lead Forms integration

**Legacy (Migration):**
- `NEXT_PUBLIC_API_KEY`: Old Strapi API for leads
- `NEXT_PUBLIC_ACCOUNT_API_KEY`: Old Strapi API for accounts/operations
- `CLOUDINARY_*`: Old media storage (still referenced for migration)
- `BUNNY_*`: Video hosting (Bunny CDN)

**Email (currently disabled in config):**
- `SMTP_*`: Email configuration via Nodemailer

### Storage Architecture

**Current:** UploadThing CDN storage
- Configuration in `src/plugins/index.ts` (uploadthingStorage plugin)
- `clientUploads: true` for direct browser-to-cloud uploads (essential for Vercel's 4.5MB serverless limit)
- URL generation handled via `afterRead` hook in `src/collections/Media.ts` (workaround for clientUploads key issue)

**Legacy:** Cloudinary (nexusberry.it account) - still has historical content

**Video:** Bunny CDN for video lectures (library ID: 348450)

### SEO & Marketing Funnel

**Funnel Flow (from README.md):**
- Meta: PageView → Lead → EventAttended → Admission (Purchase)
- GA4: page_view → form_submitted → event_attended → admission

**SEO Plugin Configuration:**
- Auto-generates title: `{doc.title} | NexusBerry`
- Default description: "Best Selling Course at NexusBerry Training & Solutions"
- Custom fields: keywords, jsonld, canonical, ogTitle, ogDescription
- Open Graph images must be minimum 200x200px

**Important:** Instructor profile pictures must be background-free with aspect ratio 128:150.

### Form Builder Pattern

**Plugin:** `@payloadcms/plugin-form-builder` (configured in src/plugins/index.ts)

**Collections Created:**
- `forms` (slug: 'forms', label: 'Form Designs') - Form templates
- `form-submissions` - Submitted data

**Features:**
- Dynamic field types: text, textarea, email, checkbox, number, select, country, state, date, fileUpload
- Auto-generates slug from title
- Custom fields: status (Close Done/Close Rejected/Pending), staffNotes
- Redirect relationships to pages
- Email notifications to admin@nexusberry.com

**Admin Group:** "All Forms"

### Live Preview

Configured with responsive breakpoints:
- Mobile: 375x667
- Tablet: 768x1024
- Desktop: 1440x900

### TypeScript

**Generated Types:** `src/payload-types.ts` (auto-generated, don't edit manually)

**Regenerate:** Run `pnpm generate:types` after collection changes

**Import:** `import type { User, Post, Event } from '@/payload-types'`

### Important Patterns

1. **Slug Generation:** Use `...slugField()` from `@/fields/slug` (returns `[TextField, CheckboxField]` tuple, spread into fields array). Includes auto-generate from title + lock/unlock UI in sidebar.
2. **Role Protection:** Use `protectRoles` hook to prevent unauthorized role changes
3. **Published Date:** Use `populatePublishedAt` for content that needs publish dates
4. **Access Control:** Always define read/create/update/delete access based on roles
5. **Admin Grouping:** Use `admin.group` to organize collections in sidebar (e.g., "People Management", "All Forms", "Classwork")

## Development Notes

### Node & pnpm Requirements
- Node: ^18.20.2 || >=20.9.0
- pnpm: ^9 || ^10 (locked to 10.13.1)

### Build Configuration
- Console logs are removed in production builds (`next.config.js`)
- ESLint is ignored during builds
- NODE_OPTIONS=--no-deprecation is set for all commands

### Database Pooling
PayloadCMS uses PostgreSQL connection pooling. Default settings are commented out but can be adjusted for Supabase tier limits:
```typescript
pool: {
  connectionString: process.env.DATABASE_URI,
  // max: 8,  // Supabase nano tier has 15 connections
  // min: 2,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
}
```

### Migration Workflow (Migrations-Only)

**IMPORTANT:** `push: false` is set in `payload.config.ts`. The dev server will NOT auto-push schema changes. All schema changes must go through migrations.

**Baseline migration:** `src/migrations/20260223_083127.ts` (no-op) + `.json` snapshot. All future migrations diff against this snapshot.

```bash
# 1. Edit collection files in src/collections/

# 2. Regenerate TypeScript types
pnpm generate:types

# 3. Create migration (diffs collection changes against .json snapshot — does NOT touch the DB)
pnpm migrate:create --name descriptive_name

# 4. Review the generated .ts file in src/migrations/ — verify the SQL

# 5. Apply migration to production DB
pnpm migrate:run

# 6. Check status
pnpm migrate:status

# 7. Commit everything: collection changes + types + migration files
git add src/collections/ src/payload-types.ts src/migrations/
git commit -m "Add migration for [description]"

# 8. Push — Vercel deploys automatically
git push
```

**Rollback if needed:** `pnpm migrate:rollback`

### Debugging
- Email: `pnpm test:email`
- Environment: `pnpm test:env`
- Scripts located in `scripts/` directory

## Deployment & Environment

### Current Setup

| Context | Database | File Storage | Env File |
|---------|----------|--------------|----------|
| **Local Dev** | Supabase PostgreSQL (production) | `public/media/` (local) | `.env.local` |
| **Vercel Deploy** | Supabase PostgreSQL (production) | UploadThing CDN | Vercel env vars |

**Local dev uses the production database directly.** Both `pnpm dev` and `pnpm migrate:run` hit the same Supabase DB. Be careful with destructive migrations.

**Vercel build command:** `pnpm ci` (runs `payload migrate && pnpm build`). Set as override in Vercel project settings.

### How Deployment Works

1. Push to `main` triggers Vercel build
2. Vercel runs `pnpm ci` → `payload migrate` checks `payload_migrations` table
3. If migration was already applied locally via `pnpm migrate:run`, Vercel skips it
4. If migration is pending (you didn't run it locally), Vercel applies it during build
5. `pnpm build` runs after migrations complete

### Key Environment Variable: PAYLOAD_LOCAL_STORAGE

```env
# .env.local (local development)
PAYLOAD_LOCAL_STORAGE=true   # Uses public/media/ for uploads

# Vercel (production)
PAYLOAD_LOCAL_STORAGE=false  # Uses UploadThing CDN storage
```

The S3 storage plugin is conditionally loaded in `src/plugins/index.ts` based on this variable.

### Local Development Setup

```bash
# Start dev server (connects to production Supabase DB via .env.local)
pnpm dev

# Access: http://localhost:3000/admin
# First run creates superadmin: admin@nexusberry.com / 12345678
```

### Docker Commands (Optional — for isolated local DB)

If you want a separate local database instead of using production directly:

```bash
pnpm docker:up      # Start local PostgreSQL container
pnpm docker:down    # Stop container (data persists)
pnpm docker:reset   # Wipe database and restart (destructive!)
pnpm dev:setup      # Start Docker + dev server in one command
```

To use Docker DB, update `DATABASE_URI` in `.env.local` to `postgresql://nexusberry:nexusberry@localhost:5432/nexusberry`.

### File Structure for Environments

```
├── .env                    # Production config (Supabase DB + UploadThing) - gitignored
├── .env.local              # Local dev config (production DB + local uploads) - gitignored
├── .env.example            # Template for new developers - committed
├── docker-compose.yml      # Optional local PostgreSQL container
├── src/migrations/         # Migration files (committed to version control)
│   ├── 20260223_083127.ts  # Baseline migration (no-op)
│   ├── 20260223_083127.json # Drizzle schema snapshot (DO NOT EDIT)
│   └── index.ts            # Auto-generated migration registry
├── public/media/           # Local uploads directory - gitignored
│   └── .gitkeep
└── DEVELOPMENT.md          # Detailed workflow documentation
```

### Conditional Storage Configuration

In `src/plugins/index.ts`, the `getPlugins()` function conditionally includes UploadThing:

```typescript
// UploadThing storage only added when PAYLOAD_LOCAL_STORAGE !== 'true'
if (process.env.PAYLOAD_LOCAL_STORAGE !== 'true') {
  basePlugins.push(uploadthingStorage({...}))
}
```

When `PAYLOAD_LOCAL_STORAGE=true`, PayloadCMS uses the `staticDir` from `Media.ts` (`public/media/`).

### Important Notes

1. **`push: false` is enforced:** All schema changes require migrations. The dev server will not auto-apply changes.
2. **Local dev hits production DB:** Be careful with `pnpm migrate:run` — it modifies the live database.
3. **Review migrations before running:** Always check the generated SQL in `src/migrations/` before applying.
4. **Never edit `.json` snapshot files:** Drizzle uses these to diff future migrations. Only edit the `.ts` files if needed.
5. **Vercel runs migrations on deploy:** The `pnpm ci` build command handles this automatically.
6. **Local uploads are gitignored:** `public/media/*` is in `.gitignore`

### Gotchas & Lessons Learned

**Vercel build command must be `pnpm run ci`, not `pnpm ci`:**
pnpm interprets `pnpm ci` as its own built-in command (which doesn't exist), not the `ci` script in package.json. Always use `pnpm run ci` to explicitly run the script.

**Never use dynamic values as `defaultValue` directly — use a function:**
```typescript
// BAD — evaluated once at import time, bakes a static value into the DB schema
defaultValue: new Date()
defaultValue: generateCode()

// GOOD — called fresh per document creation, no DB-level default
defaultValue: () => new Date()
defaultValue: () => generateCode()
```
Static `defaultValue` causes `migrate:create` to generate noise migrations every time (changing the frozen timestamp/code). Function defaults are handled by Payload at runtime, not at the DB schema level.

**Baseline migration must be a no-op when DB already has the schema:**
When switching from `push` mode to migrations, the generated baseline will contain CREATE TABLE statements for all tables. Replace `up()` and `down()` with empty functions — the `.json` snapshot is the critical piece that Drizzle diffs against. Running the generated SQL would fail since tables already exist.

**Watch for column name mismatches after refactoring collection field grouping:**
If a collection previously had fields inside a `tabs` or `group` with a name (e.g., `basicInfo`), Payload prefixes DB columns (e.g., `basic_info_title`). Removing the named group changes the expected column to `title`, but the DB still has `basic_info_title`. The Drizzle snapshot captures the *current* collection definition, not the actual DB state. A manual migration is needed to rename or recreate the table.

**`batch = -1` in `payload_migrations` means dev push was used:**
This row causes an interactive confirmation prompt during `payload migrate`. On Vercel (non-interactive), this hangs the build. Fix by deleting the row from Supabase SQL editor: `DELETE FROM payload_migrations WHERE batch = -1;`

**`DROP TABLE ... CASCADE` only drops foreign key constraints, not dependent tables:**
When dropping a parent table with CASCADE, child tables that reference it via foreign keys are NOT dropped — only the FK constraints are removed. Always explicitly drop child tables (`_texts`, `_rels`) if they need to be recreated.

**Always use `DROP TABLE IF EXISTS` and `CREATE TABLE IF NOT EXISTS` in manual migrations:**
When writing migration SQL by hand (not auto-generated), use defensive SQL to handle partially-applied states from failed migration runs. Payload doesn't auto-rollback failed migrations.

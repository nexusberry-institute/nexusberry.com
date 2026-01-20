# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NexusBerry Training & Solutions is a full-stack education management platform built with Next.js 15 (App Router), PayloadCMS 3.68.3, and PostgreSQL. It combines a headless CMS with student/course management, LMS, event management, and marketing automation.

**Tech Stack:**
- Next.js 15.4.9 with React 19 (App Router)
- PayloadCMS 3.68.3 (Headless CMS)
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
1. **Collections (43+):** Data models defined in `src/collections/`. See `src/collections/index.ts` for full list.
2. **Globals:** Site-wide settings in `src/globals/`
3. **Blocks:** Reusable content blocks in `src/blocks/` (Banner, CTA, Content, Media, Code, etc.)
4. **Plugins:** Configured in `src/plugins/index.ts`
   - `redirectsPlugin`: SEO redirects (301/302) for pages/posts/departments/web-courses
   - `nestedDocsPlugin`: Hierarchical categories
   - `seoPlugin`: Meta tags, Open Graph, JSON-LD, keywords, canonical
   - `formBuilderPlugin`: Dynamic form builder with submissions
   - `searchPlugin`: Full-text search on posts
   - `s3Storage`: Supabase storage integration (endpoint in .env)

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

**43+ Collections in `src/collections/`:**

**Academic Content:**
- TrainingCourses, WebCourses, Modules, ModuleTopics, Lectures, Videos
- Coursework, Assignments, Quizzes, QuizQuestions

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
- `S3_*`: Supabase storage credentials (endpoint, keys, bucket, region)

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

**Current:** Supabase S3-compatible storage
- Configuration in `src/plugins/index.ts` (s3Storage plugin)
- Media uploads go to S3_BUCKET with 'media' prefix
- 5MB file size limit (configured in payload.config.ts)

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

1. **Slug Generation:** Use `formatSlug` hook on beforeValidate for any collection with URLs
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

### Migration Workflow
1. Make collection/schema changes
2. Run `pnpm migrate:create` to generate migration
3. Review generated migration file
4. Run `pnpm migrate:run` to apply
5. Commit migration files to version control

### Debugging
- Email: `pnpm test:email`
- Environment: `pnpm test:env`
- Scripts located in `scripts/` directory

## Local Development Workflow

### Dual Environment Architecture

The project uses two separate environments:

| Environment | Database | File Storage | Config File |
|-------------|----------|--------------|-------------|
| **Local Dev** | Docker PostgreSQL (localhost:5432) | `public/media/` (local) | `.env.local` |
| **Production** | Supabase PostgreSQL | Supabase S3 | `.env` |

**How it works:** Next.js automatically loads `.env.local` with higher priority than `.env`. When running `pnpm dev`, local config is used. In CI/CD (where `.env.local` doesn't exist), production `.env` is used.

### Key Environment Variable: PAYLOAD_LOCAL_STORAGE

```env
# .env.local (local development)
PAYLOAD_LOCAL_STORAGE=true   # Uses public/media/ for uploads

# .env (production)
PAYLOAD_LOCAL_STORAGE=false  # Uses Supabase S3 storage
```

The S3 storage plugin is conditionally loaded in `src/plugins/index.ts` based on this variable.

### Docker Commands

```bash
pnpm docker:up      # Start local PostgreSQL container
pnpm docker:down    # Stop container (data persists)
pnpm docker:reset   # Wipe database and restart (destructive!)
pnpm dev:setup      # Start Docker + dev server in one command
```

### Local Development Setup

```bash
# 1. Start Docker PostgreSQL
pnpm docker:up

# 2. Start dev server (uses .env.local automatically)
pnpm dev

# Access: http://localhost:3000/admin
# First run creates superadmin: admin@nexusberry.com / 12345678
```

### Migration Workflow (Local → Production)

**IMPORTANT:** Always create and test migrations locally before deploying.

```bash
# 1. Make collection changes in src/collections/

# 2. Generate migration (uses local Docker PostgreSQL)
pnpm migrate:create

# 3. Test migration locally
pnpm migrate:run

# 4. Check status
pnpm migrate:status

# 5. If issues, rollback
pnpm migrate:rollback

# 6. Commit migration files
git add src/migrations/
git commit -m "Add migration for [description]"
```

**Why Docker PostgreSQL:** Both local and production use PostgreSQL, so migrations are compatible. This avoids SQL dialect issues that would occur with SQLite.

### Production Build Testing

To test production build locally (uses production `.env`):

```bash
# Temporarily disable local config
mv .env.local .env.local.bak

# Run production build
pnpm build

# Restore local config
mv .env.local.bak .env.local
```

### File Structure for Environments

```
├── .env                    # Production config (Supabase DB + S3) - gitignored
├── .env.local              # Local dev config (Docker + local uploads) - gitignored
├── .env.example            # Template for new developers - committed
├── docker-compose.yml      # Local PostgreSQL container
├── public/media/           # Local uploads directory - gitignored
│   └── .gitkeep
└── DEVELOPMENT.md          # Detailed workflow documentation
```

### Conditional Storage Configuration

In `src/plugins/index.ts`, the `getPlugins()` function conditionally includes S3:

```typescript
// S3 storage only added when PAYLOAD_LOCAL_STORAGE !== 'true'
if (process.env.PAYLOAD_LOCAL_STORAGE !== 'true') {
  basePlugins.push(s3Storage({...}))
}
```

When `PAYLOAD_LOCAL_STORAGE=true`, PayloadCMS uses the `staticDir` from `Media.ts` (`public/media/`).

### Important Notes for Development

1. **Always start Docker first:** Run `pnpm docker:up` before `pnpm dev`
2. **Migrations use local DB:** `pnpm migrate:create` generates PostgreSQL-compatible migrations
3. **Build requires production DB or no .env.local:** The build process connects to the database
4. **Local uploads are gitignored:** `public/media/*` is in `.gitignore`
5. **CI/CD runs migrations:** The `pnpm ci` command runs `payload migrate && pnpm build`

# Development Workflow Guide

This document explains the local development and production deployment workflow for the NexusBerry project.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│              LOCAL DEVELOPMENT (.env.local)                 │
├─────────────────────────────────────────────────────────────┤
│  Next.js Dev Server (pnpm dev)                              │
│       │                                                     │
│       ├──► Docker PostgreSQL (localhost:5432)               │
│       │    └── nexusberry database                          │
│       │                                                     │
│       └──► Local Uploads (public/media/)                    │
│            └── Served by Next.js static files               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PRODUCTION (.env)                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js Production (Vercel/Server)                         │
│       │                                                     │
│       ├──► Supabase PostgreSQL                              │
│       │    └── aws-0-ap-south-1.pooler.supabase.com         │
│       │                                                     │
│       └──► Supabase S3 Storage                              │
│            └── payload-upload bucket                        │
└─────────────────────────────────────────────────────────────┘
```

## Environment Files

| File | Purpose | Git Status |
|------|---------|------------|
| `.env` | Production configuration (Supabase DB + S3) | Ignored |
| `.env.local` | Local development (Docker PostgreSQL + local uploads) | Ignored |
| `.env.example` | Template for new developers | Committed |

**How it works:** Next.js automatically loads `.env.local` with higher priority than `.env`. So when you run `pnpm dev`, it uses local config. In CI/CD (where `.env.local` doesn't exist), it uses production `.env`.

---

## Initial Setup (One-time)

### Prerequisites

1. **Docker Desktop** - Install from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Node.js** - Version 18.20.2+ or 20.9.0+
3. **pnpm** - Version 9 or 10

### Setup Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd nexusberry.com

# 2. Install dependencies
pnpm install

# 3. Create your local environment file (if not exists)
# Copy from .env.local.example or create with these contents:
cat > .env.local << 'EOF'
# Local Development Configuration
DATABASE_URI=postgresql://nexusberry:nexusberry@localhost:5432/nexusberry
PAYLOAD_SECRET=local-dev-secret-change-me-12345
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_LOCAL_STORAGE=true
EOF

# 4. Start Docker PostgreSQL
pnpm docker:up

# 5. Verify Docker is running
docker ps
# Should show: nexusberry-db container

# 6. Start development server
pnpm dev

# 7. Access the admin panel
# Open http://localhost:3000/admin
# First run auto-creates superadmin: admin@nexusberry.com / 12345678
```

---

## Daily Development

### Start Your Day

```bash
# 1. Make sure Docker is running
pnpm docker:up

# 2. Start development server
pnpm dev

# Or use the combined command:
pnpm dev:setup
```

### Development URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Main website |
| http://localhost:3000/admin | PayloadCMS Admin Panel |

### File Uploads

- **Local dev:** Files are saved to `public/media/` (gitignored)
- **Production:** Files are uploaded to Supabase S3 storage

### Stop Development

```bash
# Stop the dev server with Ctrl+C

# Optionally stop Docker (data persists)
pnpm docker:down
```

---

## Creating and Testing Migrations

### When to Create Migrations

Create a migration when you:
- Add/modify/delete a collection
- Change field types or validation
- Add/remove indexes
- Modify relationships between collections

### Migration Workflow

```bash
# 1. Make your collection changes in src/collections/

# 2. Generate a migration (uses local PostgreSQL)
pnpm migrate:create

# 3. Review the generated migration file
# Located in: src/migrations/

# 4. Test the migration locally
pnpm migrate:run

# 5. Check migration status
pnpm migrate:status

# 6. If something went wrong, rollback
pnpm migrate:rollback

# 7. Commit the migration file to git
git add src/migrations/
git commit -m "Add migration for [description]"
```

### Migration Best Practices

1. **Always test locally first** - Run migrations on your local Docker database before pushing
2. **One change per migration** - Keep migrations focused and atomic
3. **Review generated SQL** - Check the migration file before running
4. **Never edit applied migrations** - Create new migrations for fixes
5. **Commit migration files** - They should be version controlled

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All migrations tested locally
- [ ] Migration files committed to git
- [ ] Code changes tested with production build
- [ ] No console errors in browser

### Testing Production Build Locally

```bash
# 1. Temporarily disable local config
mv .env.local .env.local.bak

# 2. Run production build
pnpm build

# 3. Restore local config
mv .env.local.bak .env.local
```

### Deployment Process

The CI/CD pipeline runs:
```bash
pnpm ci  # Runs: payload migrate && pnpm build
```

This ensures:
1. Pending migrations are applied to production database
2. Production build is created

### Manual Production Migration (if needed)

```bash
# Connect to production and run migrations
# (Only if CI/CD migration fails)
# Make sure .env has production DATABASE_URI

mv .env.local .env.local.bak
pnpm migrate:run
mv .env.local.bak .env.local
```

---

## Reset Local Database

### Soft Reset (Keep Docker Volume)

```bash
# Stop and restart containers
pnpm docker:down
pnpm docker:up
```

### Hard Reset (Wipe All Data)

```bash
# This deletes all local database data!
pnpm docker:reset

# Then restart dev server
pnpm dev
# Superadmin will be auto-created again
```

### Reset Just the Database (Keep Container)

```bash
# Connect to PostgreSQL and drop/recreate
docker exec -it nexusberry-db psql -U nexusberry -c "DROP DATABASE nexusberry;"
docker exec -it nexusberry-db psql -U nexusberry -c "CREATE DATABASE nexusberry;"

# Restart dev server to run migrations
pnpm dev
```

---

## Useful Commands Reference

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm dev:setup` | Start Docker + dev server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix ESLint issues |

### Docker

| Command | Description |
|---------|-------------|
| `pnpm docker:up` | Start PostgreSQL container |
| `pnpm docker:down` | Stop PostgreSQL container |
| `pnpm docker:reset` | Wipe database and restart |

### Database & Migrations

| Command | Description |
|---------|-------------|
| `pnpm migrate:create` | Generate new migration |
| `pnpm migrate:status` | Check pending migrations |
| `pnpm migrate:run` | Apply pending migrations |
| `pnpm migrate:rollback` | Rollback last migration |

### PayloadCMS

| Command | Description |
|---------|-------------|
| `pnpm generate:types` | Regenerate TypeScript types |
| `pnpm generate:importmap` | Regenerate import map |
| `pnpm payload` | PayloadCMS CLI |

### Testing

| Command | Description |
|---------|-------------|
| `pnpm test:email` | Test email configuration |
| `pnpm test:env` | Test environment variables |

---

## Troubleshooting

### Docker Issues

**Container won't start:**
```bash
# Check if port 5432 is in use
netstat -an | findstr 5432  # Windows
lsof -i :5432               # Mac/Linux

# Kill conflicting process or change port in docker-compose.yml
```

**Can't connect to database:**
```bash
# Verify container is running
docker ps

# Check container logs
docker logs nexusberry-db

# Restart container
pnpm docker:down && pnpm docker:up
```

### Build Issues

**Build fails with database connection error:**
- This happens when `.env.local` is present but Docker isn't running
- Either start Docker (`pnpm docker:up`) or rename `.env.local`

**Out of memory during build:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=8192" pnpm build
```

### Migration Issues

**Migration fails locally:**
```bash
# Check migration status
pnpm migrate:status

# Rollback and try again
pnpm migrate:rollback
pnpm migrate:run
```

**Migration works locally but fails in production:**
- Ensure you're using PostgreSQL locally (not SQLite)
- Check for data-dependent migrations
- Review the migration SQL for PostgreSQL-specific syntax

---

## Environment Variables

### Required for Local Development (.env.local)

```env
DATABASE_URI=postgresql://nexusberry:nexusberry@localhost:5432/nexusberry
PAYLOAD_SECRET=local-dev-secret-change-me-12345
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_LOCAL_STORAGE=true
```

### Required for Production (.env)

```env
DATABASE_URI=postgresql://...@supabase.com:6543/postgres
PAYLOAD_SECRET=<production-secret>
NEXT_PUBLIC_SERVER_URL=https://www.nexusberry.com
PAYLOAD_LOCAL_STORAGE=false
S3_ENDPOINT=https://...supabase.co/storage/v1/s3
S3_ACCESS_KEY_ID=<key>
S3_SECRET_ACCESS_KEY=<secret>
S3_REGION=ap-south-1
S3_BUCKET=payload-upload
```

### Key Variable: PAYLOAD_LOCAL_STORAGE

| Value | Behavior |
|-------|----------|
| `true` | Uses local file storage (`public/media/`) |
| `false` | Uses Supabase S3 storage |

---

## File Structure

```
nexusberry.com/
├── .env                    # Production config (gitignored)
├── .env.local              # Local dev config (gitignored)
├── .env.example            # Template (committed)
├── docker-compose.yml      # Local PostgreSQL
├── public/
│   └── media/              # Local uploads (gitignored)
│       └── .gitkeep
├── src/
│   ├── collections/        # PayloadCMS collections
│   ├── migrations/         # Database migrations (committed)
│   ├── plugins/
│   │   └── index.ts        # Conditional S3 storage
│   └── payload.config.ts   # Main Payload config
└── DEVELOPMENT.md          # This file
```

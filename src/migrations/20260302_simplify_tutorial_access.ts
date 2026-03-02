import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Add new boolean columns
  await db.execute(sql`
    ALTER TABLE "tutorials"
      ADD COLUMN IF NOT EXISTS "is_public" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "requires_login" boolean DEFAULT false;
  `)

  // 2. Data migration: map old accessType values to new boolean flags
  // public -> isPublic = true, requiresLogin = false
  await db.execute(sql`
    UPDATE "tutorials"
    SET "is_public" = true, "requires_login" = false
    WHERE "access_type" = 'public';
  `)

  // protected -> isPublic = true, requiresLogin = true
  await db.execute(sql`
    UPDATE "tutorials"
    SET "is_public" = true, "requires_login" = true
    WHERE "access_type" = 'protected';
  `)

  // 3. Drop old column and enum
  await db.execute(sql`
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "access_type";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_tutorials_access_type";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Re-create enum and column
  await db.execute(sql`
    CREATE TYPE "enum_tutorials_access_type" AS ENUM('public', 'protected');
  `)

  await db.execute(sql`
    ALTER TABLE "tutorials"
      ADD COLUMN "access_type" "enum_tutorials_access_type" DEFAULT 'public';
  `)

  // Reverse data migration
  await db.execute(sql`
    UPDATE "tutorials"
    SET "access_type" = 'protected'
    WHERE "is_public" = true AND "requires_login" = true;
  `)

  await db.execute(sql`
    UPDATE "tutorials"
    SET "access_type" = 'public'
    WHERE "is_public" = true AND "requires_login" = false;
  `)

  // Drop new columns
  await db.execute(sql`
    ALTER TABLE "tutorials"
      DROP COLUMN IF EXISTS "is_public",
      DROP COLUMN IF EXISTS "requires_login";
  `)
}

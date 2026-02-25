import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // --- Users: drop is_active column ---
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "is_active";
  `)

  // --- Students: drop unused columns ---
  // Drop FK constraint + index for profile_picture_id first
  await db.execute(sql`
    ALTER TABLE "students" DROP CONSTRAINT IF EXISTS "students_profile_picture_id_media_id_fk";
    DROP INDEX IF EXISTS "students_profile_picture_idx";
  `)

  await db.execute(sql`
    ALTER TABLE "students" DROP COLUMN IF EXISTS "gmail_username";
    ALTER TABLE "students" DROP COLUMN IF EXISTS "profile_picture_id";
    ALTER TABLE "students" DROP COLUMN IF EXISTS "otp_verified";
    ALTER TABLE "students" DROP COLUMN IF EXISTS "otp";
    ALTER TABLE "students" DROP COLUMN IF EXISTS "otp_generated_at";
  `)

  // --- Students: rename address_state → address_province ---
  await db.execute(sql`
    ALTER TABLE "students" RENAME COLUMN "address_state" TO "address_province";
  `)

  // --- Students: add new columns ---
  await db.execute(sql`
    CREATE TYPE "enum_students_status" AS ENUM('active', 'on-hold', 'withdrawn', 'graduated');
  `)

  await db.execute(sql`
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "cnic" varchar;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "guardian_phone" varchar;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "admission_date" timestamp(3) with time zone;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "status" "enum_students_status" DEFAULT 'active';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // --- Students: drop new columns ---
  await db.execute(sql`
    ALTER TABLE "students" DROP COLUMN IF EXISTS "cnic";
    ALTER TABLE "students" DROP COLUMN IF EXISTS "guardian_phone";
    ALTER TABLE "students" DROP COLUMN IF EXISTS "admission_date";
    ALTER TABLE "students" DROP COLUMN IF EXISTS "status";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_students_status";
  `)

  // --- Students: rename address_province back → address_state ---
  await db.execute(sql`
    ALTER TABLE "students" RENAME COLUMN "address_province" TO "address_state";
  `)

  // --- Students: restore dropped columns ---
  await db.execute(sql`
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "gmail_username" varchar;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "profile_picture_id" integer;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "otp_verified" boolean;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "otp" varchar;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "otp_generated_at" timestamp(3) with time zone;
  `)

  // Restore FK constraint for profile_picture_id
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "students" ADD CONSTRAINT "students_profile_picture_id_media_id_fk"
        FOREIGN KEY ("profile_picture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // --- Users: restore is_active column ---
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
  `)
}

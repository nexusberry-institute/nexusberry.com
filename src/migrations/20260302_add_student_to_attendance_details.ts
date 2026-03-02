import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add student_id column with FK to students
  await db.execute(sql`
    ALTER TABLE "attendance_details"
      ADD COLUMN IF NOT EXISTS "student_id" integer REFERENCES "students"("id") ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS "joined_at" timestamp(3) with time zone;
  `)

  // Add index on student_id
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "attendance_details_student_idx"
    ON "attendance_details" ("student_id");
  `)

  // Add composite unique index to prevent duplicate attendance records
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "attendance_details_attendance_student_idx"
    ON "attendance_details" ("attendance_id", "student_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "attendance_details_attendance_student_idx";
  `)

  await db.execute(sql`
    DROP INDEX IF EXISTS "attendance_details_student_idx";
  `)

  await db.execute(sql`
    ALTER TABLE "attendance_details"
      DROP COLUMN IF EXISTS "student_id",
      DROP COLUMN IF EXISTS "joined_at";
  `)
}

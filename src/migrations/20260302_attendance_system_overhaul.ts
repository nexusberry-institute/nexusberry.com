import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Attendance: drop type, medium, content columns; add staff_notes
  await db.execute(sql`
    ALTER TABLE "attendance"
      DROP COLUMN IF EXISTS "type",
      DROP COLUMN IF EXISTS "medium",
      DROP COLUMN IF EXISTS "content",
      ADD COLUMN IF NOT EXISTS "staff_notes" varchar;
  `)

  // 2. Attendance: make online_class_link nullable (drop NOT NULL if exists)
  await db.execute(sql`
    ALTER TABLE "attendance"
      ALTER COLUMN "online_class_link" DROP NOT NULL;
  `)

  // 3. AttendanceDetails: make attendance_id nullable
  await db.execute(sql`
    ALTER TABLE "attendance_details"
      ALTER COLUMN "attendance_id" DROP NOT NULL;
  `)

  // 4. TimeTable: drop room column
  await db.execute(sql`
    ALTER TABLE "time_table"
      DROP COLUMN IF EXISTS "room";
  `)

  // 5. Drop enum types that are no longer referenced
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_attendance_type";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_attendance_medium";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Recreate enum types
  await db.execute(sql`
    CREATE TYPE "enum_attendance_type" AS ENUM ('CLASS', 'LAB', 'MAKE-UP-CLASS', 'MAKE-UP-LAB');
  `)

  await db.execute(sql`
    CREATE TYPE "enum_attendance_medium" AS ENUM ('PHYSICAL', 'ONLINE', 'HYBRID');
  `)

  // Restore time_table room column
  await db.execute(sql`
    ALTER TABLE "time_table"
      ADD COLUMN IF NOT EXISTS "room" varchar;
  `)

  // Restore attendance_details attendance_id NOT NULL
  await db.execute(sql`
    ALTER TABLE "attendance_details"
      ALTER COLUMN "attendance_id" SET NOT NULL;
  `)

  // Restore attendance columns
  await db.execute(sql`
    ALTER TABLE "attendance"
      ALTER COLUMN "online_class_link" SET NOT NULL;
  `)

  await db.execute(sql`
    ALTER TABLE "attendance"
      DROP COLUMN IF EXISTS "staff_notes",
      ADD COLUMN IF NOT EXISTS "type" "enum_attendance_type" DEFAULT 'CLASS',
      ADD COLUMN IF NOT EXISTS "medium" "enum_attendance_medium",
      ADD COLUMN IF NOT EXISTS "content" varchar;
  `)
}

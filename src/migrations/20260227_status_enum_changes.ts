import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Students: remove 'graduated' from enum_students_status
  //    PostgreSQL doesn't support DROP VALUE, so we recreate the enum.
  await db.execute(sql`
    ALTER TYPE "enum_students_status" RENAME TO "enum_students_status_old";

    CREATE TYPE "enum_students_status" AS ENUM('active', 'on-hold', 'withdrawn');

    ALTER TABLE "students"
      ALTER COLUMN "status" DROP DEFAULT,
      ALTER COLUMN "status" TYPE "enum_students_status" USING "status"::text::"enum_students_status",
      ALTER COLUMN "status" SET DEFAULT 'active';

    DROP TYPE "enum_students_status_old";
  `)

  // 2. Enrollments: rename 'completed' → 'graduated' and add 'refund-requested'
  await db.execute(sql`
    ALTER TYPE "enum_enrollments_status" RENAME VALUE 'completed' TO 'graduated';
  `)

  await db.execute(sql`
    ALTER TYPE "enum_enrollments_status" ADD VALUE IF NOT EXISTS 'refund-requested';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // 1. Enrollments: rename 'graduated' back to 'completed', remove 'refund-requested'
  //    Recreate enum since PostgreSQL can't DROP VALUE
  await db.execute(sql`
    ALTER TYPE "enum_enrollments_status" RENAME TO "enum_enrollments_status_old";

    CREATE TYPE "enum_enrollments_status" AS ENUM('active', 'completed', 'frozen', 'dropped');

    ALTER TABLE "enrollments"
      ALTER COLUMN "status" DROP DEFAULT,
      ALTER COLUMN "status" TYPE "enum_enrollments_status"
        USING CASE
          WHEN "status"::text = 'graduated' THEN 'completed'::"enum_enrollments_status"
          WHEN "status"::text = 'refund-requested' THEN 'dropped'::"enum_enrollments_status"
          ELSE "status"::text::"enum_enrollments_status"
        END,
      ALTER COLUMN "status" SET DEFAULT 'active';

    DROP TYPE "enum_enrollments_status_old";
  `)

  // 2. Students: add 'graduated' back to enum_students_status
  await db.execute(sql`
    ALTER TYPE "enum_students_status" ADD VALUE IF NOT EXISTS 'graduated';
  `)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "title" varchar;
  `)

  // Back-fill titles for existing enrollments using raw SQL
  await db.execute(sql`
    UPDATE "enrollments" e
    SET "title" = s."full_name" || ' — ' || b."slug"
    FROM "students" s, "batches" b
    WHERE e."student_id" = s."id"
      AND e."batch_id" = b."id"
      AND e."title" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "enrollments" DROP COLUMN IF EXISTS "title";
  `)
}

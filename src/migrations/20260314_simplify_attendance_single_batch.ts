import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Add batch_id column to attendance (FK to batches)
  await db.execute(sql`
    ALTER TABLE "attendance"
      ADD COLUMN IF NOT EXISTS "batch_id" integer;
  `)

  // 2. Populate batch_id from existing attendance_rels data (take first batch per attendance)
  await db.execute(sql`
    UPDATE "attendance" a SET "batch_id" = (
      SELECT ar."batches_id" FROM "attendance_rels" ar
      WHERE ar."parent_id" = a."id" AND ar."path" = 'batches'
      ORDER BY ar."order" ASC LIMIT 1
    );
  `)

  // 3. Add FK constraint
  await db.execute(sql`
    ALTER TABLE "attendance"
      ADD CONSTRAINT "attendance_batch_id_batches_id_fk"
      FOREIGN KEY ("batch_id") REFERENCES "batches"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
  `)

  // 4. Create index on batch_id
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "attendance_batch_idx" ON "attendance" USING btree ("batch_id");
  `)

  // 5. Remove teacher_id column
  await db.execute(sql`
    ALTER TABLE "attendance"
      DROP COLUMN IF EXISTS "teacher_id";
  `)

  // 6. Clean up batches rows from attendance_rels (users rows must stay)
  await db.execute(sql`
    DELETE FROM "attendance_rels" WHERE "path" = 'batches';
  `)

  // 7. Drop the batches_id column from attendance_rels since it's no longer needed
  await db.execute(sql`
    ALTER TABLE "attendance_rels"
      DROP COLUMN IF EXISTS "batches_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore batches_id column on attendance_rels
  await db.execute(sql`
    ALTER TABLE "attendance_rels"
      ADD COLUMN IF NOT EXISTS "batches_id" integer;
  `)

  // Restore teacher_id column on attendance
  await db.execute(sql`
    ALTER TABLE "attendance"
      ADD COLUMN IF NOT EXISTS "teacher_id" integer;
  `)

  // Migrate batch_id back to attendance_rels
  await db.execute(sql`
    INSERT INTO "attendance_rels" ("parent_id", "path", "batches_id", "order")
    SELECT a."id", 'batches', a."batch_id", 0
    FROM "attendance" a
    WHERE a."batch_id" IS NOT NULL;
  `)

  // Drop batch FK and column
  await db.execute(sql`
    ALTER TABLE "attendance"
      DROP CONSTRAINT IF EXISTS "attendance_batch_id_batches_id_fk";
  `)

  await db.execute(sql`
    DROP INDEX IF EXISTS "attendance_batch_idx";
  `)

  await db.execute(sql`
    ALTER TABLE "attendance"
      DROP COLUMN IF EXISTS "batch_id";
  `)
}

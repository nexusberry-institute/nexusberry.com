import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add batch_id column to leads
  await db.execute(sql`
    ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "batch_id" integer;
  `)

  // Add foreign key constraint
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "leads" ADD CONSTRAINT "leads_batch_id_batches_id_fk"
        FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Add index for batch_id
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "leads_batch_idx" ON "leads" USING btree ("batch_id");
  `)

  // Drop student_id foreign key, index, and column
  await db.execute(sql`
    ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_student_id_students_id_fk";
  `)
  await db.execute(sql`
    DROP INDEX IF EXISTS "leads_student_idx";
  `)
  await db.execute(sql`
    ALTER TABLE "leads" DROP COLUMN IF EXISTS "student_id";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Re-add student_id column
  await db.execute(sql`
    ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "student_id" integer;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "leads" ADD CONSTRAINT "leads_student_id_students_id_fk"
        FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "leads_student_idx" ON "leads" USING btree ("student_id");
  `)

  // Drop batch_id
  await db.execute(sql`
    ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_batch_id_batches_id_fk";
  `)
  await db.execute(sql`
    DROP INDEX IF EXISTS "leads_batch_idx";
  `)
  await db.execute(sql`
    ALTER TABLE "leads" DROP COLUMN IF EXISTS "batch_id";
  `)
}

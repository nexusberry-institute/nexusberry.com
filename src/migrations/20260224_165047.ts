import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Drop FK constraints on batches
  await db.execute(sql`
    ALTER TABLE "batches" DROP CONSTRAINT IF EXISTS "batches_training_courses_id_training_courses_id_fk";
  `)
  await db.execute(sql`
    ALTER TABLE "batches_rels" DROP CONSTRAINT IF EXISTS "batches_rels_modules_fk";
  `)

  // 2. Drop indexes
  await db.execute(sql`
    DROP INDEX IF EXISTS "batches_training_courses_idx";
    DROP INDEX IF EXISTS "batches_rels_modules_id_idx";
  `)

  // 3. Add new column (nullable first, backfill from training course title, then set NOT NULL)
  await db.execute(sql`
    ALTER TABLE "batches" ADD COLUMN "course_title" varchar;
  `)
  await db.execute(sql`
    UPDATE "batches" b
    SET "course_title" = COALESCE(tc."title", 'Untitled')
    FROM "training_courses" tc
    WHERE b."training_courses_id" = tc."id"
      AND b."course_title" IS NULL;
  `)
  await db.execute(sql`
    UPDATE "batches"
    SET "course_title" = 'Untitled'
    WHERE "course_title" IS NULL;
  `)
  await db.execute(sql`
    ALTER TABLE "batches" ALTER COLUMN "course_title" SET NOT NULL;
  `)

  // 4. Drop removed columns from batches
  await db.execute(sql`
    ALTER TABLE "batches" DROP COLUMN IF EXISTS "training_courses_id";
    ALTER TABLE "batches" DROP COLUMN IF EXISTS "can_enroll";
    ALTER TABLE "batches" DROP COLUMN IF EXISTS "wa_group_link";
    ALTER TABLE "batches" DROP COLUMN IF EXISTS "gcr_link";
  `)

  // 5. Drop modules relationship column from batches_rels
  await db.execute(sql`
    ALTER TABLE "batches_rels" DROP COLUMN IF EXISTS "modules_id";
  `)

  // 6. Drop orphaned modules_rels table (Modules collection has no hasMany rels)
  await db.execute(sql`
    DROP TABLE IF EXISTS "modules_rels" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // 1. Recreate modules_rels table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "modules_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "modules_rels_order_idx" ON "modules_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "modules_rels_parent_idx" ON "modules_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "modules_rels_path_idx" ON "modules_rels" USING btree ("path");
    DO $$ BEGIN
      ALTER TABLE "modules_rels" ADD CONSTRAINT "modules_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 2. Re-add modules_id to batches_rels
  await db.execute(sql`
    ALTER TABLE "batches_rels" ADD COLUMN IF NOT EXISTS "modules_id" integer;
    DO $$ BEGIN
      ALTER TABLE "batches_rels" ADD CONSTRAINT "batches_rels_modules_fk"
        FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "batches_rels_modules_id_idx" ON "batches_rels" USING btree ("modules_id");
  `)

  // 3. Re-add removed columns to batches
  await db.execute(sql`
    ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "training_courses_id" integer;
    ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "can_enroll" boolean DEFAULT true;
    ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "wa_group_link" varchar;
    ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "gcr_link" varchar;
    DO $$ BEGIN
      ALTER TABLE "batches" ADD CONSTRAINT "batches_training_courses_id_training_courses_id_fk"
        FOREIGN KEY ("training_courses_id") REFERENCES "public"."training_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "batches_training_courses_idx" ON "batches" USING btree ("training_courses_id");
  `)

  // 4. Drop the new column
  await db.execute(sql`
    ALTER TABLE "batches" DROP COLUMN IF EXISTS "course_title";
  `)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Rename enum value 'user' → 'authenticated' in enum_users_roles
  await db.execute(sql`
    ALTER TYPE "enum_users_roles" RENAME VALUE 'user' TO 'authenticated';
  `)

  // 2. Create enums for tutorials access type and enrollments
  await db.execute(sql`
    CREATE TYPE "enum_tutorials_access_type" AS ENUM('public', 'protected');
    CREATE TYPE "enum_enrollments_status" AS ENUM('active', 'completed', 'frozen', 'dropped');
    CREATE TYPE "enum_enrollments_mode" AS ENUM('ONLINE', 'PHYSICAL', 'HYBRID');
  `)

  // 3. Add access_type column to tutorials
  await db.execute(sql`
    ALTER TABLE "tutorials" ADD COLUMN "access_type" "enum_tutorials_access_type" DEFAULT 'public' NOT NULL;
  `)

  // 4. Create tutorials_rels table (for batches hasMany relationship)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "tutorials_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "batches_id" integer
    );
    CREATE INDEX IF NOT EXISTS "tutorials_rels_order_idx" ON "tutorials_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "tutorials_rels_parent_idx" ON "tutorials_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "tutorials_rels_path_idx" ON "tutorials_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "tutorials_rels_batches_id_idx" ON "tutorials_rels" USING btree ("batches_id");
    DO $$ BEGIN
      ALTER TABLE "tutorials_rels" ADD CONSTRAINT "tutorials_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."tutorials"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "tutorials_rels" ADD CONSTRAINT "tutorials_rels_batches_fk"
        FOREIGN KEY ("batches_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 5. Create students_rels table (for trialTutorials hasMany relationship)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "students_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "tutorials_id" integer
    );
    CREATE INDEX IF NOT EXISTS "students_rels_order_idx" ON "students_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "students_rels_parent_idx" ON "students_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "students_rels_path_idx" ON "students_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "students_rels_tutorials_id_idx" ON "students_rels" USING btree ("tutorials_id");
    DO $$ BEGIN
      ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_tutorials_fk"
        FOREIGN KEY ("tutorials_id") REFERENCES "public"."tutorials"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 6. Create enrollments table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "enrollments" (
      "id" serial PRIMARY KEY NOT NULL,
      "student_id" integer NOT NULL,
      "batch_id" integer NOT NULL,
      "note" varchar,
      "status" "enum_enrollments_status" DEFAULT 'active',
      "mode" "enum_enrollments_mode",
      "admission_date" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "enrollments_student_idx" ON "enrollments" USING btree ("student_id");
    CREATE INDEX IF NOT EXISTS "enrollments_batch_idx" ON "enrollments" USING btree ("batch_id");
    CREATE INDEX IF NOT EXISTS "enrollments_updated_at_idx" ON "enrollments" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "enrollments_created_at_idx" ON "enrollments" USING btree ("created_at");
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_students_id_fk"
        FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_batch_id_batches_id_fk"
        FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 7. Add enrollments_id column to payload_locked_documents_rels
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "enrollments_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("enrollments_id");
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enrollments_fk"
        FOREIGN KEY ("enrollments_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove enrollments_id from payload_locked_documents_rels
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_enrollments_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_enrollments_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "enrollments_id";
  `)

  // Drop enrollments table
  await db.execute(sql`
    DROP TABLE IF EXISTS "enrollments" CASCADE;
  `)

  // Drop students_rels table
  await db.execute(sql`
    DROP TABLE IF EXISTS "students_rels" CASCADE;
  `)

  // Drop tutorials_rels table
  await db.execute(sql`
    DROP TABLE IF EXISTS "tutorials_rels" CASCADE;
  `)

  // Remove access_type column from tutorials
  await db.execute(sql`
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "access_type";
  `)

  // Drop enums
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_tutorials_access_type";
    DROP TYPE IF EXISTS "enum_enrollments_status";
    DROP TYPE IF EXISTS "enum_enrollments_mode";
  `)

  // Rename enum value 'authenticated' back to 'user'
  await db.execute(sql`
    ALTER TYPE "enum_users_roles" RENAME VALUE 'authenticated' TO 'user';
  `)
}

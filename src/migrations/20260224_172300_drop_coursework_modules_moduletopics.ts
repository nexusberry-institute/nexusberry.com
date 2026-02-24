import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Drop FK constraints and columns from dependent tables

  // quizzes: module_id, module_topic_id
  await db.execute(sql`
    ALTER TABLE "quizzes" DROP CONSTRAINT IF EXISTS "quizzes_module_id_modules_id_fk";
    ALTER TABLE "quizzes" DROP CONSTRAINT IF EXISTS "quizzes_module_topic_id_module_topics_id_fk";
    DROP INDEX IF EXISTS "quizzes_module_idx";
    DROP INDEX IF EXISTS "quizzes_module_topic_idx";
    ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "module_id";
    ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "module_topic_id";
  `)

  // quiz_questions: module_id, module_topic_id
  await db.execute(sql`
    ALTER TABLE "quiz_questions" DROP CONSTRAINT IF EXISTS "quiz_questions_module_id_modules_id_fk";
    ALTER TABLE "quiz_questions" DROP CONSTRAINT IF EXISTS "quiz_questions_module_topic_id_module_topics_id_fk";
    DROP INDEX IF EXISTS "quiz_questions_module_idx";
    DROP INDEX IF EXISTS "quiz_questions_module_topic_idx";
    ALTER TABLE "quiz_questions" DROP COLUMN IF EXISTS "module_id";
    ALTER TABLE "quiz_questions" DROP COLUMN IF EXISTS "module_topic_id";
  `)

  // attendance: module_id
  await db.execute(sql`
    ALTER TABLE "attendance" DROP CONSTRAINT IF EXISTS "attendance_module_id_modules_id_fk";
    DROP INDEX IF EXISTS "attendance_module_idx";
    ALTER TABLE "attendance" DROP COLUMN IF EXISTS "module_id";
  `)

  // training_courses_rels: modules_id
  await db.execute(sql`
    ALTER TABLE "training_courses_rels" DROP CONSTRAINT IF EXISTS "training_courses_rels_modules_fk";
    DROP INDEX IF EXISTS "training_courses_rels_modules_id_idx";
    ALTER TABLE "training_courses_rels" DROP COLUMN IF EXISTS "modules_id";
  `)

  // enrollments_rels: modules_id
  await db.execute(sql`
    ALTER TABLE "enrollments_rels" DROP CONSTRAINT IF EXISTS "enrollments_rels_modules_fk";
    DROP INDEX IF EXISTS "enrollments_rels_modules_id_idx";
    ALTER TABLE "enrollments_rels" DROP COLUMN IF EXISTS "modules_id";
  `)

  // payload_locked_documents_rels: coursework_id, modules_id, module_topics_id
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_coursework_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_modules_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_module_topics_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_coursework_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_modules_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_module_topics_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "coursework_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "modules_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "module_topics_id";
  `)

  // 2. Drop the three main tables (order matters: coursework and module_topics reference modules)
  await db.execute(sql`
    DROP TABLE IF EXISTS "coursework" CASCADE;
    DROP TABLE IF EXISTS "module_topics" CASCADE;
    DROP TABLE IF EXISTS "modules" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Recreate tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "modules" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar,
      "slug_lock" boolean DEFAULT true,
      "nick" varchar,
      "description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "modules_slug_idx" ON "modules" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "modules_updated_at_idx" ON "modules" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "modules_created_at_idx" ON "modules" USING btree ("created_at");
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "module_topics" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "modules_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "module_topics_modules_idx" ON "module_topics" USING btree ("modules_id");
    CREATE INDEX IF NOT EXISTS "module_topics_updated_at_idx" ON "module_topics" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "module_topics_created_at_idx" ON "module_topics" USING btree ("created_at");
    DO $$ BEGIN
      ALTER TABLE "module_topics" ADD CONSTRAINT "module_topics_modules_id_modules_id_fk"
        FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "coursework" (
      "id" serial PRIMARY KEY NOT NULL,
      "slug" varchar,
      "slug_lock" boolean DEFAULT true,
      "module_id" integer,
      "topic_group" varchar,
      "topic" varchar,
      "parts_id" integer,
      "content" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "coursework_slug_idx" ON "coursework" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "coursework_module_idx" ON "coursework" USING btree ("module_id");
    CREATE INDEX IF NOT EXISTS "coursework_topic_idx" ON "coursework" USING btree ("topic");
    CREATE INDEX IF NOT EXISTS "coursework_parts_idx" ON "coursework" USING btree ("parts_id");
    CREATE INDEX IF NOT EXISTS "coursework_updated_at_idx" ON "coursework" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "coursework_created_at_idx" ON "coursework" USING btree ("created_at");
    DO $$ BEGIN
      ALTER TABLE "coursework" ADD CONSTRAINT "coursework_module_id_modules_id_fk"
        FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "coursework" ADD CONSTRAINT "coursework_parts_id_coursework_id_fk"
        FOREIGN KEY ("parts_id") REFERENCES "public"."coursework"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // Re-add columns to dependent tables
  await db.execute(sql`
    ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "module_id" integer;
    ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "module_topic_id" integer;
    CREATE INDEX IF NOT EXISTS "quizzes_module_idx" ON "quizzes" USING btree ("module_id");
    CREATE INDEX IF NOT EXISTS "quizzes_module_topic_idx" ON "quizzes" USING btree ("module_topic_id");
    DO $$ BEGIN
      ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_module_id_modules_id_fk"
        FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_module_topic_id_module_topics_id_fk"
        FOREIGN KEY ("module_topic_id") REFERENCES "public"."module_topics"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "quiz_questions" ADD COLUMN IF NOT EXISTS "module_id" integer;
    ALTER TABLE "quiz_questions" ADD COLUMN IF NOT EXISTS "module_topic_id" integer;
    CREATE INDEX IF NOT EXISTS "quiz_questions_module_idx" ON "quiz_questions" USING btree ("module_id");
    CREATE INDEX IF NOT EXISTS "quiz_questions_module_topic_idx" ON "quiz_questions" USING btree ("module_topic_id");
    DO $$ BEGIN
      ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_module_id_modules_id_fk"
        FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_module_topic_id_module_topics_id_fk"
        FOREIGN KEY ("module_topic_id") REFERENCES "public"."module_topics"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "attendance" ADD COLUMN IF NOT EXISTS "module_id" integer;
    CREATE INDEX IF NOT EXISTS "attendance_module_idx" ON "attendance" USING btree ("module_id");
    DO $$ BEGIN
      ALTER TABLE "attendance" ADD CONSTRAINT "attendance_module_id_modules_id_fk"
        FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "training_courses_rels" ADD COLUMN IF NOT EXISTS "modules_id" integer;
    CREATE INDEX IF NOT EXISTS "training_courses_rels_modules_id_idx" ON "training_courses_rels" USING btree ("modules_id");
    DO $$ BEGIN
      ALTER TABLE "training_courses_rels" ADD CONSTRAINT "training_courses_rels_modules_fk"
        FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "enrollments_rels" ADD COLUMN IF NOT EXISTS "modules_id" integer;
    CREATE INDEX IF NOT EXISTS "enrollments_rels_modules_id_idx" ON "enrollments_rels" USING btree ("modules_id");
    DO $$ BEGIN
      ALTER TABLE "enrollments_rels" ADD CONSTRAINT "enrollments_rels_modules_fk"
        FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "coursework_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "modules_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "module_topics_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_coursework_id_idx" ON "payload_locked_documents_rels" USING btree ("coursework_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_modules_id_idx" ON "payload_locked_documents_rels" USING btree ("modules_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_module_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("module_topics_id");
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coursework_fk"
        FOREIGN KEY ("coursework_id") REFERENCES "public"."coursework"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_modules_fk"
        FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_module_topics_fk"
        FOREIGN KEY ("module_topics_id") REFERENCES "public"."module_topics"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

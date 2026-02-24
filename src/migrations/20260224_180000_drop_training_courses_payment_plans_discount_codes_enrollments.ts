import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Drop FK constraints and columns from fee_receipts (enrollment_id)
  await db.execute(sql`
    ALTER TABLE "fee_receipts" DROP CONSTRAINT IF EXISTS "fee_receipts_enrollment_id_enrollments_id_fk";
    DROP INDEX IF EXISTS "fee_receipts_enrollment_idx";
    ALTER TABLE "fee_receipts" DROP COLUMN IF EXISTS "enrollment_id";
  `)

  // 2. Drop FK constraints and columns from attendance_details (enrollment_id)
  await db.execute(sql`
    ALTER TABLE "attendance_details" DROP CONSTRAINT IF EXISTS "attendance_details_enrollment_id_enrollments_id_fk";
    DROP INDEX IF EXISTS "attendance_details_enrollment_idx";
    ALTER TABLE "attendance_details" DROP COLUMN IF EXISTS "enrollment_id";
  `)

  // 3. Drop FK constraints and columns from payload_locked_documents_rels
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_training_courses_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_payment_plans_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_discount_codes_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_enrollments_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_training_courses_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_payment_plans_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_discount_codes_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_enrollments_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "training_courses_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payment_plans_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "discount_codes_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "enrollments_id";
  `)

  // 4. Drop child/junction tables first
  await db.execute(sql`
    DROP TABLE IF EXISTS "enrollments_batch_enrollments" CASCADE;
    DROP TABLE IF EXISTS "enrollments_rels" CASCADE;
    DROP TABLE IF EXISTS "payment_plans_installments" CASCADE;
    DROP TABLE IF EXISTS "training_courses_rels" CASCADE;
  `)

  // 5. Drop main tables (order: discount_codes → enrollments → payment_plans → training_courses)
  await db.execute(sql`
    DROP TABLE IF EXISTS "discount_codes" CASCADE;
    DROP TABLE IF EXISTS "enrollments" CASCADE;
    DROP TABLE IF EXISTS "payment_plans" CASCADE;
    DROP TABLE IF EXISTS "training_courses" CASCADE;
  `)

  // 6. Drop enums
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_training_courses_status";
    DROP TYPE IF EXISTS "enum_discount_codes_discount_type";
    DROP TYPE IF EXISTS "enum_enrollments_batch_enrollments_mode";
    DROP TYPE IF EXISTS "enum_enrollments_completion_state";
    DROP TYPE IF EXISTS "enum_enrollments_certificate_status";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // 1. Recreate enums
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_training_courses_status" AS ENUM('active', 'inactive');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_discount_codes_discount_type" AS ENUM('fixed', 'percentage');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_enrollments_batch_enrollments_mode" AS ENUM('ONLINE', 'PHYSICAL', 'HYBRID');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_enrollments_completion_state" AS ENUM('CONTINUE', 'COMPLETED', 'FREEZE', 'DROPOUT');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "enum_enrollments_certificate_status" AS ENUM('PENDING', 'ISSUED', 'REVOKED');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 2. Recreate training_courses
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "training_courses" (
      "id" serial PRIMARY KEY NOT NULL,
      "status" "enum_training_courses_status" DEFAULT 'active',
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "slug_lock" boolean DEFAULT true,
      "description" varchar,
      "full_price" numeric NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "training_courses_slug_idx" ON "training_courses" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "training_courses_updated_at_idx" ON "training_courses" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "training_courses_created_at_idx" ON "training_courses" USING btree ("created_at");
  `)

  // 3. Recreate training_courses_rels
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "training_courses_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "departments_id" integer
    );
    CREATE INDEX IF NOT EXISTS "training_courses_rels_order_idx" ON "training_courses_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "training_courses_rels_parent_idx" ON "training_courses_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "training_courses_rels_path_idx" ON "training_courses_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "training_courses_rels_departments_id_idx" ON "training_courses_rels" USING btree ("departments_id");
    DO $$ BEGIN
      ALTER TABLE "training_courses_rels" ADD CONSTRAINT "training_courses_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."training_courses"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "training_courses_rels" ADD CONSTRAINT "training_courses_rels_departments_fk"
        FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 4. Recreate payment_plans
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "payment_plans" (
      "id" serial PRIMARY KEY NOT NULL,
      "_payment_plans_relatedpaymentplans_order" varchar,
      "training_course_id" integer NOT NULL,
      "name" varchar NOT NULL,
      "is_popular" boolean DEFAULT false,
      "description" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "payment_plans__payment_plans_relatedpaymentplans_order_idx" ON "payment_plans" USING btree ("_payment_plans_relatedpaymentplans_order");
    CREATE INDEX IF NOT EXISTS "payment_plans_training_course_idx" ON "payment_plans" USING btree ("training_course_id");
    CREATE INDEX IF NOT EXISTS "payment_plans_updated_at_idx" ON "payment_plans" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "payment_plans_created_at_idx" ON "payment_plans" USING btree ("created_at");
    DO $$ BEGIN
      ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_training_course_id_training_courses_id_fk"
        FOREIGN KEY ("training_course_id") REFERENCES "public"."training_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 5. Recreate payment_plans_installments
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "payment_plans_installments" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "amount" numeric NOT NULL,
      "due_after_days" numeric DEFAULT 30
    );
    CREATE INDEX IF NOT EXISTS "payment_plans_installments_order_idx" ON "payment_plans_installments" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "payment_plans_installments_parent_id_idx" ON "payment_plans_installments" USING btree ("_parent_id");
    DO $$ BEGIN
      ALTER TABLE "payment_plans_installments" ADD CONSTRAINT "payment_plans_installments_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 6. Recreate discount_codes
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "discount_codes" (
      "id" serial PRIMARY KEY NOT NULL,
      "code" varchar NOT NULL,
      "training_course_id" integer NOT NULL,
      "payment_plan_id" integer NOT NULL,
      "discount_type" "enum_discount_codes_discount_type" NOT NULL DEFAULT 'fixed',
      "discount_value" numeric NOT NULL,
      "usage_limit" numeric DEFAULT 0,
      "times_used" numeric DEFAULT 0,
      "expiry_at" timestamp(3) with time zone,
      "is_valid" boolean DEFAULT true,
      "user_email" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "discount_codes_code_idx" ON "discount_codes" USING btree ("code");
    CREATE INDEX IF NOT EXISTS "discount_codes_training_course_idx" ON "discount_codes" USING btree ("training_course_id");
    CREATE INDEX IF NOT EXISTS "discount_codes_payment_plan_idx" ON "discount_codes" USING btree ("payment_plan_id");
    CREATE INDEX IF NOT EXISTS "discount_codes_updated_at_idx" ON "discount_codes" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "discount_codes_created_at_idx" ON "discount_codes" USING btree ("created_at");
    DO $$ BEGIN
      ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_training_course_id_training_courses_id_fk"
        FOREIGN KEY ("training_course_id") REFERENCES "public"."training_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_payment_plan_id_payment_plans_id_fk"
        FOREIGN KEY ("payment_plan_id") REFERENCES "public"."payment_plans"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 7. Recreate enrollments
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "enrollments" (
      "id" serial PRIMARY KEY NOT NULL,
      "student_id" integer NOT NULL,
      "training_course_id" integer NOT NULL,
      "slug" varchar NOT NULL,
      "selected_payment_plan_id" integer NOT NULL,
      "discount_code_id" integer,
      "admission_date" timestamp(3) with time zone,
      "admission_fee" numeric DEFAULT 0,
      "freeze_date" timestamp(3) with time zone,
      "unfreeze_date" timestamp(3) with time zone,
      "completion_state" "enum_enrollments_completion_state" DEFAULT 'CONTINUE',
      "certificate_status" "enum_enrollments_certificate_status" DEFAULT 'PENDING',
      "is_suspended" boolean DEFAULT false,
      "note" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "enrollments_student_idx" ON "enrollments" USING btree ("student_id");
    CREATE INDEX IF NOT EXISTS "enrollments_training_course_idx" ON "enrollments" USING btree ("training_course_id");
    CREATE INDEX IF NOT EXISTS "enrollments_selected_payment_plan_idx" ON "enrollments" USING btree ("selected_payment_plan_id");
    CREATE INDEX IF NOT EXISTS "enrollments_discount_code_idx" ON "enrollments" USING btree ("discount_code_id");
    CREATE INDEX IF NOT EXISTS "enrollments_updated_at_idx" ON "enrollments" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "enrollments_created_at_idx" ON "enrollments" USING btree ("created_at");
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_students_id_fk"
        FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_training_course_id_training_courses_id_fk"
        FOREIGN KEY ("training_course_id") REFERENCES "public"."training_courses"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_selected_payment_plan_id_payment_plans_id_fk"
        FOREIGN KEY ("selected_payment_plan_id") REFERENCES "public"."payment_plans"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_discount_code_id_discount_codes_id_fk"
        FOREIGN KEY ("discount_code_id") REFERENCES "public"."discount_codes"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 8. Recreate enrollments_batch_enrollments
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "enrollments_batch_enrollments" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "batch_id" integer,
      "mode" "enum_enrollments_batch_enrollments_mode" DEFAULT 'HYBRID'
    );
    CREATE INDEX IF NOT EXISTS "enrollments_batch_enrollments_order_idx" ON "enrollments_batch_enrollments" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "enrollments_batch_enrollments_parent_id_idx" ON "enrollments_batch_enrollments" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "enrollments_batch_enrollments_batch_idx" ON "enrollments_batch_enrollments" USING btree ("batch_id");
    DO $$ BEGIN
      ALTER TABLE "enrollments_batch_enrollments" ADD CONSTRAINT "enrollments_batch_enrollments_batch_id_batches_id_fk"
        FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "enrollments_batch_enrollments" ADD CONSTRAINT "enrollments_batch_enrollments_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 9. Recreate enrollments_rels (without modules_id — already dropped in previous migration)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "enrollments_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "enrollments_rels_order_idx" ON "enrollments_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "enrollments_rels_parent_idx" ON "enrollments_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "enrollments_rels_path_idx" ON "enrollments_rels" USING btree ("path");
    DO $$ BEGIN
      ALTER TABLE "enrollments_rels" ADD CONSTRAINT "enrollments_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 10. Re-add enrollment_id columns to fee_receipts and attendance_details
  await db.execute(sql`
    ALTER TABLE "fee_receipts" ADD COLUMN IF NOT EXISTS "enrollment_id" integer NOT NULL;
    CREATE INDEX IF NOT EXISTS "fee_receipts_enrollment_idx" ON "fee_receipts" USING btree ("enrollment_id");
    DO $$ BEGIN
      ALTER TABLE "fee_receipts" ADD CONSTRAINT "fee_receipts_enrollment_id_enrollments_id_fk"
        FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    ALTER TABLE "attendance_details" ADD COLUMN IF NOT EXISTS "enrollment_id" integer NOT NULL;
    CREATE INDEX IF NOT EXISTS "attendance_details_enrollment_idx" ON "attendance_details" USING btree ("enrollment_id");
    DO $$ BEGIN
      ALTER TABLE "attendance_details" ADD CONSTRAINT "attendance_details_enrollment_id_enrollments_id_fk"
        FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 11. Re-add columns to payload_locked_documents_rels
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "training_courses_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "payment_plans_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "discount_codes_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "enrollments_id" integer;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_training_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("training_courses_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payment_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_plans_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_discount_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("discount_codes_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("enrollments_id");
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_training_courses_fk"
        FOREIGN KEY ("training_courses_id") REFERENCES "public"."training_courses"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_plans_fk"
        FOREIGN KEY ("payment_plans_id") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_discount_codes_fk"
        FOREIGN KEY ("discount_codes_id") REFERENCES "public"."discount_codes"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enrollments_fk"
        FOREIGN KEY ("enrollments_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_discount_codes_discount_type" AS ENUM('percentage', 'fixed');
  CREATE TABLE IF NOT EXISTS "payment_plans_installments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric NOT NULL,
  	"due_after_days" numeric DEFAULT 30
  );
  
  CREATE TABLE IF NOT EXISTS "payment_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_payment_plans_relatedpaymentplans_order" varchar NOT NULL,
  	"training_course_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"is_popular" boolean DEFAULT false,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "discount_codes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar DEFAULT 'NEXUS-ALWP34qtfd' NOT NULL,
  	"training_course_id" integer NOT NULL,
  	"payment_plan_id" integer NOT NULL,
  	"discount_type" "enum_discount_codes_discount_type" DEFAULT 'fixed' NOT NULL,
  	"discount_value" numeric NOT NULL,
  	"usage_limit" numeric DEFAULT 0,
  	"times_used" numeric DEFAULT 0,
  	"expiry_at" timestamp(3) with time zone,
  	"is_valid" boolean DEFAULT true,
  	"user_email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "training_courses_payment_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "training_courses_numbers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "training_courses_payment_plans" CASCADE;
  DROP TABLE "training_courses_numbers" CASCADE;
  ALTER TABLE "class_links" ALTER COLUMN "expiry" SET DEFAULT '2025-05-05T08:42:16.825Z';
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-05-05T06:42:16.825Z';
  ALTER TABLE "enrollments" ADD COLUMN "selected_payment_plan_id" integer NOT NULL;
  ALTER TABLE "enrollments" ADD COLUMN "discount_code_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payment_plans_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "discount_codes_id" integer;
  DO $$ BEGIN
   ALTER TABLE "payment_plans_installments" ADD CONSTRAINT "payment_plans_installments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_training_course_id_training_courses_id_fk" FOREIGN KEY ("training_course_id") REFERENCES "public"."training_courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_training_course_id_training_courses_id_fk" FOREIGN KEY ("training_course_id") REFERENCES "public"."training_courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_payment_plan_id_payment_plans_id_fk" FOREIGN KEY ("payment_plan_id") REFERENCES "public"."payment_plans"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payment_plans_installments_order_idx" ON "payment_plans_installments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "payment_plans_installments_parent_id_idx" ON "payment_plans_installments" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "payment_plans__payment_plans_relatedpaymentplans_order_idx" ON "payment_plans" USING btree ("_payment_plans_relatedpaymentplans_order");
  CREATE INDEX IF NOT EXISTS "payment_plans_training_course_idx" ON "payment_plans" USING btree ("training_course_id");
  CREATE INDEX IF NOT EXISTS "payment_plans_updated_at_idx" ON "payment_plans" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payment_plans_created_at_idx" ON "payment_plans" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "discount_codes_code_idx" ON "discount_codes" USING btree ("code");
  CREATE INDEX IF NOT EXISTS "discount_codes_training_course_idx" ON "discount_codes" USING btree ("training_course_id");
  CREATE INDEX IF NOT EXISTS "discount_codes_payment_plan_idx" ON "discount_codes" USING btree ("payment_plan_id");
  CREATE INDEX IF NOT EXISTS "discount_codes_updated_at_idx" ON "discount_codes" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "discount_codes_created_at_idx" ON "discount_codes" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_selected_payment_plan_id_payment_plans_id_fk" FOREIGN KEY ("selected_payment_plan_id") REFERENCES "public"."payment_plans"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_discount_code_id_discount_codes_id_fk" FOREIGN KEY ("discount_code_id") REFERENCES "public"."discount_codes"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_plans_fk" FOREIGN KEY ("payment_plans_id") REFERENCES "public"."payment_plans"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_discount_codes_fk" FOREIGN KEY ("discount_codes_id") REFERENCES "public"."discount_codes"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "enrollments_selected_payment_plan_idx" ON "enrollments" USING btree ("selected_payment_plan_id");
  CREATE INDEX IF NOT EXISTS "enrollments_discount_code_idx" ON "enrollments" USING btree ("discount_code_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payment_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_plans_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_discount_codes_id_idx" ON "payload_locked_documents_rels" USING btree ("discount_codes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "training_courses_payment_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"is_popular" boolean DEFAULT false,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "training_courses_numbers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL
  );
  
  ALTER TABLE "payment_plans_installments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "discount_codes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payment_plans_installments" CASCADE;
  DROP TABLE "payment_plans" CASCADE;
  DROP TABLE "discount_codes" CASCADE;
  ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_selected_payment_plan_id_payment_plans_id_fk";
  
  ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_discount_code_id_discount_codes_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payment_plans_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_discount_codes_fk";
  
  DROP INDEX IF EXISTS "enrollments_selected_payment_plan_idx";
  DROP INDEX IF EXISTS "enrollments_discount_code_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_payment_plans_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_discount_codes_id_idx";
  ALTER TABLE "class_links" ALTER COLUMN "expiry" SET DEFAULT '2025-05-03T10:43:47.006Z';
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-05-03T08:43:47.006Z';
  DO $$ BEGIN
   ALTER TABLE "training_courses_payment_plans" ADD CONSTRAINT "training_courses_payment_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."training_courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "training_courses_numbers" ADD CONSTRAINT "training_courses_numbers_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."training_courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "training_courses_payment_plans_order_idx" ON "training_courses_payment_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "training_courses_payment_plans_parent_id_idx" ON "training_courses_payment_plans" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "training_courses_numbers_order_parent_idx" ON "training_courses_numbers" USING btree ("order","parent_id");
  ALTER TABLE "enrollments" DROP COLUMN IF EXISTS "selected_payment_plan_id";
  ALTER TABLE "enrollments" DROP COLUMN IF EXISTS "discount_code_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payment_plans_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "discount_codes_id";
  DROP TYPE "public"."enum_discount_codes_discount_type";`)
}

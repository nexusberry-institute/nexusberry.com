import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_training_courses_status" AS ENUM('active', 'inactive');
  CREATE TABLE IF NOT EXISTS "training_courses_payment_plans_installments" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric NOT NULL,
  	"due_after_days" numeric NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "training_courses_payment_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"is_popular" boolean DEFAULT false,
  	"description" varchar NOT NULL
  );
  
  ALTER TABLE "web_departments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "web_departments" CASCADE;
  ALTER TABLE "courses" RENAME TO "training_courses";
  ALTER TABLE "courses_rels" RENAME TO "training_courses_rels";
  ALTER TABLE "web_courses" RENAME COLUMN "web_department_id" TO "department_id";
  ALTER TABLE "events" RENAME COLUMN "web_department_id" TO "department_id";
  ALTER TABLE "batches" RENAME COLUMN "course_id" TO "training_courses_id";
  ALTER TABLE "enrollments" RENAME COLUMN "course_id" TO "training_course_id";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "courses_id" TO "training_courses_id";
  ALTER TABLE "web_courses" DROP CONSTRAINT "web_courses_web_department_id_web_departments_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_web_department_id_web_departments_id_fk";
  
  ALTER TABLE "training_courses_rels" DROP CONSTRAINT "courses_rels_parent_fk";
  
  ALTER TABLE "training_courses_rels" DROP CONSTRAINT "courses_rels_modules_fk";
  
  ALTER TABLE "training_courses_rels" DROP CONSTRAINT "courses_rels_departments_fk";
  
  ALTER TABLE "batches" DROP CONSTRAINT "batches_course_id_courses_id_fk";
  
  ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_course_id_courses_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_web_departments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_courses_fk";
  
  DROP INDEX IF EXISTS "web_courses_web_department_idx";
  DROP INDEX IF EXISTS "events_web_department_idx";
  DROP INDEX IF EXISTS "courses_slug_idx";
  DROP INDEX IF EXISTS "courses_updated_at_idx";
  DROP INDEX IF EXISTS "courses_created_at_idx";
  DROP INDEX IF EXISTS "courses_rels_order_idx";
  DROP INDEX IF EXISTS "courses_rels_parent_idx";
  DROP INDEX IF EXISTS "courses_rels_path_idx";
  DROP INDEX IF EXISTS "courses_rels_modules_id_idx";
  DROP INDEX IF EXISTS "courses_rels_departments_id_idx";
  DROP INDEX IF EXISTS "batches_course_idx";
  DROP INDEX IF EXISTS "enrollments_course_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_web_departments_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_courses_id_idx";
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-22T10:46:50.771Z';
  ALTER TABLE "departments" ADD COLUMN "order_in_departments" numeric DEFAULT 1;
  ALTER TABLE "departments" ADD COLUMN "description" varchar;
  ALTER TABLE "departments" ADD COLUMN "image_id" integer;
  ALTER TABLE "departments" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "departments" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "departments" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "training_courses" ADD COLUMN "status" "enum_training_courses_status" DEFAULT 'active';
  ALTER TABLE "training_courses" ADD COLUMN "full_price" numeric NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "training_courses_payment_plans_installments" ADD CONSTRAINT "training_courses_payment_plans_installments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."training_courses_payment_plans"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "training_courses_payment_plans" ADD CONSTRAINT "training_courses_payment_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."training_courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "training_courses_payment_plans_installments_order_idx" ON "training_courses_payment_plans_installments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "training_courses_payment_plans_installments_parent_id_idx" ON "training_courses_payment_plans_installments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "training_courses_payment_plans_order_idx" ON "training_courses_payment_plans" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "training_courses_payment_plans_parent_id_idx" ON "training_courses_payment_plans" USING btree ("_parent_id");
  DO $$ BEGIN
   ALTER TABLE "web_courses" ADD CONSTRAINT "web_courses_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "departments" ADD CONSTRAINT "departments_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "departments" ADD CONSTRAINT "departments_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "training_courses_rels" ADD CONSTRAINT "training_courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."training_courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "training_courses_rels" ADD CONSTRAINT "training_courses_rels_modules_fk" FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "training_courses_rels" ADD CONSTRAINT "training_courses_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "batches" ADD CONSTRAINT "batches_training_courses_id_training_courses_id_fk" FOREIGN KEY ("training_courses_id") REFERENCES "public"."training_courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_training_course_id_training_courses_id_fk" FOREIGN KEY ("training_course_id") REFERENCES "public"."training_courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_training_courses_fk" FOREIGN KEY ("training_courses_id") REFERENCES "public"."training_courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "web_courses_department_idx" ON "web_courses" USING btree ("department_id");
  CREATE INDEX IF NOT EXISTS "events_department_idx" ON "events" USING btree ("department_id");
  CREATE INDEX IF NOT EXISTS "departments_image_idx" ON "departments" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "departments_meta_meta_image_idx" ON "departments" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "training_courses_slug_idx" ON "training_courses" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "training_courses_updated_at_idx" ON "training_courses" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "training_courses_created_at_idx" ON "training_courses" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "training_courses_rels_order_idx" ON "training_courses_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "training_courses_rels_parent_idx" ON "training_courses_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "training_courses_rels_path_idx" ON "training_courses_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "training_courses_rels_modules_id_idx" ON "training_courses_rels" USING btree ("modules_id");
  CREATE INDEX IF NOT EXISTS "training_courses_rels_departments_id_idx" ON "training_courses_rels" USING btree ("departments_id");
  CREATE INDEX IF NOT EXISTS "batches_training_courses_idx" ON "batches" USING btree ("training_courses_id");
  CREATE INDEX IF NOT EXISTS "enrollments_training_course_idx" ON "enrollments" USING btree ("training_course_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_training_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("training_courses_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "web_departments_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "web_departments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"order_in_departments" numeric DEFAULT 1,
  	"description" varchar,
  	"image_id" integer,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "training_courses_payment_plans_installments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "training_courses_payment_plans" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "training_courses_payment_plans_installments" CASCADE;
  DROP TABLE "training_courses_payment_plans" CASCADE;
  ALTER TABLE "training_courses" RENAME TO "courses";
  ALTER TABLE "training_courses_rels" RENAME TO "courses_rels";
  ALTER TABLE "web_courses" RENAME COLUMN "department_id" TO "web_department_id";
  ALTER TABLE "events" RENAME COLUMN "department_id" TO "web_department_id";
  ALTER TABLE "batches" RENAME COLUMN "training_courses_id" TO "course_id";
  ALTER TABLE "enrollments" RENAME COLUMN "training_course_id" TO "course_id";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "training_courses_id" TO "web_departments_id";
  ALTER TABLE "web_courses" DROP CONSTRAINT "web_courses_department_id_departments_id_fk";
  
  ALTER TABLE "departments" DROP CONSTRAINT "departments_image_id_media_id_fk";
  
  ALTER TABLE "departments" DROP CONSTRAINT "departments_meta_image_id_media_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_department_id_departments_id_fk";
  
  ALTER TABLE "courses_rels" DROP CONSTRAINT "training_courses_rels_parent_fk";
  
  ALTER TABLE "courses_rels" DROP CONSTRAINT "training_courses_rels_modules_fk";
  
  ALTER TABLE "courses_rels" DROP CONSTRAINT "training_courses_rels_departments_fk";
  
  ALTER TABLE "batches" DROP CONSTRAINT "batches_training_courses_id_training_courses_id_fk";
  
  ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_training_course_id_training_courses_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_training_courses_fk";
  
  DROP INDEX IF EXISTS "web_courses_department_idx";
  DROP INDEX IF EXISTS "departments_image_idx";
  DROP INDEX IF EXISTS "departments_meta_meta_image_idx";
  DROP INDEX IF EXISTS "events_department_idx";
  DROP INDEX IF EXISTS "training_courses_slug_idx";
  DROP INDEX IF EXISTS "training_courses_updated_at_idx";
  DROP INDEX IF EXISTS "training_courses_created_at_idx";
  DROP INDEX IF EXISTS "training_courses_rels_order_idx";
  DROP INDEX IF EXISTS "training_courses_rels_parent_idx";
  DROP INDEX IF EXISTS "training_courses_rels_path_idx";
  DROP INDEX IF EXISTS "training_courses_rels_modules_id_idx";
  DROP INDEX IF EXISTS "training_courses_rels_departments_id_idx";
  DROP INDEX IF EXISTS "batches_training_courses_idx";
  DROP INDEX IF EXISTS "enrollments_training_course_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_training_courses_id_idx";
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-21T13:49:42.995Z';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "courses_id" integer;
  DO $$ BEGIN
   ALTER TABLE "web_departments" ADD CONSTRAINT "web_departments_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "web_departments" ADD CONSTRAINT "web_departments_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "web_departments_slug_idx" ON "web_departments" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "web_departments_image_idx" ON "web_departments" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "web_departments_meta_meta_image_idx" ON "web_departments" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "web_departments_updated_at_idx" ON "web_departments" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "web_departments_created_at_idx" ON "web_departments" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "web_courses" ADD CONSTRAINT "web_courses_web_department_id_web_departments_id_fk" FOREIGN KEY ("web_department_id") REFERENCES "public"."web_departments"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "events" ADD CONSTRAINT "events_web_department_id_web_departments_id_fk" FOREIGN KEY ("web_department_id") REFERENCES "public"."web_departments"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_modules_fk" FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "batches" ADD CONSTRAINT "batches_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_web_departments_fk" FOREIGN KEY ("web_departments_id") REFERENCES "public"."web_departments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "web_courses_web_department_idx" ON "web_courses" USING btree ("web_department_id");
  CREATE INDEX IF NOT EXISTS "events_web_department_idx" ON "events" USING btree ("web_department_id");
  CREATE INDEX IF NOT EXISTS "courses_slug_idx" ON "courses" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "courses_rels_order_idx" ON "courses_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "courses_rels_parent_idx" ON "courses_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "courses_rels_path_idx" ON "courses_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "courses_rels_modules_id_idx" ON "courses_rels" USING btree ("modules_id");
  CREATE INDEX IF NOT EXISTS "courses_rels_departments_id_idx" ON "courses_rels" USING btree ("departments_id");
  CREATE INDEX IF NOT EXISTS "batches_course_idx" ON "batches" USING btree ("course_id");
  CREATE INDEX IF NOT EXISTS "enrollments_course_idx" ON "enrollments" USING btree ("course_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_web_departments_id_idx" ON "payload_locked_documents_rels" USING btree ("web_departments_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  ALTER TABLE "departments" DROP COLUMN IF EXISTS "order_in_departments";
  ALTER TABLE "departments" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "departments" DROP COLUMN IF EXISTS "image_id";
  ALTER TABLE "departments" DROP COLUMN IF EXISTS "meta_title";
  ALTER TABLE "departments" DROP COLUMN IF EXISTS "meta_image_id";
  ALTER TABLE "departments" DROP COLUMN IF EXISTS "meta_description";
  ALTER TABLE "courses" DROP COLUMN IF EXISTS "status";
  ALTER TABLE "courses" DROP COLUMN IF EXISTS "full_price";
  DROP TYPE "public"."enum_training_courses_status";`)
}

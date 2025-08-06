import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_web_courses_v_version_modules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_web_courses_v_version_f_a_qs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_web_courses_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_web_courses_v_version_modules" CASCADE;
  DROP TABLE "_web_courses_v_version_f_a_qs" CASCADE;
  DROP TABLE "_web_courses_v" CASCADE;
  DROP INDEX IF EXISTS "web_courses__status_idx";
  ALTER TABLE "web_courses_f_a_qs" ALTER COLUMN "question" SET NOT NULL;
  ALTER TABLE "web_courses_f_a_qs" ALTER COLUMN "answer" SET NOT NULL;
  ALTER TABLE "web_courses" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "web_courses" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "web_courses" ALTER COLUMN "sub_title" SET NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-26T07:59:57.890Z';
  ALTER TABLE "web_courses" DROP COLUMN IF EXISTS "_status";
  DROP TYPE "public"."enum_web_courses_status";
  DROP TYPE "public"."enum__web_courses_v_version_difficulty_level";
  DROP TYPE "public"."enum__web_courses_v_version_render_style";
  DROP TYPE "public"."enum__web_courses_v_version_course_format";
  DROP TYPE "public"."enum__web_courses_v_version_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_web_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__web_courses_v_version_difficulty_level" AS ENUM('Beginner', 'Intermediate', 'Advanced');
  CREATE TYPE "public"."enum__web_courses_v_version_render_style" AS ENUM('style-1', 'style-2', 'style-3');
  CREATE TYPE "public"."enum__web_courses_v_version_course_format" AS ENUM('short', 'medium', 'long');
  CREATE TYPE "public"."enum__web_courses_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "_web_courses_v_version_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_web_courses_v_version_f_a_qs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_web_courses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_sub_title" varchar,
  	"version_learning_outcomes" jsonb,
  	"version_description" jsonb,
  	"version_duration" numeric,
  	"version_price" numeric,
  	"version_cross_price" numeric,
  	"version_department_id" integer,
  	"version_image_id" integer,
  	"version_difficulty_level" "enum__web_courses_v_version_difficulty_level" DEFAULT 'Beginner',
  	"version_render_style" "enum__web_courses_v_version_render_style" DEFAULT 'style-1',
  	"version_course_format" "enum__web_courses_v_version_course_format" DEFAULT 'medium',
  	"version_total_lectures" numeric,
  	"version_order_in_courses" numeric,
  	"version_projects" numeric,
  	"version_instructor_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__web_courses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "web_courses_f_a_qs" ALTER COLUMN "question" DROP NOT NULL;
  ALTER TABLE "web_courses_f_a_qs" ALTER COLUMN "answer" DROP NOT NULL;
  ALTER TABLE "web_courses" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "web_courses" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "web_courses" ALTER COLUMN "sub_title" DROP NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-25T11:51:12.907Z';
  ALTER TABLE "web_courses" ADD COLUMN "_status" "enum_web_courses_status" DEFAULT 'draft';
  DO $$ BEGIN
   ALTER TABLE "_web_courses_v_version_modules" ADD CONSTRAINT "_web_courses_v_version_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_web_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_web_courses_v_version_f_a_qs" ADD CONSTRAINT "_web_courses_v_version_f_a_qs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_web_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_web_courses_v" ADD CONSTRAINT "_web_courses_v_parent_id_web_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."web_courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_web_courses_v" ADD CONSTRAINT "_web_courses_v_version_department_id_departments_id_fk" FOREIGN KEY ("version_department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_web_courses_v" ADD CONSTRAINT "_web_courses_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_web_courses_v" ADD CONSTRAINT "_web_courses_v_version_instructor_id_instructors_id_fk" FOREIGN KEY ("version_instructor_id") REFERENCES "public"."instructors"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_web_courses_v" ADD CONSTRAINT "_web_courses_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_modules_order_idx" ON "_web_courses_v_version_modules" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_modules_parent_id_idx" ON "_web_courses_v_version_modules" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_f_a_qs_order_idx" ON "_web_courses_v_version_f_a_qs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_f_a_qs_parent_id_idx" ON "_web_courses_v_version_f_a_qs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_parent_idx" ON "_web_courses_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_version_slug_idx" ON "_web_courses_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_version_department_idx" ON "_web_courses_v" USING btree ("version_department_id");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_version_image_idx" ON "_web_courses_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_version_instructor_idx" ON "_web_courses_v" USING btree ("version_instructor_id");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_meta_version_meta_image_idx" ON "_web_courses_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_version_updated_at_idx" ON "_web_courses_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_version_created_at_idx" ON "_web_courses_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_version_version__status_idx" ON "_web_courses_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_created_at_idx" ON "_web_courses_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_updated_at_idx" ON "_web_courses_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_web_courses_v_latest_idx" ON "_web_courses_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "web_courses__status_idx" ON "web_courses" USING btree ("_status");`)
}

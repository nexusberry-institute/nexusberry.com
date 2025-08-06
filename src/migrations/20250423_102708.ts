import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_students_gender" AS ENUM('male', 'female');
  CREATE TABLE IF NOT EXISTS "event_registrations_registered_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"has_attended" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "training_courses_numbers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL
  );
  
  ALTER TABLE "event_registrations_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "training_courses_payment_plans_installments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "event_registrations_rels" CASCADE;
  DROP TABLE "training_courses_payment_plans_installments" CASCADE;
  ALTER TABLE "students" RENAME COLUMN "address_street" TO "address_home_address";
  ALTER TABLE "batches_rels" DROP CONSTRAINT "batches_rels_time_table_fk";
  
  DROP INDEX IF EXISTS "batches_rels_time_table_id_idx";
  ALTER TABLE "batches" ALTER COLUMN "training_courses_id" SET NOT NULL;
  ALTER TABLE "batches" ALTER COLUMN "duration" SET NOT NULL;
  ALTER TABLE "time_table" ALTER COLUMN "start_time" SET NOT NULL;
  ALTER TABLE "time_table" ALTER COLUMN "end_time" SET NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-23T10:27:04.896Z';
  ALTER TABLE "events" ADD COLUMN "live_stream_link" varchar;
  ALTER TABLE "students" ADD COLUMN "gender" "enum_students_gender";
  ALTER TABLE "students" ADD COLUMN "education" varchar;
  ALTER TABLE "fee_receipts" ADD COLUMN "proof_text" varchar;
  ALTER TABLE "fee_receipts" ADD COLUMN "proof_image_id" integer;
  DO $$ BEGIN
   ALTER TABLE "event_registrations_registered_events" ADD CONSTRAINT "event_registrations_registered_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "event_registrations_registered_events" ADD CONSTRAINT "event_registrations_registered_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "training_courses_numbers" ADD CONSTRAINT "training_courses_numbers_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."training_courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "event_registrations_registered_events_order_idx" ON "event_registrations_registered_events" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "event_registrations_registered_events_parent_id_idx" ON "event_registrations_registered_events" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "event_registrations_registered_events_event_idx" ON "event_registrations_registered_events" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "training_courses_numbers_order_parent_idx" ON "training_courses_numbers" USING btree ("order","parent_id");
  DO $$ BEGIN
   ALTER TABLE "fee_receipts" ADD CONSTRAINT "fee_receipts_proof_image_id_media_id_fk" FOREIGN KEY ("proof_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "fee_receipts_proof_image_idx" ON "fee_receipts" USING btree ("proof_image_id");
  ALTER TABLE "batches_rels" DROP COLUMN IF EXISTS "time_table_id";
  ALTER TABLE "students" DROP COLUMN IF EXISTS "address_zip_code";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "event_registrations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"events_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "training_courses_payment_plans_installments" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric NOT NULL,
  	"due_after_days" numeric NOT NULL
  );
  
  ALTER TABLE "event_registrations_registered_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "training_courses_numbers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "event_registrations_registered_events" CASCADE;
  DROP TABLE "training_courses_numbers" CASCADE;
  ALTER TABLE "students" RENAME COLUMN "address_home_address" TO "address_street";
  ALTER TABLE "fee_receipts" DROP CONSTRAINT "fee_receipts_proof_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "fee_receipts_proof_image_idx";
  ALTER TABLE "batches" ALTER COLUMN "training_courses_id" DROP NOT NULL;
  ALTER TABLE "batches" ALTER COLUMN "duration" DROP NOT NULL;
  ALTER TABLE "time_table" ALTER COLUMN "start_time" DROP NOT NULL;
  ALTER TABLE "time_table" ALTER COLUMN "end_time" DROP NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-22T10:46:50.771Z';
  ALTER TABLE "batches_rels" ADD COLUMN "time_table_id" integer;
  ALTER TABLE "students" ADD COLUMN "address_zip_code" varchar;
  DO $$ BEGIN
   ALTER TABLE "event_registrations_rels" ADD CONSTRAINT "event_registrations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."event_registrations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "event_registrations_rels" ADD CONSTRAINT "event_registrations_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "training_courses_payment_plans_installments" ADD CONSTRAINT "training_courses_payment_plans_installments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."training_courses_payment_plans"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "event_registrations_rels_order_idx" ON "event_registrations_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "event_registrations_rels_parent_idx" ON "event_registrations_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "event_registrations_rels_path_idx" ON "event_registrations_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "event_registrations_rels_events_id_idx" ON "event_registrations_rels" USING btree ("events_id");
  CREATE INDEX IF NOT EXISTS "training_courses_payment_plans_installments_order_idx" ON "training_courses_payment_plans_installments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "training_courses_payment_plans_installments_parent_id_idx" ON "training_courses_payment_plans_installments" USING btree ("_parent_id");
  DO $$ BEGIN
   ALTER TABLE "batches_rels" ADD CONSTRAINT "batches_rels_time_table_fk" FOREIGN KEY ("time_table_id") REFERENCES "public"."time_table"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "batches_rels_time_table_id_idx" ON "batches_rels" USING btree ("time_table_id");
  ALTER TABLE "events" DROP COLUMN IF EXISTS "live_stream_link";
  ALTER TABLE "students" DROP COLUMN IF EXISTS "gender";
  ALTER TABLE "students" DROP COLUMN IF EXISTS "education";
  ALTER TABLE "fee_receipts" DROP COLUMN IF EXISTS "proof_text";
  ALTER TABLE "fee_receipts" DROP COLUMN IF EXISTS "proof_image_id";
  DROP TYPE "public"."enum_students_gender";`)
}

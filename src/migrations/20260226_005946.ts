import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_admission_requests_installments_status" AS ENUM('RECEIVED', 'PENDING', 'DEAD');
  CREATE TYPE "public"."enum_admission_requests_installments_paid_method" AS ENUM('BANK', 'CASH', 'JAZZCASH', 'EASYPAISA');
  CREATE TYPE "public"."enum_admission_requests_status" AS ENUM('pending', 'reviewing', 'approved', 'rejected', 'processed');
  CREATE TYPE "public"."enum_admission_requests_enrollment_mode" AS ENUM('ONLINE', 'PHYSICAL', 'HYBRID');
  CREATE TYPE "public"."enum_admission_requests_gender" AS ENUM('male', 'female');
  CREATE TYPE "public"."enum_admission_requests_preferred_medium" AS ENUM('ONLINE', 'PHYSICAL', 'HYBRID');
  CREATE TYPE "public"."enum_admission_requests_paid_method" AS ENUM('BANK', 'CASH', 'JAZZCASH', 'EASYPAISA');
  CREATE TABLE "admission_requests_installments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric NOT NULL,
  	"due_date" timestamp(3) with time zone NOT NULL,
  	"status" "enum_admission_requests_installments_status" DEFAULT 'PENDING',
  	"paid_method" "enum_admission_requests_installments_paid_method",
  	"note" varchar
  );
  
  CREATE TABLE "admission_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_admission_requests_status" DEFAULT 'pending' NOT NULL,
  	"assigned_batch_id" integer,
  	"enrollment_mode" "enum_admission_requests_enrollment_mode",
  	"lead_id" integer,
  	"staff_notes" varchar,
  	"rejection_reason" varchar,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone_number" varchar NOT NULL,
  	"guardian_phone" varchar,
  	"cnic" varchar,
  	"gender" "enum_admission_requests_gender",
  	"education" varchar,
  	"date_of_birth" timestamp(3) with time zone,
  	"address_home_address" varchar,
  	"address_city" varchar,
  	"address_province" varchar,
  	"address_country" varchar,
  	"course_id" integer NOT NULL,
  	"preferred_medium" "enum_admission_requests_preferred_medium",
  	"first_payment_amount" numeric,
  	"paid_method" "enum_admission_requests_paid_method" DEFAULT 'BANK',
  	"payment_proof_image_id" integer,
  	"payment_proof_text" varchar,
  	"student_note" varchar,
  	"total_fee" numeric,
  	"submitted_by_id" integer,
  	"created_student_id" integer,
  	"created_enrollment_id" integer,
  	"processing_error" varchar,
  	"processed_at" timestamp(3) with time zone,
  	"temp_password" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "fee_receipts" ADD COLUMN "enrollment_id" integer;
  ALTER TABLE "fee_receipts" ADD COLUMN "installment_number" numeric;
  ALTER TABLE "fee_receipts" ADD COLUMN "admission_request_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "admission_requests_id" integer;
  ALTER TABLE "admission_requests_installments" ADD CONSTRAINT "admission_requests_installments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admission_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admission_requests" ADD CONSTRAINT "admission_requests_assigned_batch_id_batches_id_fk" FOREIGN KEY ("assigned_batch_id") REFERENCES "public"."batches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admission_requests" ADD CONSTRAINT "admission_requests_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admission_requests" ADD CONSTRAINT "admission_requests_course_id_web_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."web_courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admission_requests" ADD CONSTRAINT "admission_requests_payment_proof_image_id_media_id_fk" FOREIGN KEY ("payment_proof_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admission_requests" ADD CONSTRAINT "admission_requests_submitted_by_id_users_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admission_requests" ADD CONSTRAINT "admission_requests_created_student_id_students_id_fk" FOREIGN KEY ("created_student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admission_requests" ADD CONSTRAINT "admission_requests_created_enrollment_id_enrollments_id_fk" FOREIGN KEY ("created_enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "admission_requests_installments_order_idx" ON "admission_requests_installments" USING btree ("_order");
  CREATE INDEX "admission_requests_installments_parent_id_idx" ON "admission_requests_installments" USING btree ("_parent_id");
  CREATE INDEX "admission_requests_assigned_batch_idx" ON "admission_requests" USING btree ("assigned_batch_id");
  CREATE INDEX "admission_requests_lead_idx" ON "admission_requests" USING btree ("lead_id");
  CREATE INDEX "admission_requests_email_idx" ON "admission_requests" USING btree ("email");
  CREATE INDEX "admission_requests_course_idx" ON "admission_requests" USING btree ("course_id");
  CREATE INDEX "admission_requests_payment_proof_image_idx" ON "admission_requests" USING btree ("payment_proof_image_id");
  CREATE INDEX "admission_requests_submitted_by_idx" ON "admission_requests" USING btree ("submitted_by_id");
  CREATE INDEX "admission_requests_created_student_idx" ON "admission_requests" USING btree ("created_student_id");
  CREATE INDEX "admission_requests_created_enrollment_idx" ON "admission_requests" USING btree ("created_enrollment_id");
  CREATE INDEX "admission_requests_updated_at_idx" ON "admission_requests" USING btree ("updated_at");
  CREATE INDEX "admission_requests_created_at_idx" ON "admission_requests" USING btree ("created_at");
  ALTER TABLE "fee_receipts" ADD CONSTRAINT "fee_receipts_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fee_receipts" ADD CONSTRAINT "fee_receipts_admission_request_id_admission_requests_id_fk" FOREIGN KEY ("admission_request_id") REFERENCES "public"."admission_requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admission_requests_fk" FOREIGN KEY ("admission_requests_id") REFERENCES "public"."admission_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "fee_receipts_enrollment_idx" ON "fee_receipts" USING btree ("enrollment_id");
  CREATE INDEX "fee_receipts_admission_request_idx" ON "fee_receipts" USING btree ("admission_request_id");
  CREATE INDEX "payload_locked_documents_rels_admission_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("admission_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "admission_requests_installments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "admission_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "admission_requests_installments" CASCADE;
  DROP TABLE "admission_requests" CASCADE;
  ALTER TABLE "fee_receipts" DROP CONSTRAINT "fee_receipts_enrollment_id_enrollments_id_fk";
  
  ALTER TABLE "fee_receipts" DROP CONSTRAINT "fee_receipts_admission_request_id_admission_requests_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_admission_requests_fk";
  
  DROP INDEX "fee_receipts_enrollment_idx";
  DROP INDEX "fee_receipts_admission_request_idx";
  DROP INDEX "payload_locked_documents_rels_admission_requests_id_idx";
  ALTER TABLE "fee_receipts" DROP COLUMN "enrollment_id";
  ALTER TABLE "fee_receipts" DROP COLUMN "installment_number";
  ALTER TABLE "fee_receipts" DROP COLUMN "admission_request_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "admission_requests_id";
  DROP TYPE "public"."enum_admission_requests_installments_status";
  DROP TYPE "public"."enum_admission_requests_installments_paid_method";
  DROP TYPE "public"."enum_admission_requests_status";
  DROP TYPE "public"."enum_admission_requests_enrollment_mode";
  DROP TYPE "public"."enum_admission_requests_gender";
  DROP TYPE "public"."enum_admission_requests_preferred_medium";
  DROP TYPE "public"."enum_admission_requests_paid_method";`)
}

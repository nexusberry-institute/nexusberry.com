import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "admission_requests" ADD COLUMN "department_id" integer;
  ALTER TABLE "admission_requests" ADD COLUMN "pay_date" timestamp(3) with time zone;
  ALTER TABLE "admission_requests" ADD CONSTRAINT "admission_requests_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "admission_requests_department_idx" ON "admission_requests" USING btree ("department_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "admission_requests" DROP CONSTRAINT "admission_requests_department_id_departments_id_fk";
  
  DROP INDEX "admission_requests_department_idx";
  ALTER TABLE "admission_requests" DROP COLUMN "department_id";
  ALTER TABLE "admission_requests" DROP COLUMN "pay_date";`)
}

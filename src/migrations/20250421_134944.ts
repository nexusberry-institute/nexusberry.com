import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-21T13:49:42.995Z';
  ALTER TABLE "users" ADD COLUMN "_verified" boolean;
  ALTER TABLE "users" ADD COLUMN "_verificationtoken" varchar;
  ALTER TABLE "students" ADD COLUMN "otp" varchar;
  ALTER TABLE "students" ADD COLUMN "otp_verified" boolean;
  ALTER TABLE "students" ADD COLUMN "otp_generated_at" timestamp(3) with time zone;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "placeholder" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-03-24T00:13:40.289Z';
  ALTER TABLE "users" DROP COLUMN IF EXISTS "_verified";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "_verificationtoken";
  ALTER TABLE "students" DROP COLUMN IF EXISTS "otp";
  ALTER TABLE "students" DROP COLUMN IF EXISTS "otp_verified";
  ALTER TABLE "students" DROP COLUMN IF EXISTS "otp_generated_at";
  ALTER TABLE "forms_blocks_select" DROP COLUMN IF EXISTS "placeholder";`)
}

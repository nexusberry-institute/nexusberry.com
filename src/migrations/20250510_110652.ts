import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_provider" AS ENUM('local', 'google');
  ALTER TABLE "discount_codes" ALTER COLUMN "code" SET DEFAULT 'NEXUS-HBMB98eagd';
  ALTER TABLE "class_links" ALTER COLUMN "expiry" SET DEFAULT '2025-05-10T13:06:49.837Z';
  ALTER TABLE "students" ALTER COLUMN "full_name" DROP NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-05-10T11:06:49.837Z';
  ALTER TABLE "users" ADD COLUMN "gmail_username" varchar DEFAULT 'N/A';
  ALTER TABLE "users" ADD COLUMN "provider" "enum_users_provider" DEFAULT 'local';
  ALTER TABLE "students" ADD COLUMN "gmail_username" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "discount_codes" ALTER COLUMN "code" SET DEFAULT 'NEXUS-LL4DV50dis';
  ALTER TABLE "class_links" ALTER COLUMN "expiry" SET DEFAULT '2025-05-10T10:36:02.548Z';
  ALTER TABLE "students" ALTER COLUMN "full_name" SET NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-05-10T08:36:02.547Z';
  ALTER TABLE "users" DROP COLUMN IF EXISTS "gmail_username";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "provider";
  ALTER TABLE "students" DROP COLUMN IF EXISTS "gmail_username";
  DROP TYPE "public"."enum_users_provider";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "discount_codes" ALTER COLUMN "code" DROP DEFAULT;
  ALTER TABLE "attendance" ALTER COLUMN "expiry" DROP DEFAULT;
  ALTER TABLE "attendance" ALTER COLUMN "date" DROP DEFAULT;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "discount_codes" ALTER COLUMN "code" SET DEFAULT 'NEXUS-KN27JR3lgv';
  ALTER TABLE "attendance" ALTER COLUMN "expiry" SET DEFAULT '2026-02-23T10:31:24.271Z';
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2026-02-23T08:31:24.271Z';`)
}

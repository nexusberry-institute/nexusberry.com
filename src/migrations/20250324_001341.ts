import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" RENAME COLUMN "start_time" TO "start_date_time";
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-03-24T00:13:40.289Z';
  ALTER TABLE "events" DROP COLUMN IF EXISTS "date";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-03-18T19:14:34.200Z';
  ALTER TABLE "events" ADD COLUMN "date" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "events" ADD COLUMN "start_time" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "events" DROP COLUMN IF EXISTS "start_date_time";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-23T11:41:33.978Z';
  ALTER TABLE "web_courses" ADD COLUMN "description" jsonb;
  ALTER TABLE "redirects_rels" ADD COLUMN "departments_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "web_courses_id" integer;
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_web_courses_fk" FOREIGN KEY ("web_courses_id") REFERENCES "public"."web_courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "redirects_rels_departments_id_idx" ON "redirects_rels" USING btree ("departments_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_web_courses_id_idx" ON "redirects_rels" USING btree ("web_courses_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_departments_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_web_courses_fk";
  
  DROP INDEX IF EXISTS "redirects_rels_departments_id_idx";
  DROP INDEX IF EXISTS "redirects_rels_web_courses_id_idx";
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-23T10:27:04.896Z';
  ALTER TABLE "web_courses" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "departments_id";
  ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "web_courses_id";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "sops" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "sops_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "discount_codes" ALTER COLUMN "code" SET DEFAULT 'NEXUS-LL4DV50dis';
  ALTER TABLE "class_links" ALTER COLUMN "expiry" SET DEFAULT '2025-05-10T10:36:02.548Z';
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-05-10T08:36:02.547Z';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sops_id" integer;
  DO $$ BEGIN
   ALTER TABLE "sops_texts" ADD CONSTRAINT "sops_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sops"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "sops_updated_at_idx" ON "sops" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "sops_created_at_idx" ON "sops" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "sops_texts_order_parent_idx" ON "sops_texts" USING btree ("order","parent_id");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sops_fk" FOREIGN KEY ("sops_id") REFERENCES "public"."sops"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sops_id_idx" ON "payload_locked_documents_rels" USING btree ("sops_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sops" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sops_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sops" CASCADE;
  DROP TABLE "sops_texts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sops_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_sops_id_idx";
  ALTER TABLE "discount_codes" ALTER COLUMN "code" SET DEFAULT 'NEXUS-ALWP34qtfd';
  ALTER TABLE "class_links" ALTER COLUMN "expiry" SET DEFAULT '2025-05-05T08:42:16.825Z';
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-05-05T06:42:16.825Z';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "sops_id";`)
}

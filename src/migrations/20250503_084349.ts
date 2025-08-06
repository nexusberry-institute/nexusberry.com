import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "class_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"classlink" varchar NOT NULL,
  	"expiry" timestamp(3) with time zone DEFAULT '2025-05-03T10:43:47.006Z',
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "class_links_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"batches_id" integer,
  	"users_id" integer
  );
  
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-05-03T08:43:47.006Z';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "class_links_id" integer;
  DO $$ BEGIN
   ALTER TABLE "class_links_rels" ADD CONSTRAINT "class_links_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."class_links"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "class_links_rels" ADD CONSTRAINT "class_links_rels_batches_fk" FOREIGN KEY ("batches_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "class_links_rels" ADD CONSTRAINT "class_links_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "class_links_updated_at_idx" ON "class_links" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "class_links_created_at_idx" ON "class_links" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "class_links_rels_order_idx" ON "class_links_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "class_links_rels_parent_idx" ON "class_links_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "class_links_rels_path_idx" ON "class_links_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "class_links_rels_batches_id_idx" ON "class_links_rels" USING btree ("batches_id");
  CREATE INDEX IF NOT EXISTS "class_links_rels_users_id_idx" ON "class_links_rels" USING btree ("users_id");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_class_links_fk" FOREIGN KEY ("class_links_id") REFERENCES "public"."class_links"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_class_links_id_idx" ON "payload_locked_documents_rels" USING btree ("class_links_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "class_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "class_links_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "class_links" CASCADE;
  DROP TABLE "class_links_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_class_links_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_class_links_id_idx";
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-26T07:59:57.890Z';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "class_links_id";`)
}

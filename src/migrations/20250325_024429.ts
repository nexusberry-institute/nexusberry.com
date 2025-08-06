import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "event_registrations_registered_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"has_attended" boolean DEFAULT false
  );
  
  ALTER TABLE "event_registrations_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "event_registrations_rels" CASCADE;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-03-25T02:44:26.707Z';
  ALTER TABLE "events" ADD COLUMN "live_stream_link" varchar;
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
  
  CREATE INDEX IF NOT EXISTS "event_registrations_registered_events_order_idx" ON "event_registrations_registered_events" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "event_registrations_registered_events_parent_id_idx" ON "event_registrations_registered_events" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "event_registrations_registered_events_event_idx" ON "event_registrations_registered_events" USING btree ("event_id");`)
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
  
  ALTER TABLE "event_registrations_registered_events" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "event_registrations_registered_events" CASCADE;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-03-24T00:13:40.289Z';
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
  
  CREATE INDEX IF NOT EXISTS "event_registrations_rels_order_idx" ON "event_registrations_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "event_registrations_rels_parent_idx" ON "event_registrations_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "event_registrations_rels_path_idx" ON "event_registrations_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "event_registrations_rels_events_id_idx" ON "event_registrations_rels" USING btree ("events_id");
  ALTER TABLE "events" DROP COLUMN IF EXISTS "live_stream_link";`)
}

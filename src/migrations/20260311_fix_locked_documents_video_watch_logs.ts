import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add missing tutorial_video_watch_logs_id column to payload_locked_documents_rels
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "tutorial_video_watch_logs_id" integer;
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_tutorial_video_watch_logs_fk"
      FOREIGN KEY ("tutorial_video_watch_logs_id") REFERENCES "tutorial_video_watch_logs"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tutorial_video_watch_logs_idx"
      ON "payload_locked_documents_rels" USING btree ("tutorial_video_watch_logs_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "tutorial_video_watch_logs_id";
  `)
}

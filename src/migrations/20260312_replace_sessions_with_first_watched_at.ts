import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tutorial_video_watch_logs"
      ADD COLUMN IF NOT EXISTS "first_watched_at" timestamp(3) with time zone;
  `)

  // Backfill: use created_at as a reasonable approximation for existing rows
  await db.execute(sql`
    UPDATE "tutorial_video_watch_logs"
      SET "first_watched_at" = "created_at"
      WHERE "first_watched_at" IS NULL;
  `)

  await db.execute(sql`
    ALTER TABLE "tutorial_video_watch_logs"
      DROP COLUMN IF EXISTS "sessions";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tutorial_video_watch_logs"
      ADD COLUMN IF NOT EXISTS "sessions" integer DEFAULT 1;
  `)

  await db.execute(sql`
    ALTER TABLE "tutorial_video_watch_logs"
      DROP COLUMN IF EXISTS "first_watched_at";
  `)
}

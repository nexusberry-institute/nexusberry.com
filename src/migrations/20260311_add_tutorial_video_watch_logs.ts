import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "tutorial_video_watch_logs" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_id" integer NOT NULL,
      "tutorial_id" integer NOT NULL,
      "video_index" integer NOT NULL,
      "total_watch_time" numeric DEFAULT 0,
      "last_watched_at" timestamp(3) with time zone,
      "sessions" integer DEFAULT 1,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    ALTER TABLE "tutorial_video_watch_logs"
      ADD CONSTRAINT "tutorial_video_watch_logs_user_id_users_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  `)

  await db.execute(sql`
    ALTER TABLE "tutorial_video_watch_logs"
      ADD CONSTRAINT "tutorial_video_watch_logs_tutorial_id_tutorials_id_fk"
      FOREIGN KEY ("tutorial_id") REFERENCES "public"."tutorials"("id") ON DELETE set null ON UPDATE no action;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tutorial_video_watch_logs_user_idx"
      ON "tutorial_video_watch_logs" USING btree ("user_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tutorial_video_watch_logs_tutorial_idx"
      ON "tutorial_video_watch_logs" USING btree ("tutorial_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tutorial_video_watch_logs_created_at_idx"
      ON "tutorial_video_watch_logs" USING btree ("created_at");
  `)

  await db.execute(sql`
    ALTER TABLE "tutorials" ADD COLUMN IF NOT EXISTS "track_video_watch" boolean DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "tutorial_video_watch_logs";
  `)

  await db.execute(sql`
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "track_video_watch";
  `)
}

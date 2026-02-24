import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Create the new enum for the videos array (safe for re-run)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_tutorials_videos_video_source" AS ENUM('youtube', 'bunny');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 2. Create the tutorials_videos child table for the array field
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "tutorials_videos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "video_source" "enum_tutorials_videos_video_source" DEFAULT 'youtube',
      "youtube_url" varchar,
      "bunny_video_id" varchar
    );
  `)

  // 3. Add indexes and foreign key for tutorials_videos (safe for re-run)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tutorials_videos_order_idx" ON "tutorials_videos" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "tutorials_videos_parent_id_idx" ON "tutorials_videos" USING btree ("_parent_id");
    DO $$ BEGIN
      ALTER TABLE "tutorials_videos" ADD CONSTRAINT "tutorials_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tutorials"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 4. Migrate existing video data from flat columns into the new array table
  //    Only runs if the old columns still exist (skips on re-run after step 6)
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tutorials' AND column_name = 'video_source') THEN
        INSERT INTO "tutorials_videos" ("_order", "_parent_id", "id", "video_source", "youtube_url", "bunny_video_id")
        SELECT
          1,
          t.id,
          gen_random_uuid()::varchar,
          t.video_source::text::enum_tutorials_videos_video_source,
          t.youtube_url,
          t.bunny_video_id
        FROM "tutorials" t
        WHERE t.video_source IS NOT NULL
          AND (t.youtube_url IS NOT NULL OR t.bunny_video_id IS NOT NULL)
          AND t.id NOT IN (SELECT _parent_id FROM "tutorials_videos");
      END IF;
    END $$;
  `)

  // 5. Add new columns to tutorials: description (jsonb), show_videos (boolean)
  await db.execute(sql`
    ALTER TABLE "tutorials" ADD COLUMN IF NOT EXISTS "description" jsonb;
    ALTER TABLE "tutorials" ADD COLUMN IF NOT EXISTS "show_videos" boolean DEFAULT true;
  `)

  // 6. Drop old flat video columns from tutorials
  await db.execute(sql`
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "video_source";
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "youtube_url";
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "bunny_video_id";
  `)

  // 7. Drop old enum
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_tutorials_video_source";
  `)

  // 8. Add instructions column to quizzes
  await db.execute(sql`
    ALTER TABLE "quizzes" ADD COLUMN IF NOT EXISTS "instructions" jsonb;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // 1. Re-create old enum
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_tutorials_video_source" AS ENUM('youtube', 'bunny');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 2. Add back flat video columns to tutorials
  await db.execute(sql`
    ALTER TABLE "tutorials" ADD COLUMN IF NOT EXISTS "video_source" "enum_tutorials_video_source" DEFAULT 'youtube';
    ALTER TABLE "tutorials" ADD COLUMN IF NOT EXISTS "youtube_url" varchar;
    ALTER TABLE "tutorials" ADD COLUMN IF NOT EXISTS "bunny_video_id" varchar;
  `)

  // 3. Migrate data back from array table to flat columns (take first video per tutorial)
  await db.execute(sql`
    UPDATE "tutorials" t
    SET
      video_source = v.video_source::text::enum_tutorials_video_source,
      youtube_url = v.youtube_url,
      bunny_video_id = v.bunny_video_id
    FROM (
      SELECT DISTINCT ON (_parent_id) _parent_id, video_source, youtube_url, bunny_video_id
      FROM "tutorials_videos"
      ORDER BY _parent_id, _order
    ) v
    WHERE t.id = v._parent_id;
  `)

  // 4. Drop new columns from tutorials
  await db.execute(sql`
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "show_videos";
  `)

  // 5. Drop the videos array table
  await db.execute(sql`
    DROP TABLE IF EXISTS "tutorials_videos";
  `)

  // 6. Drop the new enum
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_tutorials_videos_video_source";
  `)

  // 7. Drop instructions from quizzes
  await db.execute(sql`
    ALTER TABLE "quizzes" DROP COLUMN IF EXISTS "instructions";
  `)
}

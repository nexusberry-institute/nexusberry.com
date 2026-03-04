import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tutorials"
      ADD COLUMN IF NOT EXISTS "meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "meta_image_id" integer,
      ADD COLUMN IF NOT EXISTS "meta_description" varchar;
  `)

  await db.execute(sql`
    ALTER TABLE "tutorials"
      ADD CONSTRAINT "tutorials_meta_image_id_media_id_fk"
      FOREIGN KEY ("meta_image_id") REFERENCES "media"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "tutorials_meta_meta_image_idx"
      ON "tutorials" USING btree ("meta_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "tutorials_meta_meta_image_idx";
  `)

  await db.execute(sql`
    ALTER TABLE "tutorials"
      DROP CONSTRAINT IF EXISTS "tutorials_meta_image_id_media_id_fk";
  `)

  await db.execute(sql`
    ALTER TABLE "tutorials"
      DROP COLUMN IF EXISTS "meta_title",
      DROP COLUMN IF EXISTS "meta_image_id",
      DROP COLUMN IF EXISTS "meta_description";
  `)
}

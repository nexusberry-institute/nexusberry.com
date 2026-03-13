import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create main home_page table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page" (
      "id" serial PRIMARY KEY NOT NULL,
      "departments_section_heading" varchar,
      "departments_section_description" varchar,
      "departments_section_button_label" varchar,
      "departments_section_button_link" varchar,
      "courses_section_enabled" boolean DEFAULT true,
      "events_section_enabled" boolean DEFAULT true,
      "events_section_badge_text" varchar,
      "events_section_heading" varchar,
      "events_section_description" varchar,
      "events_section_cta_heading" varchar,
      "events_section_cta_description" varchar,
      "events_section_button_text" varchar,
      "events_section_button_link" varchar,
      "location_section_enabled" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Create hero featured images array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page_hero_featured_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "alt" varchar,
      "link" varchar
    );
  `)

  // Create hero logo carousel array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "home_page_hero_logo_carousel" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "image_id" integer,
      "link" varchar
    );
  `)

  // Add foreign keys
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_hero_featured_images"
        ADD CONSTRAINT "home_page_hero_featured_images_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_hero_featured_images"
        ADD CONSTRAINT "home_page_hero_featured_images_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "home_page"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_hero_logo_carousel"
        ADD CONSTRAINT "home_page_hero_logo_carousel_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page_hero_logo_carousel"
        ADD CONSTRAINT "home_page_hero_logo_carousel_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "home_page"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  // Add indexes for ordering
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_hero_featured_images_order_idx"
      ON "home_page_hero_featured_images" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_hero_featured_images_parent_id_idx"
      ON "home_page_hero_featured_images" USING btree ("_parent_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_hero_logo_carousel_order_idx"
      ON "home_page_hero_logo_carousel" USING btree ("_order");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_hero_logo_carousel_parent_id_idx"
      ON "home_page_hero_logo_carousel" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_hero_featured_images";`)
  await db.execute(sql`DROP TABLE IF EXISTS "home_page_hero_logo_carousel";`)
  await db.execute(sql`DROP TABLE IF EXISTS "home_page";`)
}

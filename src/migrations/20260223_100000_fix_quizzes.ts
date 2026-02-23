import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Drop all old quizzes-related tables (no data to preserve)
  await db.execute(sql`
    DROP TABLE IF EXISTS "quizzes_rels" CASCADE;
    DROP TABLE IF EXISTS "quizzes_texts" CASCADE;
    DROP TABLE IF EXISTS "quizzes" CASCADE;
  `)

  // Recreate quizzes table with correct column names
  await db.execute(sql`
    CREATE TABLE "quizzes" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "thumbnail_id" integer,
      "visible" boolean DEFAULT false,
      "status" boolean DEFAULT false,
      "slug" varchar,
      "slug_lock" boolean DEFAULT true,
      "module_id" integer,
      "module_topic_id" integer,
      "lecture_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Create quizzes_texts table (for tags hasMany text field)
  await db.execute(sql`
    CREATE TABLE "quizzes_texts" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "text" varchar
    );
  `)

  // Create quizzes_rels table (for questions relationship)
  await db.execute(sql`
    CREATE TABLE "quizzes_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "quiz_questions_id" integer
    );
  `)

  // Foreign keys for quizzes
  await db.execute(sql`
    ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_module_topic_id_module_topics_id_fk" FOREIGN KEY ("module_topic_id") REFERENCES "public"."module_topics"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lecture_id_lectures_id_fk" FOREIGN KEY ("lecture_id") REFERENCES "public"."lectures"("id") ON DELETE set null ON UPDATE no action;
  `)

  // Foreign keys for quizzes_texts
  await db.execute(sql`
    ALTER TABLE "quizzes_texts" ADD CONSTRAINT "quizzes_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
  `)

  // Foreign keys for quizzes_rels
  await db.execute(sql`
    ALTER TABLE "quizzes_rels" ADD CONSTRAINT "quizzes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "quizzes_rels" ADD CONSTRAINT "quizzes_rels_quiz_questions_fk" FOREIGN KEY ("quiz_questions_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
  `)

  // Indexes for quizzes
  await db.execute(sql`
    CREATE INDEX "quizzes_thumbnail_idx" ON "quizzes" USING btree ("thumbnail_id");
    CREATE INDEX "quizzes_slug_idx" ON "quizzes" USING btree ("slug");
    CREATE INDEX "quizzes_module_idx" ON "quizzes" USING btree ("module_id");
    CREATE INDEX "quizzes_module_topic_idx" ON "quizzes" USING btree ("module_topic_id");
    CREATE INDEX "quizzes_lecture_idx" ON "quizzes" USING btree ("lecture_id");
    CREATE INDEX "quizzes_updated_at_idx" ON "quizzes" USING btree ("updated_at");
    CREATE INDEX "quizzes_created_at_idx" ON "quizzes" USING btree ("created_at");
  `)

  // Indexes for quizzes_texts
  await db.execute(sql`
    CREATE INDEX "quizzes_texts_order_parent" ON "quizzes_texts" USING btree ("order", "parent_id");
  `)

  // Indexes for quizzes_rels
  await db.execute(sql`
    CREATE INDEX "quizzes_rels_order_idx" ON "quizzes_rels" USING btree ("order");
    CREATE INDEX "quizzes_rels_parent_idx" ON "quizzes_rels" USING btree ("parent_id");
    CREATE INDEX "quizzes_rels_path_idx" ON "quizzes_rels" USING btree ("path");
    CREATE INDEX "quizzes_rels_quiz_questions_id_idx" ON "quizzes_rels" USING btree ("quiz_questions_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "quizzes_rels" CASCADE;
    DROP TABLE IF EXISTS "quizzes_texts" CASCADE;
    DROP TABLE IF EXISTS "quizzes" CASCADE;
  `)
}

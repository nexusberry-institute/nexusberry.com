import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Add father_name column to students
  await db.execute(sql`
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "father_name" varchar;
  `)

  // 2. Create users_rels table (trialTutorials moved from students to users)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "users_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "tutorials_id" integer
    );
    CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "users_rels_tutorials_id_idx" ON "users_rels" USING btree ("tutorials_id");
    DO $$ BEGIN
      ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_tutorials_fk"
        FOREIGN KEY ("tutorials_id") REFERENCES "public"."tutorials"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 3. Drop students_rels table (no longer needed — trialTutorials moved to users)
  await db.execute(sql`
    DROP TABLE IF EXISTS "students_rels" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // 1. Recreate students_rels table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "students_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "tutorials_id" integer
    );
    CREATE INDEX IF NOT EXISTS "students_rels_order_idx" ON "students_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "students_rels_parent_idx" ON "students_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "students_rels_path_idx" ON "students_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "students_rels_tutorials_id_idx" ON "students_rels" USING btree ("tutorials_id");
    DO $$ BEGIN
      ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_tutorials_fk"
        FOREIGN KEY ("tutorials_id") REFERENCES "public"."tutorials"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  // 2. Drop users_rels table
  await db.execute(sql`
    DROP TABLE IF EXISTS "users_rels" CASCADE;
  `)

  // 3. Remove father_name column from students
  await db.execute(sql`
    ALTER TABLE "students" DROP COLUMN IF EXISTS "father_name";
  `)
}

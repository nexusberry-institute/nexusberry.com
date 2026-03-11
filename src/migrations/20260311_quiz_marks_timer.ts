import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add new fields to quizzes table
  await db.execute(sql`
    ALTER TABLE "quizzes"
      ADD COLUMN IF NOT EXISTS "save_marks" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "allow_retake" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "time_per_question" numeric DEFAULT 60;
  `)

  // Create quiz_results table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "quiz_results" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_id" integer NOT NULL,
      "quiz_id" integer NOT NULL,
      "score" numeric NOT NULL,
      "total_questions" numeric NOT NULL,
      "completed_at" timestamp(3) with time zone NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // Add foreign keys
  await db.execute(sql`
    ALTER TABLE "quiz_results"
      ADD CONSTRAINT "quiz_results_user_id_users_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
  `)

  await db.execute(sql`
    ALTER TABLE "quiz_results"
      ADD CONSTRAINT "quiz_results_quiz_id_quizzes_id_fk"
      FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
  `)

  // Add indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "quiz_results_user_idx" ON "quiz_results" USING btree ("user_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "quiz_results_quiz_idx" ON "quiz_results" USING btree ("quiz_id");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "quiz_results_updated_at_idx" ON "quiz_results" USING btree ("updated_at");
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "quiz_results_created_at_idx" ON "quiz_results" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "quiz_results";`)

  await db.execute(sql`
    ALTER TABLE "quizzes"
      DROP COLUMN IF EXISTS "save_marks",
      DROP COLUMN IF EXISTS "allow_retake",
      DROP COLUMN IF EXISTS "time_per_question";
  `)
}

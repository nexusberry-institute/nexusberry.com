import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_student_id_students_id_fk";
  `)

  await db.execute(sql`
    DROP INDEX IF EXISTS "users_student_idx";
  `)

  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "student_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "student_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "users"
        ADD CONSTRAINT "users_student_id_students_id_fk"
        FOREIGN KEY ("student_id") REFERENCES "public"."students"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "users_student_idx"
      ON "users" USING btree ("student_id");
  `)
}

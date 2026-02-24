import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop FK columns and indexes from referencing tables
  await db.execute(sql`
    ALTER TABLE IF EXISTS "quizzes"
      DROP COLUMN IF EXISTS "lecture_id";
  `)
  await db.execute(sql`
    ALTER TABLE IF EXISTS "quiz_questions"
      DROP COLUMN IF EXISTS "lecture_id";
  `)
  await db.execute(sql`
    ALTER TABLE IF EXISTS "modules_rels"
      DROP COLUMN IF EXISTS "lectures_id";
  `)
  await db.execute(sql`
    ALTER TABLE IF EXISTS "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "lectures_id";
  `)

  // Drop indexes on referencing tables
  await db.execute(sql`DROP INDEX IF EXISTS "quizzes_lecture_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "quiz_questions_lecture_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "modules_rels_lectures_id_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_lectures_id_idx";`)

  // Drop child table (lectures_rels has batches relationship)
  await db.execute(sql`DROP TABLE IF EXISTS "lectures_rels" CASCADE;`)

  // Drop parent table
  await db.execute(sql`DROP TABLE IF EXISTS "lectures" CASCADE;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Not recreating these tables on rollback — they are being permanently removed.
  // If rollback is needed, restore from a database backup.
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop FK columns from payload_locked_documents_rels
  await db.execute(sql`
    ALTER TABLE IF EXISTS "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "assignments_id",
      DROP COLUMN IF EXISTS "videos_id";
  `)

  // Drop child tables first (they have FK references to parent tables)
  await db.execute(sql`DROP TABLE IF EXISTS "assignments_questions_questions" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "assignments_texts" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "assignments_rels" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "videos_qa" CASCADE;`)

  // Drop parent tables
  await db.execute(sql`DROP TABLE IF EXISTS "assignments" CASCADE;`)
  await db.execute(sql`DROP TABLE IF EXISTS "videos" CASCADE;`)

  // Drop indexes on payload_locked_documents_rels if they exist
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_assignments_id_idx";`)
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_videos_id_idx";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Not recreating these tables on rollback — they are being permanently removed.
  // If rollback is needed, restore from a database backup.
}

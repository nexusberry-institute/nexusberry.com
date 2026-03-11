import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "quiz_results" ADD COLUMN IF NOT EXISTS "attempts" integer DEFAULT 1;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "quiz_results" DROP COLUMN IF EXISTS "attempts";
  `)
}

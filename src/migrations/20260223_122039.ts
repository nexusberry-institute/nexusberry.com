import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tutorials" ADD COLUMN "show_quiz" boolean DEFAULT true;
  ALTER TABLE "quizzes" DROP COLUMN "visible";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "quizzes" ADD COLUMN "visible" boolean DEFAULT false;
  ALTER TABLE "tutorials" DROP COLUMN "show_quiz";`)
}

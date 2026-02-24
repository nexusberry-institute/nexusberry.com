import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tutorials" ADD COLUMN IF NOT EXISTS "show_code" boolean DEFAULT true;
    ALTER TABLE "tutorials" ADD COLUMN IF NOT EXISTS "show_presentation" boolean DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "show_code";
    ALTER TABLE "tutorials" DROP COLUMN IF EXISTS "show_presentation";
  `)
}

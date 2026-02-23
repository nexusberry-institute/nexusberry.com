import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Baseline migration — no-op.
  // Schema already exists in database (previously managed via db push).
  // This migration establishes the Drizzle JSON snapshot as the
  // reference point for all future migrations.
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Baseline migration — cannot be rolled back.
}

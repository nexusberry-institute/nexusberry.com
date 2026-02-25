import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// No-op — this migration exists only to generate the Drizzle .json snapshot.
// All actual schema changes are in 20260225_users_students_cleanup.ts.

export async function up({}: MigrateUpArgs): Promise<void> {}
export async function down({}: MigrateDownArgs): Promise<void> {}

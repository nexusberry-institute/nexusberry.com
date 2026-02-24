import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// No-op migration — exists only to anchor the Drizzle JSON snapshot.
// The actual schema changes are applied by the preceding manual migrations
// and by 20260225_add_enrollments_tutorial_access_rename_user_role.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Intentionally empty
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Intentionally empty
}

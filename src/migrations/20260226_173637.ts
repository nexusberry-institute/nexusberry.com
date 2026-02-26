import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "admission_requests" ADD COLUMN "total_fee_package" numeric NOT NULL;
  ALTER TABLE "admission_requests" ADD COLUMN "remaining_installments" numeric NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "admission_requests" DROP COLUMN "total_fee_package";
  ALTER TABLE "admission_requests" DROP COLUMN "remaining_installments";`)
}

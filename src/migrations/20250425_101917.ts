import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fee_receipts" ALTER COLUMN "pay_date" DROP NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-25T10:19:14.195Z';
  ALTER TABLE "public"."fee_receipts" ALTER COLUMN "paid_method" SET DATA TYPE text;
  DROP TYPE "public"."enum_fee_receipts_paid_method";
  CREATE TYPE "public"."enum_fee_receipts_paid_method" AS ENUM('BANK', 'CASH', 'JAZZCASH', 'EASYPAISA');
  ALTER TABLE "public"."fee_receipts" ALTER COLUMN "paid_method" SET DATA TYPE "public"."enum_fee_receipts_paid_method" USING "paid_method"::"public"."enum_fee_receipts_paid_method";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fee_receipts" ALTER COLUMN "pay_date" SET NOT NULL;
  ALTER TABLE "attendance" ALTER COLUMN "date" SET DEFAULT '2025-04-23T11:41:33.978Z';
  ALTER TABLE "public"."fee_receipts" ALTER COLUMN "paid_method" SET DATA TYPE text;
  DROP TYPE "public"."enum_fee_receipts_paid_method";
  CREATE TYPE "public"."enum_fee_receipts_paid_method" AS ENUM('BANK', 'CASH', 'JAZZCASH', 'EASYPISA');
  ALTER TABLE "public"."fee_receipts" ALTER COLUMN "paid_method" SET DATA TYPE "public"."enum_fee_receipts_paid_method" USING "paid_method"::"public"."enum_fee_receipts_paid_method";`)
}

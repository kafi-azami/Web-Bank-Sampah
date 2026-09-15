/*
  Warnings:

  - The values [DIPROSES] on the enum `DepositStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DepositStatus_new" AS ENUM ('BELUM_DIKONFIRMASI', 'DIVERIFIKASI', 'SELESAI', 'DITOLAK');
ALTER TABLE "setor_sampah" ALTER COLUMN "status" TYPE "DepositStatus_new" USING ("status"::text::"DepositStatus_new");
ALTER TYPE "DepositStatus" RENAME TO "DepositStatus_old";
ALTER TYPE "DepositStatus_new" RENAME TO "DepositStatus";
DROP TYPE "public"."DepositStatus_old";
COMMIT;

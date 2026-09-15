/*
  Warnings:

  - You are about to drop the column `setoran_id` on the `penukaran_poin` table. All the data in the column will be lost.
  - Added the required column `nasabah_id` to the `penukaran_poin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "penukaran_poin" DROP CONSTRAINT "penukaran_poin_setoran_id_fkey";

-- DropIndex
DROP INDEX "penukaran_poin_setoran_id_key";

-- AlterTable
ALTER TABLE "penukaran_poin" DROP COLUMN "setoran_id",
ADD COLUMN     "nasabah_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "penukaran_poin_nasabah_id_tanggal_idx" ON "penukaran_poin"("nasabah_id", "tanggal");

-- AddForeignKey
ALTER TABLE "penukaran_poin" ADD CONSTRAINT "penukaran_poin_nasabah_id_fkey" FOREIGN KEY ("nasabah_id") REFERENCES "nasabah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

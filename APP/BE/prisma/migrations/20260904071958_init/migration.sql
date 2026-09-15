-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN_BANK', 'NASABAH');

-- CreateEnum
CREATE TYPE "WasteType" AS ENUM ('PLASTIK', 'KERTAS', 'LOGAM', 'KACA');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('BELUM_DIKONFIRMASI', 'DIPROSES', 'SELESAI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "RedemptionStatus" AS ENUM ('DIPROSES', 'SELESAI');

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "app_key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nama_siswa" VARCHAR(100) NOT NULL,
    "kelas" VARCHAR(50) NOT NULL,
    "nama_app" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,
    "restored_at" TIMESTAMP(3),
    "restored_by" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nasabah" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nama_nasabah" VARCHAR(100) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "saldo_poin" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "photo" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,
    "restored_at" TIMESTAMP(3),
    "restored_by" UUID,

    CONSTRAINT "nasabah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_bank" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nama_unit" VARCHAR(100) NOT NULL,
    "nama_pengelola" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,
    "restored_at" TIMESTAMP(3),
    "restored_by" UUID,

    CONSTRAINT "admin_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_sampah" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "nama_kategori" VARCHAR(100) NOT NULL,
    "harga_per_kg" DECIMAL(14,2) NOT NULL,
    "poin_per_kg" DECIMAL(14,2) NOT NULL,
    "jenis" "WasteType" NOT NULL,
    "photo" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,
    "restored_at" TIMESTAMP(3),
    "restored_by" UUID,

    CONSTRAINT "kategori_sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setor_sampah" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "nasabah_id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "kode_setor" VARCHAR(30) NOT NULL,
    "catatan" TEXT,
    "catatan_admin" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "DepositStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,
    "restored_at" TIMESTAMP(3),
    "restored_by" UUID,

    CONSTRAINT "setor_sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_setor" (
    "id" UUID NOT NULL,
    "setoran_id" UUID NOT NULL,
    "kategori_sampah_id" UUID NOT NULL,
    "berat_kg" DECIMAL(10,3) NOT NULL,
    "berat_kg_real" DECIMAL(10,3),
    "subtotal_poin" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,
    "restored_at" TIMESTAMP(3),
    "restored_by" UUID,

    CONSTRAINT "detail_setor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadiah" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "nama_hadiah" VARCHAR(100) NOT NULL,
    "poin_dibutuhkan" DECIMAL(14,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "photo" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,
    "restored_at" TIMESTAMP(3),
    "restored_by" UUID,

    CONSTRAINT "hadiah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penukaran_poin" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "setoran_id" UUID NOT NULL,
    "hadiah_id" UUID NOT NULL,
    "kode_penukaran" VARCHAR(30) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "poin_terpakai" DECIMAL(14,2) NOT NULL,
    "status" "RedemptionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,
    "restored_at" TIMESTAMP(3),
    "restored_by" UUID,

    CONSTRAINT "penukaran_poin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_app_key_key" ON "tenants"("app_key");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_email_key" ON "tenants"("email");

-- CreateIndex
CREATE INDEX "users_tenant_id_role_idx" ON "users"("tenant_id", "role");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenant_id_username_key" ON "users"("tenant_id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "nasabah_user_id_key" ON "nasabah"("user_id");

-- CreateIndex
CREATE INDEX "nasabah_tenant_id_nama_nasabah_idx" ON "nasabah"("tenant_id", "nama_nasabah");

-- CreateIndex
CREATE UNIQUE INDEX "admin_bank_user_id_key" ON "admin_bank"("user_id");

-- CreateIndex
CREATE INDEX "admin_bank_tenant_id_nama_unit_idx" ON "admin_bank"("tenant_id", "nama_unit");

-- CreateIndex
CREATE INDEX "kategori_sampah_tenant_id_jenis_idx" ON "kategori_sampah"("tenant_id", "jenis");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_sampah_tenant_id_nama_kategori_key" ON "kategori_sampah"("tenant_id", "nama_kategori");

-- CreateIndex
CREATE INDEX "setor_sampah_tenant_id_status_idx" ON "setor_sampah"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "setor_sampah_nasabah_id_tanggal_idx" ON "setor_sampah"("nasabah_id", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "setor_sampah_tenant_id_kode_setor_key" ON "setor_sampah"("tenant_id", "kode_setor");

-- CreateIndex
CREATE INDEX "detail_setor_setoran_id_idx" ON "detail_setor"("setoran_id");

-- CreateIndex
CREATE INDEX "detail_setor_kategori_sampah_id_idx" ON "detail_setor"("kategori_sampah_id");

-- CreateIndex
CREATE INDEX "hadiah_tenant_id_stock_idx" ON "hadiah"("tenant_id", "stock");

-- CreateIndex
CREATE UNIQUE INDEX "hadiah_tenant_id_nama_hadiah_key" ON "hadiah"("tenant_id", "nama_hadiah");

-- CreateIndex
CREATE UNIQUE INDEX "penukaran_poin_setoran_id_key" ON "penukaran_poin"("setoran_id");

-- CreateIndex
CREATE INDEX "penukaran_poin_tenant_id_status_idx" ON "penukaran_poin"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "penukaran_poin_hadiah_id_tanggal_idx" ON "penukaran_poin"("hadiah_id", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "penukaran_poin_tenant_id_kode_penukaran_key" ON "penukaran_poin"("tenant_id", "kode_penukaran");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nasabah" ADD CONSTRAINT "nasabah_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nasabah" ADD CONSTRAINT "nasabah_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_bank" ADD CONSTRAINT "admin_bank_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_bank" ADD CONSTRAINT "admin_bank_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kategori_sampah" ADD CONSTRAINT "kategori_sampah_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setor_sampah" ADD CONSTRAINT "setor_sampah_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setor_sampah" ADD CONSTRAINT "setor_sampah_nasabah_id_fkey" FOREIGN KEY ("nasabah_id") REFERENCES "nasabah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setor_sampah" ADD CONSTRAINT "setor_sampah_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin_bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_setor" ADD CONSTRAINT "detail_setor_setoran_id_fkey" FOREIGN KEY ("setoran_id") REFERENCES "setor_sampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_setor" ADD CONSTRAINT "detail_setor_kategori_sampah_id_fkey" FOREIGN KEY ("kategori_sampah_id") REFERENCES "kategori_sampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadiah" ADD CONSTRAINT "hadiah_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penukaran_poin" ADD CONSTRAINT "penukaran_poin_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penukaran_poin" ADD CONSTRAINT "penukaran_poin_setoran_id_fkey" FOREIGN KEY ("setoran_id") REFERENCES "setor_sampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penukaran_poin" ADD CONSTRAINT "penukaran_poin_hadiah_id_fkey" FOREIGN KEY ("hadiah_id") REFERENCES "hadiah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

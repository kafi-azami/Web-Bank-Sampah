import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { HashingService } from '../../shared/hashing/hashing.service.js';

@Injectable()
export class SeedService {
    constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
  ) {}

  async run(tenantId: string) {
    const existing = await this.prisma.user.findFirst({ where: { tenantId } });
    if (existing) {
      throw new BadRequestException(
        'Data sudah pernah di-seed untuk App Key ini. Hapus data manual jika ingin seed ulang.',
      );
    }

    const adminPassword = await this.hashing.hash('admin123');
    const nasabahPassword = await this.hashing.hash('password123');

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Admin
      const adminUser = await tx.user.create({
        data: {
          tenantId,
          username: 'admin_banksampah',
          password: adminPassword,
          role: 'ADMIN_BANK',
        },
      });
      const admin = await tx.adminBank.create({
        data: {
          tenantId,
          userId: adminUser.id,
          unitName: 'Bank Sampah Asri Jaya',
          managerName: 'Bapak H. Sukirman',
          phone: '081234567890',
        },
      });

      // 2. Nasabah 1 & 2
      const nasabah1User = await tx.user.create({
        data: {
          tenantId,
          username: 'nasabah_budi',
          password: nasabahPassword,
          role: 'NASABAH',
        },
      });
      const nasabah1 = await tx.customer.create({
        data: {
          tenantId,
          userId: nasabah1User.id,
          name: 'Budi Santoso',
          address: 'Jl. Merdeka No. 12, RT 03/05',
          phone: '085678901234',
          pointBalance: 150,
        },
      });

      const nasabah2User = await tx.user.create({
        data: {
          tenantId,
          username: 'nasabah_siti',
          password: nasabahPassword,
          role: 'NASABAH',
        },
      });
      const nasabah2 = await tx.customer.create({
        data: {
          tenantId,
          userId: nasabah2User.id,
          name: 'Siti Aminah',
          address: 'Jl. Mawar Indah No. 45',
          phone: '081987654321',
          pointBalance: 80,
        },
      });

      // 3. Kategori sampah (4)
      const kategoriData = [
        { name: 'Botol Plastik PET (Bersih)', pricePerKg: 3500, pointPerKg: 10, type: 'PLASTIK' as const },
        { name: 'Kardus & Karton Bekas', pricePerKg: 2000, pointPerKg: 5, type: 'KERTAS' as const },
        { name: 'Kaleng Aluminium / Minuman', pricePerKg: 12000, pointPerKg: 30, type: 'LOGAM' as const },
        { name: 'Botol Kaca Bening', pricePerKg: 1500, pointPerKg: 4, type: 'KACA' as const },
      ];
      const kategoriList = await Promise.all(
        kategoriData.map((k) => tx.wasteCategory.create({ data: { tenantId, ...k } })),
      );

      // 4. Hadiah (3)
      const hadiahData = [
        { name: 'Voucher Pulsa / E-Wallet Rp 25.000', pointsRequired: 75, stock: 50 },
        { name: 'Minyak Goreng Bimoli 1 Liter', pointsRequired: 100, stock: 25 },
        { name: 'Beras Super Pulen 2.5 Kg', pointsRequired: 180, stock: 15 },
      ];
      await Promise.all(
        hadiahData.map((h) => tx.reward.create({ data: { tenantId, ...h } })),
      );

      // 5. Riwayat transaksi setor (1 selesai, untuk nasabah 1)
      const deposit = await tx.deposit.create({
        data: {
          tenantId,
          customerId: nasabah1.id,
          adminId: admin.id,
          kodeSetor: 'STR-SEED-1001',
          depositedAt: new Date(),
          catatan: 'Data dummy hasil seed',
          catatanAdmin: 'Diverifikasi otomatis oleh seed',
          status: 'SELESAI',
        },
      });
      await tx.depositDetail.create({
        data: {
          depositId: deposit.id,
          categoryId: kategoriList[0].id,
          weightKg: 10,
          weightKgReal: 10,
          subtotalPoint: 100,
        },
      });

      // 6. Riwayat penukaran poin (1 selesai, untuk nasabah 1)
      await tx.pointRedemption.create({
        data: {
          tenantId,
          customerId: nasabah1.id,
          rewardId: (await tx.reward.findFirst({ where: { tenantId, name: hadiahData[0].name } }))!.id,
          kodePenukaran: 'TKR-SEED-5001',
          pointsUsed: 75,
          status: 'SELESAI',
        },
      });

      return { admin, nasabah1, nasabah2, kategoriCount: kategoriList.length };
    });

    return {
      admin: {
        username: 'admin_banksampah',
        password: 'admin123',
        namaUnit: result.admin.unitName,
      },
      nasabah1: {
        username: 'nasabah_budi',
        password: 'password123',
        namaNasabah: result.nasabah1.name,
        saldoPoin: Number(result.nasabah1.pointBalance),
      },
      nasabah2: {
        username: 'nasabah_siti',
        password: 'password123',
        namaNasabah: result.nasabah2.name,
        saldoPoin: Number(result.nasabah2.pointBalance),
      },
      kategoriSampahCount: result.kategoriCount,
      hadiahKatalogCount: 3,
    };
  }
}

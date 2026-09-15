import { Injectable,BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class RekapitulasiService {
    constructor(private readonly prisma: PrismaService) {}

  async bulanan(tenantId: string, bulan: string) {
    if (!bulan || !/^\d{4}-\d{2}$/.test(bulan)) {
      throw new BadRequestException('Parameter bulan wajib diisi dengan format YYYY-MM.');
    }

    const [year, month] = bulan.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Ambil semua detail setoran yang statusnya SELESAI di bulan tsb
    const details = await this.prisma.depositDetail.findMany({
      where: {
        deposit: {
          tenantId,
          status: 'SELESAI',
          depositedAt: { gte: startDate, lt: endDate },
          deletedAt: null,
        },
        deletedAt: null,
      },
      include: { category: true },
    });

    const breakdown: Record<string, { tonaseKg: number; rupiah: number; poin: number }> = {
      plastik: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kertas: { tonaseKg: 0, rupiah: 0, poin: 0 },
      logam: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kaca: { tonaseKg: 0, rupiah: 0, poin: 0 },
    };

    let totalKg = 0;
    let totalPoin = 0;
    let totalRupiah = 0;

    for (const detail of details) {
      const jenis = detail.category.type.toLowerCase();
      const berat = Number(detail.weightKgReal ?? detail.weightKg);
      const rupiah = berat * Number(detail.category.pricePerKg);
      const poin = Number(detail.subtotalPoint);

      breakdown[jenis].tonaseKg += berat;
      breakdown[jenis].rupiah += rupiah;
      breakdown[jenis].poin += poin;

      totalKg += berat;
      totalPoin += poin;
      totalRupiah += rupiah;
    }

    // Rekap penukaran poin bulan yang sama
    const redemptions = await this.prisma.pointRedemption.findMany({
      where: {
        tenantId,
        redeemedAt: { gte: startDate, lt: endDate },
        deletedAt: null,
      },
    });

    const totalPoinTerpakai = redemptions.reduce(
      (sum, r) => sum + Number(r.pointsUsed),
      0,
    );

    return {
      periode: bulan,
      rekapitulasiTonase: {
        totalKg,
        totalTon: totalKg / 1000,
        totalEstimasiPembayaranRupiah: totalRupiah,
        totalPoinDiterbitkan: totalPoin,
      },
      breakdownJenisSampah: breakdown,
      rekapitulasiPenukaranPoin: {
        totalTransaksiPenukaran: redemptions.length,
        totalPoinTerpakai,
      },
    };
  }
}

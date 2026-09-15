import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {}

  async summary(tenantId: string, customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    const deposits = await this.prisma.depositDetail.findMany({
      where: {
        deposit: { tenantId, customerId, status: 'SELESAI', deletedAt: null },
        deletedAt: null,
      },
    });

    const totalSampahDisetorKg = deposits.reduce(
      (sum, d) => sum + Number(d.weightKgReal ?? d.weightKg),
      0,
    );
    const totalPoinDidapat = deposits.reduce(
      (sum, d) => sum + Number(d.subtotalPoint),
      0,
    );

    const redemptions = await this.prisma.pointRedemption.findMany({
      where: { tenantId, customerId, deletedAt: null },
    });
    const totalPoinDitukar = redemptions.reduce(
      (sum, r) => sum + Number(r.pointsUsed),
      0,
    );

    const lastDeposit = await this.prisma.deposit.findFirst({
      where: { tenantId, customerId, deletedAt: null },
      include: { details: true },
      orderBy: { depositedAt: 'desc' },
    });

    const lastRedemption = await this.prisma.pointRedemption.findFirst({
      where: { tenantId, customerId, deletedAt: null },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });

    return {
      saldoPoinSaatIni: Number(customer!.pointBalance),
      totalSampahDisetorKg,
      totalPoinDidapat,
      totalPoinDitukar,
      transaksiTerakhirSetor: lastDeposit
        ? {
            kodeSetor: lastDeposit.kodeSetor,
            tanggal: lastDeposit.depositedAt,
            beratKg: lastDeposit.details.reduce(
              (sum, d) => sum + Number(d.weightKgReal ?? d.weightKg),
              0,
            ),
            poin: lastDeposit.details.reduce(
              (sum, d) => sum + Number(d.subtotalPoint),
              0,
            ),
            status: lastDeposit.status === 'SELESAI' ? 'selesai' : lastDeposit.status.toLowerCase(),
          }
        : null,
      transaksiTerakhirTukar: lastRedemption
        ? {
            kodePenukaran: lastRedemption.kodePenukaran,
            tanggal: lastRedemption.redeemedAt,
            hadiah: lastRedemption.reward.name,
            poin: Number(lastRedemption.pointsUsed),
            status: lastRedemption.status.toLowerCase(),
          }
        : null,
    };
  }

  async stats(tenantId: string) {
    const [totalNasabah, totalKategoriSampah, totalTransaksiSetor, totalHadiah] =
      await Promise.all([
        this.prisma.customer.count({ where: { tenantId, deletedAt: null } }),
        this.prisma.wasteCategory.count({ where: { tenantId, deletedAt: null } }),
        this.prisma.deposit.count({ where: { tenantId, deletedAt: null } }),
        this.prisma.reward.count({ where: { tenantId, deletedAt: null } }),
      ]);

    const details = await this.prisma.depositDetail.findMany({
      where: {
        deposit: { tenantId, status: 'SELESAI', deletedAt: null },
        deletedAt: null,
      },
    });

    const totalBeratSampahKg = details.reduce(
      (sum, d) => sum + Number(d.weightKgReal ?? d.weightKg),
      0,
    );
    const totalPoinTersalurkan = details.reduce(
      (sum, d) => sum + Number(d.subtotalPoint),
      0,
    );

    return {
      totalNasabah,
      totalKategoriSampah,
      totalTransaksiSetor,
      totalHadiah,
      totalBeratSampahKg,
      totalPoinTersalurkan,
    };
  }
}

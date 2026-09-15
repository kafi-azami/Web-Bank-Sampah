import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePenukaranPoinDto } from './dto/create-penukaran-poin.dto.js';
import { UpdateStatusPenukaranDto } from './dto/update-status-penukaran.dto.js';
import { REDEMPTION_STATUS_MAP, REDEMPTION_STATUS_REVERSE_MAP } from './penukaran-poin.utils.js';

@Injectable()
export class PenukaranPoinService {
    constructor(private readonly prisma: PrismaService) {}

  private async generateKodePenukaran(tenantId: string, date: Date): Promise<string> {
    const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const prefix = `TKR-${yearMonth}-`;

    const count = await this.prisma.pointRedemption.count({
      where: { tenantId, kodePenukaran: { startsWith: prefix } },
    });

    return `${prefix}${5001 + count}`;
  }

  async tukar(tenantId: string, customerId: string, dto: CreatePenukaranPoinDto) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, tenantId, deletedAt: null },
    });
    if (!customer) throw new NotFoundException('Data nasabah tidak ditemukan.');

    const reward = await this.prisma.reward.findFirst({
      where: { id: dto.hadiahId, tenantId, deletedAt: null },
    });
    if (!reward) throw new NotFoundException('Hadiah tidak ditemukan.');

    if (reward.stock < 1) {
      throw new BadRequestException('Stok hadiah ini sudah habis.');
    }

    if (Number(customer.pointBalance) < Number(reward.pointsRequired)) {
      throw new BadRequestException(
        `Saldo poin Anda (${customer.pointBalance} poin) tidak mencukupi untuk menukar hadiah ini (${reward.pointsRequired} poin).`,
      );
    }

    const kodePenukaran = await this.generateKodePenukaran(tenantId, new Date());

    const redemption = await this.prisma.$transaction(async (tx) => {
      const created = await tx.pointRedemption.create({
        data: {
          tenantId,
          customerId,
          rewardId: reward.id,
          kodePenukaran,
          pointsUsed: reward.pointsRequired,
          status: 'DIPROSES',
        },
      });

      await tx.customer.update({
        where: { id: customerId },
        data: { pointBalance: { decrement: reward.pointsRequired } },
      });

      await tx.reward.update({
        where: { id: reward.id },
        data: { stock: { decrement: 1 } },
      });

      return created;
    });

    const updatedCustomer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    return {
      id: redemption.id,
      kodePenukaran: redemption.kodePenukaran,
      tanggal: redemption.redeemedAt,
      hadiahId: reward.id,
      poinTerpakai: Number(redemption.pointsUsed),
      sisaSaldoPoin: Number(updatedCustomer!.pointBalance),
      status: REDEMPTION_STATUS_MAP[redemption.status],
      hadiah: { namaHadiah: reward.name },
    };
  }

  async findMyPenukaran(tenantId: string, customerId: string) {
    const items = await this.prisma.pointRedemption.findMany({
      where: { tenantId, customerId, deletedAt: null },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      kodePenukaran: item.kodePenukaran,
      tanggal: item.redeemedAt,
      poinTerpakai: Number(item.pointsUsed),
      status: REDEMPTION_STATUS_MAP[item.status],
      hadiah: {
        namaHadiah: item.reward.name,
        poinDibutuhkan: Number(item.reward.pointsRequired),
        foto: item.reward.photo,
      },
    }));
  }

  async findAllForAdmin(tenantId: string, bulan?: string) {
    const where: any = { tenantId, deletedAt: null };
    if (bulan) {
      const [year, month] = bulan.split('-').map(Number);
      where.redeemedAt = {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      };
    }

    const items = await this.prisma.pointRedemption.findMany({
      where,
      include: { reward: true, customer: true },
      orderBy: { redeemedAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      kodePenukaran: item.kodePenukaran,
      tanggal: item.redeemedAt,
      nasabah: {
        namaNasabah: item.customer.name,
        telp: item.customer.phone,
      },
      hadiah: { namaHadiah: item.reward.name },
      poinTerpakai: Number(item.pointsUsed),
      status: REDEMPTION_STATUS_MAP[item.status],
    }));
  }

  async updateStatus(tenantId: string, id: string, dto: UpdateStatusPenukaranDto) {
    const item = await this.prisma.pointRedemption.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Transaksi penukaran poin tidak ditemukan.');

    const newStatus = REDEMPTION_STATUS_REVERSE_MAP[dto.status];
    const updated = await this.prisma.pointRedemption.update({
      where: { id },
      data: { status: newStatus as any },
    });

    return { id: updated.id, status: REDEMPTION_STATUS_MAP[updated.status] };
  }

  async findNota(tenantId: string, id: string, user: any) {
    const item = await this.prisma.pointRedemption.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { reward: true, customer: true },
    });
    if (!item) throw new NotFoundException('Nota penukaran poin tidak ditemukan.');

    if (user.role === 'NASABAH' && item.customerId !== user.customer.id) {
      throw new NotFoundException('Nota penukaran poin tidak ditemukan.');
    }

    return {
      id: item.id,
      kodePenukaran: item.kodePenukaran,
      tanggal: item.redeemedAt,
      nasabah: {
        namaNasabah: item.customer.name,
        telp: item.customer.phone,
      },
      hadiah: {
        namaHadiah: item.reward.name,
        poinDibutuhkan: Number(item.reward.pointsRequired),
      },
      poinTerpakai: Number(item.pointsUsed),
      status: REDEMPTION_STATUS_MAP[item.status],
    };
  }
}

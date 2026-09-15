import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSetorSampahDto } from './dto/create-setor-sampah.dto.js';
import { DEPOSIT_STATUS_MAP, DEPOSIT_STATUS_REVERSE_MAP } from './setor-sampah.utils.js';
import { VerifySetorSampahDto } from './dto/verify-setor-sampah.dto.js';

@Injectable()
export class SetorSampahService {
    constructor(private readonly prisma: PrismaService) {}

  private async generateKodeSetor(tenantId: string, date: Date): Promise<string> {
    const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const prefix = `STR-${yearMonth}-`;

    const count = await this.prisma.deposit.count({
      where: { tenantId, kodeSetor: { startsWith: prefix } },
    });

    return `${prefix}${1001 + count}`;
  }

  async createPengajuan(
    tenantId: string,
    customerId: string,
    dto: CreateSetorSampahDto,
  ) {
    // Ambil semua kategori sampah yang direferensikan, pastikan milik tenant ini
    const categoryIds = dto.items.map((item) => item.kategoriSampahId);
    const categories = await this.prisma.wasteCategory.findMany({
      where: { id: { in: categoryIds }, tenantId, deletedAt: null },
    });

    if (categories.length !== new Set(categoryIds).size) {
      throw new BadRequestException(
        'Salah satu atau lebih kategori sampah tidak ditemukan.',
      );
    }

    const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));
    const tanggal = new Date(dto.tanggal);
    const kodeSetor = await this.generateKodeSetor(tenantId, tanggal);

    const deposit = await this.prisma.$transaction(async (tx) => {
      const createdDeposit = await tx.deposit.create({
        data: {
          tenantId,
          customerId,
          kodeSetor,
          depositedAt: tanggal,
          catatan: dto.catatan,
          status: 'BELUM_DIKONFIRMASI',
        },
      });

      const details = await Promise.all(
        dto.items.map((item) => {
          const category = categoryMap.get(item.kategoriSampahId)!;
          const subtotalPoin = item.beratKg * Number(category.pointPerKg);

          return tx.depositDetail.create({
            data: {
              depositId: createdDeposit.id,
              categoryId: item.kategoriSampahId,
              weightKg: item.beratKg,
              subtotalPoint: subtotalPoin,
            },
          });
        }),
      );

      return { ...createdDeposit, details };
    });

    const totalBeratKg = deposit.details.reduce(
      (sum, d) => sum + Number(d.weightKg),
      0,
    );
    const estimasiTotalPoin = deposit.details.reduce(
      (sum, d) => sum + Number(d.subtotalPoint),
      0,
    );

    return {
      id: deposit.id,
      kodeSetor: deposit.kodeSetor,
      tanggal: deposit.depositedAt,
      status: DEPOSIT_STATUS_MAP[deposit.status],
      totalBeratKg,
      estimasiTotalPoin,
      catatan: deposit.catatan,
      detailSetors: deposit.details.map((d) => ({
        kategoriSampahId: d.categoryId,
        beratKg: Number(d.weightKg),
        subtotalPoin: Number(d.subtotalPoint),
      })),
    };
  }

  async findMySetor(tenantId: string, customerId: string, bulan?: string) {
  const where: any = {
    tenantId,
    customerId,
    deletedAt: null,
  };

  if (bulan) {
    const [year, month] = bulan.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    where.depositedAt = { gte: startDate, lt: endDate };
  }

  const deposits = await this.prisma.deposit.findMany({
    where,
    include: {
      details: {
        include: { category: true },
      },
    },
    orderBy: { depositedAt: 'desc' },
  });

  return deposits.map((deposit) => {
    const totalBeratKg = deposit.details.reduce(
      (sum, d) => sum + Number(d.weightKg),
      0,
    );
    const totalPoin = deposit.details.reduce(
      (sum, d) => sum + Number(d.subtotalPoint),
      0,
    );

    return {
      id: deposit.id,
      kodeSetor: deposit.kodeSetor,
      tanggal: deposit.depositedAt,
      status: DEPOSIT_STATUS_MAP[deposit.status],
      totalBeratKg,
      totalPoin,
      catatan: deposit.catatan,
      detailSetors: deposit.details.map((d) => ({
        kategoriSampahId: d.categoryId,
        beratKg: Number(d.weightKg),
        subtotalPoin: Number(d.subtotalPoint),
        kategoriSampah: {
          namaKategori: d.category.name,
          jenis: d.category.type.toLowerCase(),
        },
      })),
    };
  });
 }

 async findAllForAdmin(tenantId: string, status?: string, bulan?: string) {
  const where: any = {
    tenantId,
    deletedAt: null,
  };

  if (status) {
    where.status = DEPOSIT_STATUS_REVERSE_MAP[status];
    if (!where.status) {
      throw new BadRequestException('Status tidak valid.');
    }
  }

  if (bulan) {
    const [year, month] = bulan.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    where.depositedAt = { gte: startDate, lt: endDate };
  }

  const deposits = await this.prisma.deposit.findMany({
    where,
    include: {
      customer: true,
      details: true,
    },
    orderBy: { depositedAt: 'desc' },
  });

  return deposits.map((deposit) => {
    const totalBeratKg = deposit.details.reduce(
      (sum, d) => sum + Number(d.weightKg),
      0,
    );
    const totalPoin = deposit.details.reduce(
      (sum, d) => sum + Number(d.subtotalPoint),
      0,
    );

    return {
      id: deposit.id,
      kodeSetor: deposit.kodeSetor,
      tanggal: deposit.depositedAt,
      nasabah: {
        namaNasabah: deposit.customer.name,
        telp: deposit.customer.phone,
      },
      status: DEPOSIT_STATUS_MAP[deposit.status],
      totalBeratKg,
      totalPoin,
    };
  });
 }

 async findDetail(tenantId: string, id: string, user: any) {
  const deposit = await this.prisma.deposit.findFirst({
    where: { id, tenantId, deletedAt: null },
    include: {
      customer: true,
      details: {
        include: { category: true },
      },
    },
  });

  if (!deposit) {
    throw new NotFoundException('Transaksi penyetoran sampah tidak ditemukan.');
  }

  // yang akses Nasabah, Harus sampahnya sendiri
  if (user.role === 'NASABAH' && deposit.customerId !== user.customer.id) {
    throw new NotFoundException('Transaksi penyetoran sampah tidak ditemukan.');
  }

  const totalBeratKg = deposit.details.reduce(
    (sum, d) => sum + Number(d.weightKg),
    0,
  );
  const totalPoin = deposit.details.reduce(
    (sum, d) => sum + Number(d.subtotalPoint),
    0,
  );

  return {
    id: deposit.id,
    kodeSetor: deposit.kodeSetor,
    tanggal: deposit.depositedAt,
    status: DEPOSIT_STATUS_MAP[deposit.status],
    nasabah: {
      namaNasabah: deposit.customer.name,
      alamat: deposit.customer.address,
      telp: deposit.customer.phone,
    },
    totalBeratKg,
    totalPoin,
    catatanAdmin: deposit.catatanAdmin,
    detailSetors: deposit.details.map((d) => ({
      kategori: d.category.name,
      jenis: d.category.type.toLowerCase(),
      beratKg: Number(d.weightKg),
      poinPerKg: Number(d.category.pointPerKg),
      subtotalPoin: Number(d.subtotalPoint),
    })),
  };
 }

 async verify(tenantId: string, id: string, adminId: string, dto: VerifySetorSampahDto) {
  const deposit = await this.prisma.deposit.findFirst({
    where: { id, tenantId, deletedAt: null },
    include: { details: true },
  });

  if (!deposit) {
    throw new NotFoundException('Transaksi penyetoran sampah tidak ditemukan.');
  }

  const newStatus = DEPOSIT_STATUS_REVERSE_MAP[dto.status];
  if (!newStatus) {
    throw new BadRequestException('Status tidak valid.');
  }

  // Map berat real per kategori, fallback ke estimasi kalau tidak dikirim
  const realWeightMap = new Map(
    (dto.itemsReal || []).map((item) => [item.kategoriSampahId, item.beratKgReal]),
  );

  const result = await this.prisma.$transaction(async (tx) => {
    let totalPoin = 0;

    for (const detail of deposit.details) {
      const category = await tx.wasteCategory.findUnique({
        where: { id: detail.categoryId },
      });

      const finalWeight =
        realWeightMap.get(detail.categoryId) ?? Number(detail.weightKg);
      const subtotalPoin = finalWeight * Number(category!.pointPerKg);
      totalPoin += subtotalPoin;

      await tx.depositDetail.update({
        where: { id: detail.id },
        data: {
          weightKgReal: finalWeight,
          subtotalPoint: subtotalPoin,
        },
      });
    }

    const updatedDeposit = await tx.deposit.update({
      where: { id },
      data: {
        status: newStatus as any,
        catatanAdmin: dto.catatanAdmin,
        adminId,
      },
    });

    // Hanya tambahkan poin ke saldo nasabah kalau status FINAL jadi selesai
    if (newStatus === 'SELESAI') {
      await tx.customer.update({
        where: { id: deposit.customerId },
        data: { pointBalance: { increment: totalPoin } },
      });
    }

    return { updatedDeposit, totalPoin };
  });

  return {
    id: result.updatedDeposit.id,
    status: DEPOSIT_STATUS_MAP[result.updatedDeposit.status],
    totalPoin: result.totalPoin,
    catatanAdmin: result.updatedDeposit.catatanAdmin,
  };
 }
}

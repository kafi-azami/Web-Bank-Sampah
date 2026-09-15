import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateNasabahDto } from './dto/create-nasabah.dto.js';
import { UpdateNasabahDto } from './dto/update-nasabah.dto.js';
import { HashingService } from '../../shared/hashing/hashing.service.js';

@Injectable()
export class AdminNasabahService {constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
  ) {}

  private toResponse(customer: any) {
    return {
      id: customer.id,
      namaNasabah: customer.name,
      alamat: customer.address,
      telp: customer.phone,
      saldoPoin: customer.pointBalance,
      foto: customer.photo,
      user: {
        username: customer.user.username,
        role: customer.user.role,
      },
      createdAt: customer.createdAt,
    };
  }

  async findAll(tenantId: string) {
    const items = await this.prisma.customer.findMany({
      where: { tenantId, deletedAt: null },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((item) => this.toResponse(item));
  }

  async findOne(tenantId: string, id: string) {
    const item = await this.prisma.customer.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { user: true },
    });
    if (!item) throw new NotFoundException('Data nasabah tidak ditemukan.');
    return this.toResponse(item);
  }

  async create(tenantId: string, dto: CreateNasabahDto) {
    const existing = await this.prisma.user.findUnique({
      where: { tenantId_username: { tenantId, username: dto.username } },
    });
    if (existing) {
      throw new BadRequestException(
        'Username sudah digunakan pada database aplikasi Anda.',
      );
    }

    const hashedPassword = await this.hashing.hash(dto.password);

    const customer = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          tenantId,
          username: dto.username,
          password: hashedPassword,
          role: 'NASABAH',
        },
      });

      return tx.customer.create({
        data: {
          tenantId,
          userId: user.id,
          name: dto.namaNasabah,
          address: dto.alamat,
          phone: dto.telp,
        },
        include: { user: true },
      });
    });

    return this.toResponse(customer);
  }

  async update(tenantId: string, id: string, dto: UpdateNasabahDto) {
    await this.findOne(tenantId, id); // pastikan ada & milik tenant ini

    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        ...(dto.namaNasabah && { name: dto.namaNasabah }),
        ...(dto.alamat && { address: dto.alamat }),
        ...(dto.telp && { phone: dto.telp } as any),
      },
      include: { user: true },
    });

    return this.toResponse(customer);
  }

  async remove(tenantId: string, id: string, deletedBy: string) {
    await this.findOne(tenantId, id);
    await this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy },
    });
    return { id };
  }}

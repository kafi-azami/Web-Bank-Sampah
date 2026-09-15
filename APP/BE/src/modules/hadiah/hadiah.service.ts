import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateHadiahDto } from './dto/create-hadiah.dto.js';
import { UpdateHadiahDto } from './dto/update-hadiah.dto.js';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service.js';

@Injectable()
export class HadiahService {
    constructor(private readonly prisma: PrismaService, private readonly cloudinary: CloudinaryService) {}

  private toResponse(item: any) {
    return {
      id: item.id,
      namaHadiah: item.name,
      poinDibutuhkan: Number(item.pointsRequired),
      stok: item.stock,
      foto: item.photo,
    };
  }

  async findAll(tenantId: string) {
    const items = await this.prisma.reward.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
    return items.map((item) => this.toResponse(item));
  }

  async findOne(tenantId: string, id: string) {
    const item = await this.prisma.reward.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Hadiah tidak ditemukan.');
    return this.toResponse(item);
  }

  async create(
  tenantId: string,
  dto: CreateHadiahDto,
  foto?: Express.Multer.File,
  ) {
  let photoUrl: string | undefined;
  if (foto) {
    const result = await this.cloudinary.uploadImage(foto, 'hadiah');
    photoUrl = result.secure_url;
  }

  const item = await this.prisma.reward.create({
    data: {
      tenantId,
      name: dto.namaHadiah,
      pointsRequired: dto.poinDibutuhkan,
      stock: dto.stok,
      photo: photoUrl,
    },
  });
  return this.toResponse(item); 
  }

  async update(
  tenantId: string,
  id: string,
  dto: UpdateHadiahDto,
  foto?: Express.Multer.File,
  ) {
  await this.findOne(tenantId, id);

  let photoUrl: string | undefined;
  if (foto) {
    const result = await this.cloudinary.uploadImage(foto, 'hadiah');
    photoUrl = result.secure_url;
  }

  const item = await this.prisma.reward.update({
    where: { id },
    data: {
      ...(dto.namaHadiah && { name: dto.namaHadiah }),
      ...(dto.poinDibutuhkan !== undefined && {
        pointsRequired: dto.poinDibutuhkan,
      }),
      ...(dto.stok !== undefined && { stock: dto.stok }),
      ...(photoUrl && { photo: photoUrl }),
    },
  });
  return this.toResponse(item);
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.reward.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { id };
  }
}

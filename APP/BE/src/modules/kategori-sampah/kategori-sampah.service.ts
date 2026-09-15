import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateKategoriSampahDto } from './dto/create-kategori-sampah.dto.js';
import { UpdateKategoriSampahDto } from './dto/update-kategori-sampah.dto.js';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service.js';

const JENIS_MAP: Record<string, 'PLASTIK' | 'KERTAS' | 'LOGAM' | 'KACA'> = {
  plastik: 'PLASTIK',
  kertas: 'KERTAS',
  logam: 'LOGAM',
  kaca: 'KACA',
};

const JENIS_REVERSE_MAP: Record<string, string> = {
  PLASTIK: 'plastik',
  KERTAS: 'kertas',
  LOGAM: 'logam',
  KACA: 'kaca',
};

@Injectable()
export class KategoriSampahService {
    constructor(private readonly prisma: PrismaService, private readonly cloudinary: CloudinaryService) {}

  private toResponse(item: any) {
    return {
      id: item.id,
      namaKategori: item.name,
      hargaPerKg: item.pricePerKg,
      poinPerKg: item.pointPerKg,
      jenis: JENIS_REVERSE_MAP[item.type],
      foto: item.photo,
    };
  }

  async findAll(tenantId: string) {
    const items = await this.prisma.wasteCategory.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
    return items.map((item) => this.toResponse(item));
  }

  async findOne(tenantId: string, id: string) {
    const item = await this.prisma.wasteCategory.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Kategori sampah tidak ditemukan.');
    return this.toResponse(item);
  }

  async create(
  tenantId: string,
  dto: CreateKategoriSampahDto,
  foto?: Express.Multer.File, 
  ) {
  
  let photoUrl: string | undefined;
  if (foto) {
    const result = await this.cloudinary.uploadImage(foto, 'kategori-sampah');
    photoUrl = result.secure_url;
  }
  const item = await this.prisma.wasteCategory.create({
    data: {
      tenantId,
      name: dto.namaKategori,
      pricePerKg: dto.hargaPerKg,
      pointPerKg: dto.poinPerKg,
      type: JENIS_MAP[dto.jenis],
      photo: photoUrl, 
    },
  });
  return this.toResponse(item);
}

 async update(
  tenantId: string,
  id: string,
  dto: UpdateKategoriSampahDto,
  foto?: Express.Multer.File,
) {
  await this.findOne(tenantId, id);
  let photoUrl: string | undefined;
  if (foto) {
    const result = await this.cloudinary.uploadImage(foto, 'kategori-sampah');
    photoUrl = result.secure_url;
  }

  const item = await this.prisma.wasteCategory.update({
    where: { id },
    data: {
      ...(dto.namaKategori && { name: dto.namaKategori }),
      ...(dto.hargaPerKg !== undefined && { pricePerKg: dto.hargaPerKg }),
      ...(dto.poinPerKg !== undefined && { pointPerKg: dto.poinPerKg }),
      ...(dto.jenis && { type: JENIS_MAP[dto.jenis] }),
      ...(photoUrl && { photo: photoUrl }), 
    },
  });
  return this.toResponse(item);
}

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.wasteCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { id };
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { HashingService } from '../../shared/hashing/hashing.service.js';
import { RegisterNasabahDto } from './dto/register-nasabah.dto.js';
import { RegisterAdminDto } from './dto/register-admin.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly jwt: JwtService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async registerNasabah(
  tenantId: string,
  dto: RegisterNasabahDto,
  foto?: Express.Multer.File,
) {
  const existing = await this.prisma.user.findUnique({
    where: { tenantId_username: { tenantId, username: dto.username } },
  });
  if (existing) {
    throw new BadRequestException(
      'Username sudah digunakan pada database aplikasi Anda.',
    );
  }

  const hashedPassword = await this.hashing.hash(dto.password);

  let photoUrl: string | undefined;
  if (foto) {
    const result = await this.cloudinary.uploadImage(foto, 'nasabah');
    photoUrl = result.secure_url;
  }

  const user = await this.prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        tenantId,
        username: dto.username,
        password: hashedPassword,
        role: 'NASABAH',
      },
    });

    const customer = await tx.customer.create({
      data: {
        tenantId,
        userId: createdUser.id,
        name: dto.namaNasabah,
        address: dto.alamat,
        phone: dto.telp,
        photo: photoUrl,
      },
    });

    return { ...createdUser, customer };
  });

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    nasabah: {
      id: user.customer.id,
      namaNasabah: user.customer.name,
      alamat: user.customer.address,
      telp: user.customer.phone,
      saldoPoin: user.customer.pointBalance,
      foto: user.customer.photo,
    },
  };
}

  async registerAdmin(tenantId: string, dto: RegisterAdminDto) {
    const existing = await this.prisma.user.findUnique({
      where: { tenantId_username: { tenantId, username: dto.username } },
    });
    if (existing) {
      throw new BadRequestException(
        'Username sudah digunakan pada database aplikasi Anda.',
      );
    }

    const hashedPassword = await this.hashing.hash(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          tenantId,
          username: dto.username,
          password: hashedPassword,
          role: 'ADMIN_BANK',
        },
      });

      const admin = await tx.adminBank.create({
        data: {
          tenantId,
          userId: createdUser.id,
          unitName: dto.namaUnit,
          managerName: dto.namaPengelola,
          phone: dto.telp,
        },
      });

      return { ...createdUser, admin };
    });

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      adminBank: {
        id: user.admin.id,
        namaUnit: user.admin.unitName,
        namaPengelola: user.admin.managerName,
        telp: user.admin.phone,
      },
    };
  }

  async login(tenantId: string, dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { tenantId_username: { tenantId, username: dto.username } },
      include: { customer: true, admin: true },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Username atau password salah.');
    }

    const valid = await this.hashing.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Username atau password salah.');
    }

    const token = this.jwt.sign(
      { sub: user.id, tenantId, role: user.role, type: 'USER' },
      { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as any,
    );

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      nasabah: user.customer
        ? {
            id: user.customer.id,
            namaNasabah: user.customer.name,
            alamat: user.customer.address,
            telp: user.customer.phone,
            saldoPoin: user.customer.pointBalance,
            foto: user.customer.photo,
          }
        : null,
      adminBank: user.admin
        ? {
            id: user.admin.id,
            namaUnit: user.admin.unitName,
            namaPengelola: user.admin.managerName,
            telp: user.admin.phone,
          }
        : null,
      token,
    };
  }

  async me(user: any) {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      nasabah: user.customer
        ? {
            id: user.customer.id,
            namaNasabah: user.customer.name,
            alamat: user.customer.address,
            telp: user.customer.phone,
            saldoPoin: user.customer.pointBalance,
            foto: user.customer.photo,
          }
        : null,
      adminBank: user.admin
        ? {
            id: user.admin.id,
            namaUnit: user.admin.unitName,
            namaPengelola: user.admin.managerName,
            telp: user.admin.phone,
          }
        : null,
    };
  }
}
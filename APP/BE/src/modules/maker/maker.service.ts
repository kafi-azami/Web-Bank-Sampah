import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { HashingService } from '../../shared/hashing/hashing.service.js';
import { RegisterMakerDto } from './dto/register-maker.dto.js';
import { LoginMakerDto } from './dto/login-maker.dto.js';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class MakerService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashing: HashingService,
        private readonly jwt: JwtService
    ) {}

    async register(dto: RegisterMakerDto) {
    const existing = await this.prisma.tenant.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email sudah terdaftar sebagai App Maker.');
    }

    const hashedPassword = await this.hashing.hash(dto.password);
    const appKey = randomUUID();

    const tenant = await this.prisma.tenant.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        namaSiswa: dto.namaSiswa,
        kelas: dto.kelas,
        namaApp: dto.namaApp,
        name: dto.namaApp,
        appKey,
      },
    });

    const token = this.signToken(tenant.id, tenant.email);

    return this.toResponse(tenant, token);
  }

  async login(dto: LoginMakerDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { email: dto.email },
    });
    if (!tenant || tenant.deletedAt) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const valid = await this.hashing.compare(dto.password, tenant.password);
    if (!valid) {
      throw new UnauthorizedException('Email atau password salah.');
    }

    const token = this.signToken(tenant.id, tenant.email);
    return this.toResponse(tenant, token);
  }

  async getProfile(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant tidak ditemukan.');

    const [totalNasabah, totalKategoriSampah, totalTransaksiSetor, totalHadiah] =
      await Promise.all([
        this.prisma.customer.count({ where: { tenantId, deletedAt: null } }),
        this.prisma.wasteCategory.count({ where: { tenantId, deletedAt: null } }),
        this.prisma.deposit.count({ where: { tenantId, deletedAt: null } }),
        this.prisma.reward.count({ where: { tenantId, deletedAt: null } }),
      ]);

    return {
      id: tenant.id,
      email: tenant.email,
      namaSiswa: tenant.namaSiswa,
      kelas: tenant.kelas,
      namaApp: tenant.namaApp,
      appKey: tenant.appKey,
      stats: {
        totalNasabah,
        totalKategoriSampah,
        totalTransaksiSetor,
        totalHadiah,
      },
    };
  }

  async checkKey(email: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { email } });
    if (!tenant) {
      throw new NotFoundException(
        'Akun App Maker dengan email tersebut tidak ditemukan.',
      );
    }
    return {
      email: tenant.email,
      namaSiswa: tenant.namaSiswa,
      namaApp: tenant.namaApp,
      appKey: tenant.appKey,
    };
  }

  private signToken(sub: string, email: string) {
    return this.jwt.sign({ sub, email, type: 'APP_MAKER' });
  }

  private toResponse(tenant: any, token: string) {
    return {
      id: tenant.id,
      email: tenant.email,
      namaSiswa: tenant.namaSiswa,
      kelas: tenant.kelas,
      namaApp: tenant.namaApp,
      appKey: tenant.appKey,
      token,
      createdAt: tenant.createdAt,
    };
  }
}

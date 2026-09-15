import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Header Authorization Bearer wajib disertakan.');
    }

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET });
    } catch {
      throw new UnauthorizedException('Token tidak valid atau sudah kedaluwarsa.');
    }

    if (payload.type !== 'USER') {
      throw new UnauthorizedException('Token tidak valid untuk akses ini.');
    }

    // pastikan token milik tenant yang sama dengan x-app-key yang dipakai
    if (!request.tenant || payload.tenantId !== request.tenant.id) {
      throw new UnauthorizedException('Token tidak sesuai dengan App Key yang digunakan.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { customer: true, admin: true },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User tidak ditemukan.');
    }

    request.user = user; // dipakai di controller/service lain via req.user
    return true;
  }
}
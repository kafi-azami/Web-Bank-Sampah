import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AppKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const appKey = request.headers['x-app-key'];

    if (!appKey) {
      throw new UnauthorizedException('Header x-app-key wajib disertakan.');
    }

    const tenant = await this.prisma.tenant.findFirst({
      where: { appKey, deletedAt: null },
    });

    if (!tenant) {
      throw new UnauthorizedException('App Key tidak valid.');
    }

    request.tenant = tenant; // controller/service lain via req.tenant
    return true;
  }
}
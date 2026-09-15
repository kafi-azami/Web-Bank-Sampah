import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { RekapitulasiService } from './rekapitulasi.service.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';

@Controller('rekapitulasi')
@UseGuards(AppKeyGuard, UserAuthGuard, RolesGuard)
export class RekapitulasiController {
    constructor(private readonly service: RekapitulasiService) {}

    @Get('bulanan')
    @Roles('ADMIN_BANK')
    bulanan(@Req() req: any, @Query('bulan') bulan: string) {
      return this.service.bulanan(req.tenant.id, bulan);
    }
}

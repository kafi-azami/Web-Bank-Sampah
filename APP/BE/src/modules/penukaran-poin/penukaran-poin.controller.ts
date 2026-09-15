import { Body ,Controller, Get, Param, Post, Put, Req, UseGuards, Query } from '@nestjs/common';
import { PenukaranPoinService } from './penukaran-poin.service.js';
import { CreatePenukaranPoinDto } from './dto/create-penukaran-poin.dto.js';
import { UpdateStatusPenukaranDto } from './dto/update-status-penukaran.dto.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';

@Controller('penukaran-poin')
@UseGuards(AppKeyGuard, UserAuthGuard, RolesGuard)
export class PenukaranPoinController {
    constructor(private readonly service: PenukaranPoinService) {}

  @Post('tukar')
  @Roles('NASABAH')
  tukar(@Req() req: any, @Body() dto: CreatePenukaranPoinDto) {
    return this.service.tukar(req.tenant.id, req.user.customer.id, dto);
  }

  @Get('my-penukaran')
  @Roles('NASABAH')
  findMyPenukaran(@Req() req: any) {
    return this.service.findMyPenukaran(req.tenant.id, req.user.customer.id);
  }

  @Get('admin/list')
  @Roles('ADMIN_BANK')
  findAllForAdmin(@Req() req: any, @Query('bulan') bulan?: string) {
    return this.service.findAllForAdmin(req.tenant.id, bulan);
  }

  @Put('admin/status/:id')
  @Roles('ADMIN_BANK')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateStatusPenukaranDto,
  ) {
    return this.service.updateStatus(req.tenant.id, id, dto);
  }

  @Get('nota/:id')
  @Roles('NASABAH', 'ADMIN_BANK')
  findNota(@Req() req: any, @Param('id') id: string) {
    return this.service.findNota(req.tenant.id, id, req.user);
  }
}

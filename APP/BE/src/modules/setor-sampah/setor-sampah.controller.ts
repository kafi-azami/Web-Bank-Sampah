import { Controller, Body, Post, Req, UseGuards, Query, Get, Param, Put } from '@nestjs/common';
import { SetorSampahService } from './setor-sampah.service.js';
import { CreateSetorSampahDto } from './dto/create-setor-sampah.dto.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';
import { VerifySetorSampahDto } from './dto/verify-setor-sampah.dto.js';

@Controller('setor-sampah')
@UseGuards(AppKeyGuard, UserAuthGuard, RolesGuard)
export class SetorSampahController {
    constructor(private readonly service: SetorSampahService) {}

  @Post('pengajuan')
  @Roles('NASABAH')
  createPengajuan(@Req() req: any, @Body() dto: CreateSetorSampahDto) {
    return this.service.createPengajuan(req.tenant.id, req.user.customer.id, dto);
  }

  @Get('my-setor')
  @Roles('NASABAH')
  findMySetor(@Req() req: any, @Query('bulan') bulan?: string) {
  return this.service.findMySetor(req.tenant.id, req.user.customer.id, bulan);
  }

  @Get('admin/list')
  @Roles('ADMIN_BANK')
  findAllForAdmin(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('bulan') bulan?: string,
  ) {
  return this.service.findAllForAdmin(req.tenant.id, status, bulan); 
  }

  @Get(':id')
  @Roles('NASABAH', 'ADMIN_BANK')
  findDetail(@Req() req: any, @Param('id') id: string) {
  return this.service.findDetail(req.tenant.id, id, req.user);
  }

  @Put('admin/verify/:id')
  @Roles('ADMIN_BANK')
  verify(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: VerifySetorSampahDto,
  ) {
    return this.service.verify(req.tenant.id, id, req.user.admin.id, dto);
  }
}

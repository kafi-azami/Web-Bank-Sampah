import { Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { AdminNasabahService } from './admin-nasabah.service.js';
import { CreateNasabahDto } from './dto/create-nasabah.dto.js';
import { UpdateNasabahDto } from './dto/update-nasabah.dto.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';

@Controller('admin/nasabah')
@UseGuards(AppKeyGuard, UserAuthGuard, RolesGuard)
@Roles('ADMIN_BANK')
export class AdminNasabahController {
    constructor(private readonly service: AdminNasabahService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.tenant.id);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.tenant.id, id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateNasabahDto) {
    return this.service.create(req.tenant.id, dto);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateNasabahDto) {
    return this.service.update(req.tenant.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.tenant.id, id, req.user.id);
  }
}

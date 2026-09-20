import { Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AdminNasabahService } from './admin-nasabah.service.js';
import { CreateNasabahDto } from './dto/create-nasabah.dto.js';
import { UpdateNasabahDto } from './dto/update-nasabah.dto.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('foto'))
  create(
    @Req() req: any, 
    @Body() dto: CreateNasabahDto, 
    @UploadedFile() foto?: Express.Multer.File
  ) {
    return this.service.create(req.tenant.id, dto, foto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('foto'))
  update(
    @Req() req: any, 
    @Param('id') id: string, 
    @Body() dto: UpdateNasabahDto,
    @UploadedFile() foto?: Express.Multer.File
  ) {
    return this.service.update(req.tenant.id, id, dto, foto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.tenant.id, id, req.user.id);
  }
}

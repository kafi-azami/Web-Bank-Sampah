import { Controller, Body, Post, Get, Delete, Put, Param, Req, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { KategoriSampahService } from './kategori-sampah.service.js';
import { CreateKategoriSampahDto } from './dto/create-kategori-sampah.dto.js';
import { UpdateKategoriSampahDto } from './dto/update-kategori-sampah.dto.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('kategori-sampah')
@UseGuards(AppKeyGuard, UserAuthGuard, RolesGuard)
export class KategoriSampahController {
  constructor(private readonly service: KategoriSampahService) { }

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.tenant.id);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.tenant.id, id);
  }

  @Post()
  @Roles('ADMIN_BANK')
  @UseInterceptors(FileInterceptor('foto'))
  create(
    @Req() req: any,
    @Body() dto: CreateKategoriSampahDto,
    @UploadedFile() foto?: Express.Multer.File,
  ) {
    return this.service.create(req.tenant.id, dto, foto);
  }

  @Put(':id')
  @Roles('ADMIN_BANK')
  @UseInterceptors(FileInterceptor('foto'))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateKategoriSampahDto,
    @UploadedFile() foto?: Express.Multer.File,
  ) {
    return this.service.update(req.tenant.id, id, dto, foto);
  }

  @Delete(':id')
  @Roles('ADMIN_BANK')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.tenant.id, id);
  }
}

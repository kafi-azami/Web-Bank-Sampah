import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors,  UploadedFile } from '@nestjs/common';
import { HadiahService } from './hadiah.service.js';
import { CreateHadiahDto } from './dto/create-hadiah.dto.js';
import { UpdateHadiahDto } from './dto/update-hadiah.dto.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('hadiah')
@UseGuards(AppKeyGuard, UserAuthGuard, RolesGuard)
export class HadiahController {
  constructor(private readonly service: HadiahService) {}

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
  @Body() dto: CreateHadiahDto,
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
  @Body() dto: UpdateHadiahDto,
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


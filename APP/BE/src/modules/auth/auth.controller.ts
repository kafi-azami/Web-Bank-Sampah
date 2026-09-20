import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterNasabahDto } from './dto/register-nasabah.dto.js';
import { RegisterAdminDto } from './dto/register-admin.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
@UseGuards(AppKeyGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nasabah/register')
  @UseInterceptors(FileInterceptor('foto'))
  registerNasabah(
    @Req() req: any, 
    @Body() dto: RegisterNasabahDto, 
    @UploadedFile() foto?: Express.Multer.File
  ) {
    return this.authService.registerNasabah(req.tenant.id, dto, foto);
  }

  @Post('admin/register')
  registerAdmin(@Req() req: any, @Body() dto: RegisterAdminDto) {
    return this.authService.registerAdmin(req.tenant.id, dto);
  }

  @Post('login')
  login(@Req() req: any, @Body() dto: LoginUserDto) {
    return this.authService.login(req.tenant.id, dto);
  }

  @Get('me')
  @UseGuards(UserAuthGuard)
  me(@Req() req: any) {
    return this.authService.me(req.user);
  }
}
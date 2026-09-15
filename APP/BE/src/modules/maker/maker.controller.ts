import { Controller, Body, Post, Get, Query, UseGuards } from '@nestjs/common';
import { MakerService } from './maker.service.js';
import { RegisterMakerDto } from './dto/register-maker.dto.js';
import { LoginMakerDto } from './dto/login-maker.dto.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { Req } from '@nestjs/common'

@Controller('maker')
export class MakerController {
    constructor(private readonly makerService: MakerService) {}

    @Post('register')
    async register(@Body() dto: RegisterMakerDto) {
        return this.makerService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginMakerDto) {
        return this.makerService.login(dto);
    }

    @Get('profile')
    @UseGuards(AppKeyGuard)
    getProfile(@Req() req: any) {
        return this.makerService.getProfile(req.tenant.id);
    }

    @Get('check-key')
    checkKey(@Query('email') email: string) {
    return this.makerService.checkKey(email);
  }
}

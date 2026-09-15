import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';

@Controller('dashboard')
@UseGuards(AppKeyGuard)
export class DashboardController {
    constructor(private readonly service: DashboardService) {}

  @Get('summary')
  @UseGuards(UserAuthGuard, RolesGuard)
  @Roles('NASABAH')
  summary(@Req() req: any) {
    return this.service.summary(req.tenant.id, req.user.customer.id);
  }

  @Get('stats')
  stats(@Req() req: any) {
    // Endpoint ini bisa diakses hanya dengan x-app-key (App Maker) TANPA perlu login user
    return this.service.stats(req.tenant.id);
  }
}

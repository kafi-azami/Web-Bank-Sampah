import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';

@Controller('seed')
@UseGuards(AppKeyGuard)
export class SeedController {
    constructor(private readonly service: SeedService) {}

  @Post()
  run(@Req() req: any) {
    return this.service.run(req.tenant.id);
  }
}

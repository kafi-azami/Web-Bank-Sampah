import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller.js';
import { SeedService } from './seed.service.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';

@Module({
  controllers: [SeedController],
  providers: [SeedService, AppKeyGuard]
})
export class SeedModule {}

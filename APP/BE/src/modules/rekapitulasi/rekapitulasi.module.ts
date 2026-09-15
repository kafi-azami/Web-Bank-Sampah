import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RekapitulasiController } from './rekapitulasi.controller.js';
import { RekapitulasiService } from './rekapitulasi.service.js';
import { AppKeyGuard } from '../../shared/guards/app-key.guard.js';
import { UserAuthGuard } from '../../shared/guards/user-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any },
    }),
  ],

  controllers: [RekapitulasiController],
  providers: [RekapitulasiService, AppKeyGuard, UserAuthGuard, RolesGuard]
})
export class RekapitulasiModule {}

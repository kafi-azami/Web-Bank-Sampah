import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminNasabahController } from './admin-nasabah.controller.js';
import { AdminNasabahService } from './admin-nasabah.service.js';
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
  controllers: [AdminNasabahController],
  providers: [AdminNasabahService, AppKeyGuard, UserAuthGuard, RolesGuard],
})
export class AdminNasabahModule {}

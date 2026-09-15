import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { MakerModule } from './modules/maker/maker.module.js';
import { HashingModule } from './shared/hashing/hashing.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { KategoriSampahModule } from './modules/kategori-sampah/kategori-sampah.module.js';
import { AdminNasabahModule } from './modules/admin-nasabah/admin-nasabah.module.js';
import { SetorSampahModule } from './modules/setor-sampah/setor-sampah.module.js';
import { HadiahModule } from './modules/hadiah/hadiah.module.js';
import { PenukaranPoinModule } from './modules/penukaran-poin/penukaran-poin.module.js';
import { RekapitulasiModule } from './modules/rekapitulasi/rekapitulasi.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { SeedModule } from './modules/seed/seed.module.js';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    PrismaModule,
    MakerModule,
    HashingModule,
    AuthModule,
    KategoriSampahModule,
    AdminNasabahModule,
    SetorSampahModule,
    HadiahModule,
    PenukaranPoinModule,
    RekapitulasiModule,
    DashboardModule,
    SeedModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MakerController } from './maker.controller.js';
import { MakerService } from './maker.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [MakerController],
  providers: [MakerService]
})
export class MakerModule {}

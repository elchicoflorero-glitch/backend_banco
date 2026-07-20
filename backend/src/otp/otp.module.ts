import { Module } from '@nestjs/common';
import { OTPService } from './otp.service';
import { OTPController } from './otp.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OTPController],
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}

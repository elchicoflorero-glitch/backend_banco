import { Module } from '@nestjs/common';
import { WithdrawalLimitsService } from './withdrawal-limits.service';
import { WithdrawalLimitsController } from './withdrawal-limits.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WithdrawalLimitsController],
  providers: [WithdrawalLimitsService],
  exports: [WithdrawalLimitsService],
})
export class WithdrawalLimitsModule {}

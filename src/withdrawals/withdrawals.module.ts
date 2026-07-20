import { Module } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [AccountsModule, AuditLogModule],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService],
  exports: [WithdrawalsService],
})
export class WithdrawalsModule {}

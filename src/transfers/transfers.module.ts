import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AccountsModule } from '../accounts/accounts.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [AuditLogModule, AccountsModule, MailModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [AuditLogModule, MailModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
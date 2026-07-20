import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransfersModule } from './transfers/transfers.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { FraudModule } from './fraud/fraud.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OTPModule } from './otp/otp.module';
import { PDFReportModule } from './reports/pdf-report.module';
import { WithdrawalLimitsModule } from './withdrawals/withdrawal-limits.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    AccountsModule,
    TransactionsModule,
    TransfersModule,
    WithdrawalsModule,
    AuditLogModule,
    FraudModule,
    NotificationsModule,
    OTPModule,
    PDFReportModule,
    WithdrawalLimitsModule,
    MailModule,
  ],
})
export class AppModule {}
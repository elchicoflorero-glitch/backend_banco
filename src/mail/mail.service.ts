import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.logger.warn('⚠️  Email service is DISABLED (no SMTP configured)');
  }

  async sendClientCreatedEmail(
    email: string,
    _clientName?: string,
    _password?: string,
    _frontendUrl?: string,
  ): Promise<void> {
    this.logger.log(`📧 [SKIPPED] Email disabled - would send welcome email to ${email}`);
  }

  async sendWelcomeEmail(
    email: string,
    _username?: string,
    _frontendUrl?: string,
  ): Promise<void> {
    this.logger.log(`📧 [SKIPPED] Email disabled - would send welcome email to ${email}`);
  }

  async sendDepositEmail(
    recipientEmail: string,
    _clientName?: string,
    _transaction?: any,
    _accountNumber?: string,
  ): Promise<void> {
    this.logger.log(`📧 [SKIPPED] Email disabled - would send deposit email to ${recipientEmail}`);
  }

  async sendWithdrawalEmail(
    recipientEmail: string,
    _clientName?: string,
    _transaction?: any,
    _accountNumber?: string,
  ): Promise<void> {
    this.logger.log(`📧 [SKIPPED] Email disabled - would send withdrawal email to ${recipientEmail}`);
  }

  async sendTransferEmail(
    _senderEmail?: string,
    _senderName?: string,
    _recipientEmail?: string,
    _recipientName?: string,
    _transaction?: any,
    _senderAccountNumber?: string,
    _recipientAccountNumber?: string,
  ): Promise<void> {
    this.logger.log(`📧 [SKIPPED] Email disabled - would send transfer emails`);
  }
}

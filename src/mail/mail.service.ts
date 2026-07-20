import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  /**
   * Stub: Email service disabled - no-op
   */
  async sendClientCreatedEmail(
    email: string,
    clientName: string,
    password: string,
    frontendUrl?: string,
  ): Promise<void> {
    this.logger.log(`[DISABLED] Client created email would be sent to ${email}`);
  }

  /**
   * Stub: Email service disabled - no-op
   */
  async sendWelcomeEmail(
    email: string,
    username: string,
    frontendUrl?: string,
  ): Promise<void> {
    this.logger.log(`[DISABLED] Welcome email would be sent to ${email}`);
  }

  /**
   * Stub: Email service disabled - no-op
   */
  async sendDepositEmail(
    recipientEmail: string,
    clientName: string,
    transaction: any,
    accountNumber: string,
  ): Promise<void> {
    this.logger.log(`[DISABLED] Deposit email would be sent to ${recipientEmail}`);
  }

  /**
   * Stub: Email service disabled - no-op
   */
  async sendWithdrawalEmail(
    recipientEmail: string,
    clientName: string,
    transaction: any,
    accountNumber: string,
  ): Promise<void> {
    this.logger.log(`[DISABLED] Withdrawal email would be sent to ${recipientEmail}`);
  }

  /**
   * Stub: Email service disabled - no-op
   */
  async sendTransferEmail(
    senderEmail: string,
    senderName: string,
    recipientEmail: string,
    recipientName: string,
    transaction: any,
    senderAccountNumber: string,
    recipientAccountNumber: string,
  ): Promise<void> {
    this.logger.log(`[DISABLED] Transfer emails would be sent to ${senderEmail} and ${recipientEmail}`);
  }
}

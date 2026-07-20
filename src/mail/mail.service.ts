import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailTemplateService } from './email-template.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private emailTemplateService: EmailTemplateService,
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpSecure = this.configService.get<boolean>('SMTP_SECURE', false);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPassword = this.configService.get<string>('SMTP_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      connectionTimeout: 5000,
      socketTimeout: 10000,
    });
  }

  /**
   * Valida formato de email
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Envía email de creación de cliente cuando admin crea un cliente
   */
  async sendClientCreatedEmail(
    email: string,
    clientName: string,
    password: string,
    frontendUrl?: string,
  ): Promise<void> {
    if (!this.validateEmail(email)) {
      throw new BadRequestException('Invalid email address');
    }

    try {
      const url = frontendUrl || this.configService.get<string>('FRONTEND_URL');
      const html = this.emailTemplateService.renderClientCreatedEmail(
        clientName,
        email,
        password,
        url,
      );

      await this.retryEmailWithBackoff(
        {
          to: email,
          subject: 'Tu cuenta en BancoPeru ha sido creada',
          html,
        },
        3,
        5000,
      );

      this.logger.log(`Client created email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send client created email to ${email}: ${error.message}`,
      );
      // Fire-and-forget: no lanzar error para no bloquear creación del cliente
    }
  }

  /**
   * Envía email de bienvenida al crear usuario
   */
  async sendWelcomeEmail(
    email: string,
    username: string,
    frontendUrl?: string,
  ): Promise<void> {
    if (!this.validateEmail(email)) {
      throw new BadRequestException('Invalid email address');
    }

    try {
      const url = frontendUrl || this.configService.get<string>('FRONTEND_URL');
      const html = this.emailTemplateService.renderWelcomeEmail(username, url);

      await this.retryEmailWithBackoff(
        {
          to: email,
          subject: '¡Bienvenido a BancoPeru!',
          html,
        },
        3,
        5000,
      );

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${email}: ${error.message}`,
      );
      // Fire-and-forget: no lanzar error para no bloquear creación del usuario
    }
  }

  /**
   * Envía email de confirmación de transacción
   */
  async sendTransactionEmail(
    recipientEmail: string,
    clientName: string,
    transaction: any,
    accountNumber: string,
  ): Promise<void> {
    if (!this.validateEmail(recipientEmail)) {
      throw new BadRequestException('Invalid email address');
    }

    try {
      const formattedAmount = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
      }).format(transaction.amount);

      const html = this.emailTemplateService.renderTransactionEmail(
        clientName,
        formattedAmount,
        'PEN',
        transaction.createdAt?.toISOString() || new Date().toISOString(),
        transaction.type || 'deposit',
        accountNumber,
      );

      await this.retryEmailWithBackoff(
        {
          to: recipientEmail,
          subject: 'Confirmación de Transacción - BancoPeru',
          html,
        },
        3,
        5000,
      );

      this.logger.log(`Transaction email sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send transaction email to ${recipientEmail}: ${error.message}`,
      );
    }
  }

  /**
   * Método privado para enviar email
   */
  private async send(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM_EMAIL'),
      to,
      subject,
      html,
    });
  }

  /**
   * Reintentos con exponential backoff
   */
  private async retryEmailWithBackoff(
    mailOptions: any,
    maxRetries: number = 3,
    delayMs: number = 5000,
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.send(mailOptions.to, mailOptions.subject, mailOptions.html);
        return;
      } catch (error) {
        this.logger.warn(
          `Email send attempt ${attempt}/${maxRetries} failed: ${error.message}`,
        );

        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff: 5s, 10s, 20s
        const waitTime = delayMs * Math.pow(2, attempt - 1);
        await this.sleep(waitTime);
      }
    }
  }

  /**
   * Helper para dormir
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

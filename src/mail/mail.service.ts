import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const isEnabled = process.env.SMTP_USER && process.env.SMTP_PASSWORD;
    
    if (!isEnabled) {
      this.logger.warn('⚠️  Email service is DISABLED: SMTP credentials not configured');
      this.logger.warn('Set SMTP_USER and SMTP_PASSWORD to enable email');
      return;
    }

    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    this.logger.log(`📧 Initializing Email Service:`);
    this.logger.log(`   Host: ${smtpConfig.host}`);
    this.logger.log(`   Port: ${smtpConfig.port}`);
    this.logger.log(`   Secure: ${smtpConfig.secure}`);
    this.logger.log(`   User: ${smtpConfig.auth.user}`);

    this.transporter = nodemailer.createTransport(smtpConfig);

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('❌ Email service connection FAILED:', error.message);
        this.logger.error('Stack:', error.stack);
      } else {
        this.logger.log('✅ Email service is ready - SMTP connection verified');
      }
    });
  }

  async sendClientCreatedEmail(
    email: string,
    clientName: string,
    password: string,
    frontendUrl?: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`📧 [DISABLED] Email service is disabled - would send to ${email}`);
      return;
    }

    try {
      this.logger.log(`📧 Preparing welcome email for ${clientName} (${email})`);
      
      const frontend = frontendUrl || process.env.FRONTEND_URL || 'https://fronted-banco.vercel.app';
      const htmlContent = this.generateClientCreatedTemplate(clientName, email, password, frontend);

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: email,
        subject: '¡Bienvenido a BancoPeru! Tu cuenta ha sido creada 🎉',
        html: htmlContent,
      };

      this.logger.log(`📧 Sending email from ${mailOptions.from} to ${email}`);
      
      const info = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`✅ Client created email sent successfully to ${email} (ID: ${info.messageId})`);
    } catch (error) {
      this.logger.error(`❌ Failed to send client created email to ${email}:`, error.message);
      // Don't throw - email is optional, client creation should succeed
    }
  }

  async sendWelcomeEmail(
    email: string,
    username: string,
    frontendUrl?: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`[SKIPPED] Email service disabled - would send to ${email}`);
      return;
    }

    try {
      const frontend = frontendUrl || process.env.FRONTEND_URL || 'https://fronted-banco.vercel.app';
      const htmlContent = this.generateWelcomeTemplate(username, frontend);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: email,
        subject: '¡Bienvenido a BancoPeru!',
        html: htmlContent,
      });

      this.logger.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send welcome email to ${email}:`, error.message);
      throw error;
    }
  }

  async sendDepositEmail(
    recipientEmail: string,
    clientName: string,
    transaction: any,
    accountNumber: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`[SKIPPED] Email service disabled - would send to ${recipientEmail}`);
      return;
    }

    try {
      const htmlContent = this.generateDepositTemplate(clientName, transaction, accountNumber);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: recipientEmail,
        subject: `Depósito recibido en tu cuenta ${accountNumber}`,
        html: htmlContent,
      });

      this.logger.log(`✅ Deposit email sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send deposit email to ${recipientEmail}:`, error.message);
      throw error;
    }
  }

  async sendWithdrawalEmail(
    recipientEmail: string,
    clientName: string,
    transaction: any,
    accountNumber: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`[SKIPPED] Email service disabled - would send to ${recipientEmail}`);
      return;
    }

    try {
      const htmlContent = this.generateWithdrawalTemplate(clientName, transaction, accountNumber);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: recipientEmail,
        subject: `Retiro procesado desde tu cuenta ${accountNumber}`,
        html: htmlContent,
      });

      this.logger.log(`✅ Withdrawal email sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send withdrawal email to ${recipientEmail}:`, error.message);
      throw error;
    }
  }

  async sendTransferEmail(
    senderEmail: string,
    senderName: string,
    recipientEmail: string,
    recipientName: string,
    transaction: any,
    senderAccountNumber: string,
    recipientAccountNumber: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(
        `[SKIPPED] Email service disabled - would send to ${senderEmail} and ${recipientEmail}`
      );
      return;
    }

    try {
      // Send to sender
      const senderHtml = this.generateTransferSenderTemplate(
        senderName,
        recipientName,
        transaction,
        senderAccountNumber,
        recipientAccountNumber,
      );

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: senderEmail,
        subject: `Transferencia enviada a ${recipientName}`,
        html: senderHtml,
      });

      // Send to recipient
      const recipientHtml = this.generateTransferRecipientTemplate(
        recipientName,
        senderName,
        transaction,
        senderAccountNumber,
        recipientAccountNumber,
      );

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: recipientEmail,
        subject: `Transferencia recibida de ${senderName}`,
        html: recipientHtml,
      });

      this.logger.log(`✅ Transfer emails sent to ${senderEmail} and ${recipientEmail}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to send transfer emails:`,
        error.message
      );
      throw error;
    }
  }

  private generateClientCreatedTemplate(
    clientName: string,
    email: string,
    password: string,
    frontendUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .content {
            padding: 30px;
          }
          .greeting {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
          }
          .credentials-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .credential-item {
            margin: 10px 0;
            font-size: 14px;
          }
          .label {
            font-weight: bold;
            color: #667eea;
            display: inline-block;
            width: 120px;
          }
          .value {
            font-family: 'Courier New', monospace;
            color: #333;
            background-color: #f0f0f0;
            padding: 5px 10px;
            border-radius: 3px;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 10px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 13px;
          }
          .button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 30px;
            border-radius: 4px;
            text-decoration: none;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            background-color: #5568d3;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">💳 BancoPeru</div>
            <p>Sistema de Banca Digital Segura</p>
          </div>

          <div class="content">
            <div class="greeting">
              ¡Bienvenido, ${clientName}! 🎉
            </div>

            <p>Tu cuenta en BancoPeru ha sido creada exitosamente. Aquí están tus credenciales de acceso:</p>

            <div class="credentials-box">
              <div class="credential-item">
                <span class="label">Correo/DNI:</span>
                <span class="value">${email}</span>
              </div>
              <div class="credential-item">
                <span class="label">Contraseña:</span>
                <span class="value">${password}</span>
              </div>
            </div>

            <div class="warning">
              ⚠️ <strong>Importante:</strong> Guarda estas credenciales en un lugar seguro. No compartas tu contraseña con nadie. BancoPeru nunca te pedirá tu contraseña por correo.
            </div>

            <p>Accede a tu cuenta aquí:</p>
            <center>
              <a href="${frontendUrl}/login" class="button">Iniciar Sesión</a>
            </center>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Si no creaste esta cuenta o tienes problemas para acceder, por favor contacta a nuestro equipo de soporte.
            </p>
          </div>

          <div class="footer">
            <p>&copy; 2026 BancoPeru. Todos los derechos reservados.</p>
            <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateWelcomeTemplate(username: string, frontendUrl: string): string {
    return `
      <p>Hola ${username},</p>
      <p>¡Bienvenido a BancoPeru!</p>
      <p><a href="${frontendUrl}">Visita nuestra plataforma</a></p>
    `;
  }

  private generateDepositTemplate(clientName: string, transaction: any, accountNumber: string): string {
    return `
      <p>Hola ${clientName},</p>
      <p>Has recibido un depósito en tu cuenta ${accountNumber}</p>
      <p><strong>Monto:</strong> S/. ${transaction.amount}</p>
      <p><strong>Fecha:</strong> ${new Date(transaction.createdAt).toLocaleString('es-PE')}</p>
    `;
  }

  private generateWithdrawalTemplate(clientName: string, transaction: any, accountNumber: string): string {
    return `
      <p>Hola ${clientName},</p>
      <p>Se ha procesado un retiro de tu cuenta ${accountNumber}</p>
      <p><strong>Monto:</strong> S/. ${transaction.amount}</p>
      <p><strong>Fecha:</strong> ${new Date(transaction.createdAt).toLocaleString('es-PE')}</p>
    `;
  }

  private generateTransferSenderTemplate(
    senderName: string,
    recipientName: string,
    transaction: any,
    senderAccountNumber: string,
    recipientAccountNumber: string,
  ): string {
    return `
      <p>Hola ${senderName},</p>
      <p>Tu transferencia a ${recipientName} ha sido procesada exitosamente</p>
      <p><strong>Monto:</strong> S/. ${transaction.amount}</p>
      <p><strong>De:</strong> ${senderAccountNumber}</p>
      <p><strong>Para:</strong> ${recipientAccountNumber}</p>
      <p><strong>Fecha:</strong> ${new Date(transaction.createdAt).toLocaleString('es-PE')}</p>
    `;
  }

  private generateTransferRecipientTemplate(
    recipientName: string,
    senderName: string,
    transaction: any,
    senderAccountNumber: string,
    recipientAccountNumber: string,
  ): string {
    return `
      <p>Hola ${recipientName},</p>
      <p>Has recibido una transferencia de ${senderName}</p>
      <p><strong>Monto:</strong> S/. ${transaction.amount}</p>
      <p><strong>De:</strong> ${senderAccountNumber}</p>
      <p><strong>Para:</strong> ${recipientAccountNumber}</p>
      <p><strong>Fecha:</strong> ${new Date(transaction.createdAt).toLocaleString('es-PE')}</p>
    `;
  }
}

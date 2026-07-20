import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger('EmailService');

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Configurar según el proveedor de email
    // Por defecto usamos Gmail o un servidor SMTP personalizado
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    this.transporter = nodemailer.createTransport(smtpConfig);

    // Verificar conexión
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Email service connection failed:', error);
      } else {
        this.logger.log('Email service is ready to send messages');
      }
    });
  }

  async sendWelcomeEmail(
    email: string,
    username: string,
    password: string,
    fullName?: string,
  ): Promise<void> {
    try {
      const htmlContent = this.generateWelcomeTemplate(username, password, fullName);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: email,
        subject: '¡Bienvenido a BancoPeru! 🎉',
        html: htmlContent,
      });

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }

  private generateWelcomeTemplate(
    username: string,
    password: string,
    fullName?: string,
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
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">💳 BancoPeru</div>
            <p>Sistema de Banca Digital</p>
          </div>

          <div class="content">
            <div class="greeting">
              ¡Bienvenido${fullName ? ` ${fullName}` : ''}! 🎉
            </div>

            <p>Tu cuenta en BancoPeru ha sido creada exitosamente. Aquí están tus credenciales de acceso:</p>

            <div class="credentials-box">
              <div class="credential-item">
                <span class="label">Usuario:</span>
                <span class="value">${username}</span>
              </div>
              <div class="credential-item">
                <span class="label">Contraseña:</span>
                <span class="value">${password}</span>
              </div>
            </div>

            <div class="warning">
              ⚠️ <strong>Importante:</strong> Guarda estas credenciales en un lugar seguro. No compartas tu contraseña con nadie. BancoPeru nunca te pedirá tu contraseña por correo.
            </div>

            <p>Puedes acceder a tu cuenta en:</p>
            <center>
              <a href="${process.env.FRONTEND_URL || 'https://fronted-banco.vercel.app'}/login" class="button">
                Acceder a tu Cuenta
              </a>
            </center>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Si no creaste esta cuenta o tienes problemas para acceder, por favor contacta a nuestro equipo de soporte.
            </p>
          </div>

          <div class="footer">
            <p>&copy; 2024 BancoPeru. Todos los derechos reservados.</p>
            <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendAccountCreatedNotification(
    adminEmail: string,
    username: string,
    userEmail: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to: adminEmail,
        subject: `Nueva cuenta creada: ${username}`,
        html: `
          <p>Se ha creado una nueva cuenta en el sistema:</p>
          <p><strong>Usuario:</strong> ${username}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p>Fecha: ${new Date().toLocaleString('es-PE')}</p>
        `,
      });

      this.logger.log(`Account notification email sent to admin`);
    } catch (error) {
      this.logger.error(`Failed to send account notification:`, error);
      // No lanzar error aquí, es una notificación secundaria
    }
  }
}

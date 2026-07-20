import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplateService {
  /**
   * Renderiza plantilla de email de bienvenida
   */
  renderWelcomeEmail(username: string, frontendUrl: string): string {
    const escapedUsername = this.escapeHtml(username);
    const escapedUrl = this.escapeHtml(frontendUrl);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 30px;
              color: #333;
            }
            .content h2 {
              color: #667eea;
              margin-top: 0;
            }
            .content p {
              line-height: 1.6;
              margin: 15px 0;
            }
            .cta-button {
              display: inline-block;
              background-color: #667eea;
              color: white;
              padding: 12px 30px;
              border-radius: 4px;
              text-decoration: none;
              margin: 20px 0;
              font-weight: bold;
            }
            .cta-button:hover {
              background-color: #764ba2;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #e0e0e0;
            }
            .footer a {
              color: #667eea;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a BancoPeru!</h1>
            </div>
            <div class="content">
              <h2>Hola ${escapedUsername},</h2>
              <p>
                Nos complace darte la bienvenida a BancoPeru, tu banco digital de confianza.
                Tu cuenta ha sido creada exitosamente.
              </p>
              <p>
                Ahora puedes acceder a todas nuestras funciones:
              </p>
              <ul>
                <li>Consulta de saldos e historial de transacciones</li>
                <li>Transferencias rápidas y seguras</li>
                <li>Pagos de servicios</li>
                <li>Retiros en cajeros automáticos</li>
              </ul>
              <p style="text-align: center;">
                <a href="${escapedUrl}" class="cta-button">Acceder a mi cuenta</a>
              </p>
              <p>
                Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
                Estamos aquí para ayudarte.
              </p>
            </div>
            <div class="footer">
              <p>© 2026 BancoPeru. Todos los derechos reservados.</p>
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Renderiza plantilla de email de confirmación de transacción
   */
  renderTransactionEmail(
    clientName: string,
    amount: string,
    currency: string,
    timestamp: string,
    transactionType: string = 'deposit',
    accountNumber: string,
  ): string {
    const escapedClientName = this.escapeHtml(clientName);
    const escapedAmount = this.escapeHtml(amount);
    const escapedAccountNumber = this.escapeHtml(accountNumber);
    const lastFourDigits = escapedAccountNumber.slice(-4);

    const getTransactionTitle = (type: string): string => {
      switch (type) {
        case 'withdrawal':
          return 'Retiro de Fondos';
        case 'transfer':
          return 'Transferencia Realizada';
        default:
          return 'Depósito Recibido';
      }
    };

    const getTransactionMessage = (type: string): string => {
      switch (type) {
        case 'withdrawal':
          return 'Has retirado fondos de tu cuenta';
        case 'transfer':
          return 'Has realizado una transferencia';
        default:
          return 'Has recibido un depósito';
      }
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
              color: #333;
            }
            .transaction-box {
              background-color: #f9f9f9;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .transaction-detail {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .transaction-detail:last-child {
              border-bottom: none;
            }
            .transaction-detail .label {
              font-weight: bold;
              color: #667eea;
            }
            .transaction-detail .value {
              color: #333;
            }
            .amount-highlight {
              font-size: 24px;
              font-weight: bold;
              color: #667eea;
              margin: 15px 0;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #e0e0e0;
            }
            .security-note {
              background-color: #fffbea;
              border: 1px solid #ffe7a1;
              padding: 12px;
              border-radius: 4px;
              margin: 15px 0;
              font-size: 12px;
              color: #8b7000;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${getTransactionTitle(transactionType)}</h1>
            </div>
            <div class="content">
              <p>Hola ${escapedClientName},</p>
              <p>
                ${getTransactionMessage(transactionType)} en BancoPeru. Aquí están los detalles:
              </p>
              <div class="transaction-box">
                <div class="transaction-detail">
                  <span class="label">Tipo de Transacción:</span>
                  <span class="value">${getTransactionTitle(transactionType)}</span>
                </div>
                <div class="transaction-detail">
                  <span class="label">Monto:</span>
                  <span class="value">${escapedAmount}</span>
                </div>
                <div class="transaction-detail">
                  <span class="label">Fecha y Hora:</span>
                  <span class="value">${formattedDate}</span>
                </div>
                <div class="transaction-detail">
                  <span class="label">Cuenta:</span>
                  <span class="value">****${lastFourDigits}</span>
                </div>
              </div>
              <div class="security-note">
                <strong>Nota de Seguridad:</strong> Si no realizaste esta transacción, 
                contacta inmediatamente con nuestro equipo de soporte.
              </div>
              <p>
                Gracias por confiar en BancoPeru. Si tienes preguntas, no dudes en contactarnos.
              </p>
            </div>
            <div class="footer">
              <p>© 2026 BancoPeru. Todos los derechos reservados.</p>
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Escapa caracteres HTML para prevenir XSS
   */
  private escapeHtml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { EmailTemplateService } from './email-template.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;
  let emailTemplateService: EmailTemplateService;
  let mockSendMail: jest.Mock;

  beforeEach(async () => {
    mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' });

    const mockTransporter = {
      sendMail: mockSendMail,
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const config: { [key: string]: any } = {
                SMTP_HOST: 'smtp.gmail.com',
                SMTP_PORT: 587,
                SMTP_SECURE: false,
                SMTP_USER: 'test@gmail.com',
                SMTP_PASSWORD: 'test-password',
                SMTP_FROM_EMAIL: 'noreply@bancoperu.com',
                FRONTEND_URL: 'https://fronted-banco.vercel.app',
              };
              return config[key];
            },
          },
        },
        {
          provide: EmailTemplateService,
          useValue: {
            renderWelcomeEmail: jest.fn().mockReturnValue('<h1>Welcome</h1>'),
            renderClientCreatedEmail: jest
              .fn()
              .mockReturnValue('<h1>Client Created</h1>'),
            renderTransactionEmail: jest
              .fn()
              .mockReturnValue('<h1>Transaction</h1>'),
            renderTransferEmailSender: jest
              .fn()
              .mockReturnValue('<h1>Transfer Sent</h1>'),
            renderTransferEmailRecipient: jest
              .fn()
              .mockReturnValue('<h1>Transfer Received</h1>'),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
    emailTemplateService = module.get<EmailTemplateService>(
      EmailTemplateService,
    );
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with valid email address', async () => {
      const email = 'user@example.com';
      const username = 'testuser';

      await service.sendWelcomeEmail(email, username);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: '¡Bienvenido a BancoPeru!',
          from: 'noreply@bancoperu.com',
        }),
      );
    });

    it('should throw BadRequestException with invalid email', async () => {
      const invalidEmail = 'invalid-email';
      const username = 'testuser';

      await expect(
        service.sendWelcomeEmail(invalidEmail, username),
      ).rejects.toThrow('Invalid email address');
    });

    it('should retry on failure', async () => {
      mockSendMail
        .mockRejectedValueOnce(new Error('SMTP Error'))
        .mockResolvedValueOnce({ messageId: 'test-id' });

      const email = 'user@example.com';
      const username = 'testuser';

      await service.sendWelcomeEmail(email, username);

      expect(mockSendMail).toHaveBeenCalledTimes(2);
    });
  });

  describe('sendDepositEmail', () => {
    it('should send deposit confirmation email', async () => {
      const recipientEmail = 'client@example.com';
      const clientName = 'John Doe';
      const transaction = {
        amount: 1000,
        type: 'deposit',
        createdAt: new Date(),
      };
      const accountNumber = '****6789';

      await service.sendDepositEmail(
        recipientEmail,
        clientName,
        transaction,
        accountNumber,
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: recipientEmail,
          subject: 'Confirmación de Depósito - BancoPeru',
        }),
      );
    });

    it('should throw BadRequestException with invalid email', async () => {
      const invalidEmail = 'invalid-email';
      const transaction = { amount: 1000 };

      await expect(
        service.sendDepositEmail(
          invalidEmail,
          'John Doe',
          transaction,
          '****6789',
        ),
      ).rejects.toThrow('Invalid email address');
    });
  });

  describe('sendWithdrawalEmail', () => {
    it('should send withdrawal confirmation email', async () => {
      const recipientEmail = 'client@example.com';
      const clientName = 'John Doe';
      const transaction = {
        amount: 500,
        type: 'withdrawal',
        createdAt: new Date(),
      };
      const accountNumber = '****6789';

      await service.sendWithdrawalEmail(
        recipientEmail,
        clientName,
        transaction,
        accountNumber,
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: recipientEmail,
          subject: 'Confirmación de Retiro - BancoPeru',
        }),
      );
    });
  });

  describe('sendTransferEmail', () => {
    it('should send transfer emails to both sender and recipient', async () => {
      const senderEmail = 'sender@example.com';
      const recipientEmail = 'recipient@example.com';
      const transaction = {
        amount: 2000,
        type: 'transfer',
        createdAt: new Date(),
      };

      await service.sendTransferEmail(
        senderEmail,
        'John Doe',
        recipientEmail,
        'Jane Smith',
        transaction,
        '****1234',
        '****5678',
      );

      expect(mockSendMail).toHaveBeenCalledTimes(2);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: senderEmail,
          subject: 'Confirmación de Transferencia Enviada - BancoPeru',
        }),
      );
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: recipientEmail,
          subject: 'Confirmación de Transferencia Recibida - BancoPeru',
        }),
      );
    });
  });

  describe('sendTransactionEmail', () => {
    it('should send transaction confirmation email', async () => {
      const recipientEmail = 'client@example.com';
      const clientName = 'John Doe';
      const transaction = {
        amount: 1000,
        type: 'deposit',
        createdAt: new Date(),
      };
      const accountNumber = '123456789';

      await service.sendDepositEmail(
        recipientEmail,
        clientName,
        transaction,
        accountNumber,
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: recipientEmail,
          subject: 'Confirmación de Depósito - BancoPeru',
        }),
      );
    });

    it('should throw BadRequestException with invalid email', async () => {
      const invalidEmail = 'invalid-email';
      const transaction = { amount: 1000 };

      await expect(
        service.sendDepositEmail(
          invalidEmail,
          'John Doe',
          transaction,
          '123456789',
        ),
      ).rejects.toThrow('Invalid email address');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'user+tag@example.com',
      ];

      // We need to test the private method through public methods
      validEmails.forEach((email) => {
        expect(() => {
          // Testing that it doesn't throw
          const result = service['validateEmail'](email);
          expect(result).toBe(true);
        }).not.toThrow();
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = ['invalid', 'user@', '@example.com', 'user@example'];

      invalidEmails.forEach((email) => {
        const result = service['validateEmail'](email);
        expect(result).toBe(false);
      });
    });
  });
});

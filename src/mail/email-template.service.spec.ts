import { Test, TestingModule } from '@nestjs/testing';
import { EmailTemplateService } from './email-template.service';

describe('EmailTemplateService', () => {
  let service: EmailTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailTemplateService],
    }).compile();

    service = module.get<EmailTemplateService>(EmailTemplateService);
  });

  describe('renderWelcomeEmail', () => {
    it('should render welcome email with username', () => {
      const username = 'testuser';
      const url = 'https://example.com';

      const html = service.renderWelcomeEmail(username, url);

      expect(html).toContain('testuser');
      expect(html).toContain('https://example.com');
      expect(html).toContain('¡Bienvenido a BancoPeru!');
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('should escape HTML in username to prevent XSS', () => {
      const maliciousUsername = '<script>alert("xss")</script>';
      const url = 'https://example.com';

      const html = service.renderWelcomeEmail(maliciousUsername, url);

      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>');
    });

    it('should escape HTML in URL', () => {
      const username = 'testuser';
      const maliciousUrl = 'javascript:alert("xss")';

      const html = service.renderWelcomeEmail(username, maliciousUrl);

      expect(html).not.toContain('javascript:');
    });
  });

  describe('renderTransactionEmail', () => {
    it('should render transaction email with all details', () => {
      const clientName = 'John Doe';
      const amount = 'S/ 1,000.00';
      const currency = 'PEN';
      const timestamp = new Date('2026-07-20T12:00:00Z').toISOString();
      const transactionType = 'deposit';
      const accountNumber = '1234567890';

      const html = service.renderTransactionEmail(
        clientName,
        amount,
        currency,
        timestamp,
        transactionType,
        accountNumber,
      );

      expect(html).toContain('John Doe');
      expect(html).toContain('S/ 1,000.00');
      expect(html).toContain('Depósito Recibido');
      expect(html).toContain('****7890'); // Last 4 digits
      expect(html).not.toContain('1234567890'); // Full account number should not appear
    });

    it('should handle withdrawal transaction type', () => {
      const html = service.renderTransactionEmail(
        'John Doe',
        'S/ 500.00',
        'PEN',
        new Date().toISOString(),
        'withdrawal',
        '1234567890',
      );

      expect(html).toContain('Retiro de Fondos');
      expect(html).toContain('retirado fondos');
    });

    it('should handle transfer transaction type', () => {
      const html = service.renderTransactionEmail(
        'John Doe',
        'S/ 2,000.00',
        'PEN',
        new Date().toISOString(),
        'transfer',
        '1234567890',
      );

      expect(html).toContain('Transferencia Realizada');
      expect(html).toContain('realizado una transferencia');
    });

    it('should escape HTML in client name to prevent XSS', () => {
      const maliciousName = '<img src=x onerror=alert("xss")>';
      const html = service.renderTransactionEmail(
        maliciousName,
        'S/ 1,000.00',
        'PEN',
        new Date().toISOString(),
        'deposit',
        '1234567890',
      );

      expect(html).toContain('&lt;img');
      expect(html).not.toContain('<img src=x');
    });

    it('should only show last 4 digits of account number', () => {
      const accountNumber = '9876543210';
      const html = service.renderTransactionEmail(
        'John Doe',
        'S/ 1,000.00',
        'PEN',
        new Date().toISOString(),
        'deposit',
        accountNumber,
      );

      expect(html).toContain('****3210');
      expect(html).not.toContain('9876543210');
    });

    it('should format date in Spanish locale', () => {
      const timestamp = new Date('2026-07-20T12:00:00Z').toISOString();
      const html = service.renderTransactionEmail(
        'John Doe',
        'S/ 1,000.00',
        'PEN',
        timestamp,
        'deposit',
        '1234567890',
      );

      // Should contain the formatted date (Spanish locale)
      expect(html).toMatch(/\d{1,2}\s+de\s+\w+/); // e.g., "20 de julio"
    });
  });

  describe('escapeHtml', () => {
    it('should escape all HTML special characters', () => {
      const input = '<script>&"\'</script>';
      const escaped = service['escapeHtml'](input);

      expect(escaped).toBe('&lt;script&gt;&amp;&quot;&#039;&lt;/script&gt;');
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).not.toContain('"');
    });

    it('should handle empty strings', () => {
      const escaped = service['escapeHtml']('');
      expect(escaped).toBe('');
    });

    it('should handle null values', () => {
      const escaped = service['escapeHtml'](null as any);
      expect(escaped).toBe('');
    });

    it('should not modify normal strings', () => {
      const input = 'Hello World 123';
      const escaped = service['escapeHtml'](input);
      expect(escaped).toBe(input);
    });
  });
});

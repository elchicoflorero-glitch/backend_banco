import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { MailService } from '../mail/mail.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
    private mailService: MailService,
  ) {}

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        sourceAccount: {
          include: { client: true },
        },
        destinationAccount: {
          include: { client: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAccount(accountId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { sourceAccountId: accountId },
          { destinationAccountId: accountId },
        ],
      },
      include: {
        sourceAccount: {
          include: { client: true },
        },
        destinationAccount: {
          include: { client: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByClientId(clientId: string) {
    // Get all accounts for this client
    const accounts = await this.prisma.account.findMany({
      where: { clientId },
      select: { id: true },
    });

    const accountIds = accounts.map(a => a.id);

    // Get transactions where any of the client's accounts are involved
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { sourceAccountId: { in: accountIds } },
          { destinationAccountId: { in: accountIds } },
        ],
      },
      include: {
        sourceAccount: {
          include: { client: true },
        },
        destinationAccount: {
          include: { client: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAccountNumber(accountNumber: string) {
    const account = await this.prisma.account.findUnique({
      where: { accountNumber },
    });

    if (!account) {
      return [];
    }

    return this.findByAccount(account.id);
  }

  async findByDateRange(startDate?: Date, endDate?: Date) {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    return this.prisma.transaction.findMany({
      where,
      include: {
        sourceAccount: {
          include: { client: true },
        },
        destinationAccount: {
          include: { client: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deposit(accountId: string, amount: number, description?: string, userId?: string) {
    // Verify account exists
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { client: true },
    });

    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    // Create deposit transaction and update balance in a transaction
    const transaction = await this.prisma.$transaction(async (prisma) => {
      // Update account balance
      await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: new Decimal(amount),
          },
        },
      });

      // Create transaction record
      return prisma.transaction.create({
        data: {
          amount: new Decimal(amount),
          destinationAccountId: accountId,
          type: 'deposit',
          status: 'completed',
          description: description || `Depósito a ${account.accountNumber}`,
        },
        include: {
          destinationAccount: {
            include: { client: true },
          },
        },
      });
    });

    // Log the deposit (wrapped in try-catch to prevent error from blocking the response)
    try {
      await this.auditLogService.create({
        operation: 'DEPOSIT',
        userId: userId,
        entityType: 'TRANSACTION',
        entityId: transaction.id,
        details: {
          amount: amount,
          accountId: accountId,
          accountNumber: account.accountNumber,
          description: description || 'Depósito',
          clientName: `${account.client.firstName} ${account.client.lastName}`,
        },
      });
    } catch (err) {
      // Log error but don't throw - the deposit already succeeded
      console.error('Error creating audit log:', err);
    }

    // Send transaction confirmation email (fire-and-forget pattern)
    this.mailService
      .sendDepositEmail(
        account.client.email,
        `${account.client.firstName} ${account.client.lastName}`,
        transaction,
        account.accountNumber,
      )
      .catch((err) => {
        console.error('Error sending deposit email:', err.message);
      });

    return transaction;
  }
}
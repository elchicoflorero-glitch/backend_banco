import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AccountsService } from '../accounts/accounts.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WithdrawalsService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
    private accountsService: AccountsService,
  ) {}

  async withdraw(createWithdrawalDto: CreateWithdrawalDto, userId: string) {
    const { accountNumber, amount, reason } = createWithdrawalDto;

    // Validate amount
    if (amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than zero');
    }

    // Find account
    const account = await this.accountsService.findByAccountNumber(accountNumber);
    if (!account) {
      throw new NotFoundException(`Account ${accountNumber} not found`);
    }

    // Check sufficient balance
    const withdrawalAmount = new Decimal(amount);
    if (account.balance.lessThan(withdrawalAmount)) {
      throw new BadRequestException('Insufficient balance for withdrawal');
    }

    // Get the client to obtain their associated userId for auditing
    const client = await this.prisma.client.findUnique({
      where: { id: account.clientId },
      include: { user: true },
    });

    const auditUserId = client?.user?.id || userId;

    // Execute withdrawal in transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Update account balance
      const updatedAccount = await prisma.account.update({
        where: { id: account.id },
        data: { balance: account.balance.minus(withdrawalAmount) },
        include: { client: true },
      });

      // Create withdrawal transaction record
      const transaction = await prisma.transaction.create({
        data: {
          amount: withdrawalAmount,
          sourceAccountId: account.id,
          destinationAccountId: account.id,
          description: reason || 'Withdrawal',
          type: 'WITHDRAWAL',
        },
        include: {
          sourceAccount: { include: { client: true } },
        },
      });

      return {
        transaction,
        account: updatedAccount,
      };
    });

    // Log the withdrawal (wrapped in try-catch to prevent error from blocking the response)
    try {
      await this.auditLogService.create({
        operation: 'WITHDRAWAL',
        userId: auditUserId,
        entityType: 'TRANSACTION',
        entityId: result.transaction.id,
        details: {
          amount: amount,
          accountNumber: accountNumber,
          reason: reason || 'Withdrawal',
          clientName: `${result.account.client.firstName} ${result.account.client.lastName}`,
        },
      });
    } catch (err) {
      // Log error but don't throw - the withdrawal already succeeded
      console.error('Error creating audit log:', err);
    }

    return {
      message: 'Withdrawal completed successfully',
      transactionId: result.transaction.id,
      transaction: result.transaction,
      account: {
        accountNumber: result.account.accountNumber,
        newBalance: result.account.balance,
        clientName: `${result.account.client.firstName} ${result.account.client.lastName}`,
      },
    };
  }

  async getWithdrawalHistory(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: 'WITHDRAWAL',
        sourceAccount: {
          client: {
            userId: userId,
          },
        },
      },
      include: {
        sourceAccount: { include: { client: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return transactions;
  }
}

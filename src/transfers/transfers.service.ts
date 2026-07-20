import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AccountsService } from '../accounts/accounts.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransfersService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
    private accountsService: AccountsService,
  ) {}

  async transfer(createTransferDto: CreateTransferDto, userId: string) {
    const { fromAccountNumber, toAccountNumber, amount } = createTransferDto;

    // Validate amount
    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be greater than zero');
    }

    // Find source account
    const sourceAccount = await this.accountsService.findByAccountNumber(fromAccountNumber);
    if (!sourceAccount) {
      throw new NotFoundException(`Source account ${fromAccountNumber} not found`);
    }

    // Find destination account
    const destinationAccount = await this.accountsService.findByAccountNumber(toAccountNumber);
    if (!destinationAccount) {
      throw new NotFoundException(`Destination account ${toAccountNumber} not found`);
    }

    // Check if source and destination are different
    if (sourceAccount.id === destinationAccount.id) {
      throw new BadRequestException('Source and destination accounts must be different');
    }

    // Check sufficient balance
    const transferAmount = new Decimal(amount);
    if (sourceAccount.balance.lessThan(transferAmount)) {
      throw new BadRequestException('Insufficient balance in source account');
    }

    // Execute transfer in transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Update source account balance
      const updatedSourceAccount = await prisma.account.update({
        where: { id: sourceAccount.id },
        data: { balance: sourceAccount.balance.minus(transferAmount) },
        include: { client: true },
      });

      // Update destination account balance
      const updatedDestinationAccount = await prisma.account.update({
        where: { id: destinationAccount.id },
        data: { balance: destinationAccount.balance.plus(transferAmount) },
        include: { client: true },
      });

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          amount: transferAmount,
          sourceAccountId: sourceAccount.id,
          destinationAccountId: destinationAccount.id,
        },
        include: {
          sourceAccount: { include: { client: true } },
          destinationAccount: { include: { client: true } },
        },
      });

      return {
        transaction,
        sourceAccount: updatedSourceAccount,
        destinationAccount: updatedDestinationAccount,
      };
    });

    // Log the transfer (wrapped in try-catch to prevent error from blocking the response)
    try {
      await this.auditLogService.create({
        operation: 'TRANSFER',
        userId,
        entityType: 'TRANSACTION',
        entityId: result.transaction.id,
        details: {
          amount: amount,
          sourceAccountNumber: fromAccountNumber,
          destinationAccountNumber: toAccountNumber,
          sourceClientName: `${result.sourceAccount.client.firstName} ${result.sourceAccount.client.lastName}`,
          destinationClientName: `${result.destinationAccount.client.firstName} ${result.destinationAccount.client.lastName}`,
        },
      });
    } catch (err) {
      // Log error but don't throw - the transfer already succeeded
      console.error('Error creating audit log:', err);
    }

    return {
      message: 'Transfer completed successfully',
      transactionId: result.transaction.id,
      transaction: result.transaction,
      sourceAccount: {
        accountNumber: result.sourceAccount.accountNumber,
        newBalance: result.sourceAccount.balance,
        clientName: `${result.sourceAccount.client.firstName} ${result.sourceAccount.client.lastName}`,
      },
      destinationAccount: {
        accountNumber: result.destinationAccount.accountNumber,
        newBalance: result.destinationAccount.balance,
        clientName: `${result.destinationAccount.client.firstName} ${result.destinationAccount.client.lastName}`,
      },
    };
  }
}
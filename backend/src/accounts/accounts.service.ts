import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async create(createAccountDto: CreateAccountDto, userId: string) {
    // Verify client exists
    const client = await this.prisma.client.findUnique({
      where: { id: createAccountDto.clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${createAccountDto.clientId} not found`);
    }

    // Generate unique account number
    let accountNumber: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      accountNumber = this.generateAccountNumber();
      const existingAccount = await this.prisma.account.findUnique({
        where: { accountNumber },
      });
      if (!existingAccount) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new ConflictException('Unable to generate unique account number');
    }

    const account = await this.prisma.account.create({
      data: {
        accountNumber,
        clientId: createAccountDto.clientId,
        currency: createAccountDto.currency || 'PEN',
        balance: 0,
      },
      include: {
        client: true,
      },
    });

    // Log the creation
    await this.auditLogService.create({
      operation: 'ACCOUNT_CREATE',
      userId,
      entityType: 'ACCOUNT',
      entityId: account.id,
      details: { 
        accountNumber: account.accountNumber,
        clientId: account.clientId,
        clientName: `${client.firstName} ${client.lastName}`,
        currency: account.currency,
      },
    });

    return account;
  }

  async findAll() {
    return this.prisma.account.findMany({
      include: {
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByClient(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    return this.prisma.account.findMany({
      where: { clientId },
      include: {
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        client: true,
        sentTransactions: {
          include: {
            destinationAccount: {
              include: {
                client: true,
              },
            },
          },
        },
        receivedTransactions: {
          include: {
            sourceAccount: {
              include: {
                client: true,
              },
            },
          },
        },
      },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async findByAccountNumber(accountNumber: string) {
    return this.prisma.account.findUnique({
      where: { accountNumber },
      include: {
        client: true,
      },
    });
  }

  async update(id: string, updateAccountDto: UpdateAccountDto, userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    const updateData: any = {};

    if (updateAccountDto.currency && updateAccountDto.currency !== account.currency) {
      updateData.currency = updateAccountDto.currency;
    }

    if (Object.keys(updateData).length === 0) {
      return account;
    }

    const updatedAccount = await this.prisma.account.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
      },
    });

    // Log the update
    await this.auditLogService.create({
      operation: 'ACCOUNT_UPDATE',
      userId,
      entityType: 'ACCOUNT',
      entityId: id,
      details: {
        accountNumber: updatedAccount.accountNumber,
        changes: updateData,
      },
    });

    return updatedAccount;
  }

  async delete(id: string, userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    await this.prisma.account.delete({
      where: { id },
    });

    // Log the deletion
    await this.auditLogService.create({
      operation: 'ACCOUNT_DELETE',
      userId,
      entityType: 'ACCOUNT',
      entityId: id,
      details: {
        accountNumber: account.accountNumber,
        clientId: account.clientId,
        clientName: `${account.client.firstName} ${account.client.lastName}`,
      },
    });

    return { message: 'Account deleted successfully' };
  }

  private generateAccountNumber(): string {
    return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  }
}
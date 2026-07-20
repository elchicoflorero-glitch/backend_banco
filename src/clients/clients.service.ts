import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async create(createClientDto: CreateClientDto, userId: string) {
    // Check if DNI already exists
    const existingClient = await this.prisma.client.findUnique({
      where: { dni: createClientDto.dni },
    });
    if (existingClient) {
      throw new ConflictException('DNI already exists');
    }

    // Hash the password
    const hashedPassword = await hash(createClientDto.password, 10);

    const client = await this.prisma.client.create({
      data: {
        ...createClientDto,
        password: hashedPassword,
      },
    });

    // Log the creation
    await this.auditLogService.create({
      operation: 'CLIENT_CREATE',
      userId,
      entityType: 'CLIENT',
      entityId: client.id,
      details: { dni: client.dni, name: `${client.firstName} ${client.lastName}` },
    });

    return client;
  }

  async findAll() {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDni(dni: string) {
    const client = await this.prisma.client.findUnique({
      where: { dni },
    });
    if (!client) {
      throw new NotFoundException(`Client with DNI ${dni} not found`);
    }
    return client;
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, userId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // Hash password if it's being updated
    const dataToUpdate = { ...updateClientDto };
    if (updateClientDto.password) {
      dataToUpdate.password = await hash(updateClientDto.password, 10);
    }

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: dataToUpdate,
    });

    // Log the update
    await this.auditLogService.create({
      operation: 'CLIENT_UPDATE',
      userId,
      entityType: 'CLIENT',
      entityId: id,
      details: updateClientDto,
    });

    return updatedClient;
  }

  async remove(id: string, userId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // Check if client has accounts with non-zero balances
    const accountsWithBalance = client.accounts.filter(
      account => account.balance.toNumber() !== 0
    );
    if (accountsWithBalance.length > 0) {
      throw new BadRequestException(
        'Cannot delete client with active accounts that have non-zero balances'
      );
    }

    await this.prisma.client.delete({
      where: { id },
    });

    // Log the deletion
    await this.auditLogService.create({
      operation: 'CLIENT_DELETE',
      userId,
      entityType: 'CLIENT',
      entityId: id,
      details: { dni: client.dni, name: `${client.firstName} ${client.lastName}` },
    });

    return { message: 'Client deleted successfully' };
  }
}